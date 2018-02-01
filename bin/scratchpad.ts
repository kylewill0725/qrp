import {Item, ItemDrop, Relic, itemIds} from '../relic';
import {DOMParser} from "xmldom";
import * as select from 'xpath.js';
import * as https from 'https';
import * as fs from "fs";
import * as ps from 'play-sound';
import {setTimeout} from "timers";
import {Order, OrderCollection, OrderItem} from "../order";

const purities = {
    'intact': [0.2533, 0.11, 0.02],
    'exceptional': [0.2333, 0.13, 0.04],
    'flawless': [0.2, 0.17, 0.06],
    'radiant': [0.1667, 0.2, 0.1]
};

let relics: { lastUpdated: Date, relics: Relic[] };
let items: Map<string, Item>;

const player = ps();

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

let userAgent = new https.Agent({
    maxSockets: 5
});

function getRelicDrops(): Promise<{ lastUpdated: Date, relics: Relic[] }> {
    return new Promise((resolve, reject) => {
        let content = "";
        let lastUpdated: Date;
        https.get('https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html', (response) => {
            response.on('data', (d) => {
                content += d;
            });
            response.on('end', parseWarframeDropsSite);
        });

        function parseWarframeDropsSite() {
            lastUpdated = new Date(parseInt(this.headers['etag']) * 1000);
            const dom = new DOMParser().parseFromString(content);
            const relicRewardsTable = select(dom, '//h3[@id="relicRewards"]')[0].nextSibling;
            const relicDomList = select(relicRewardsTable, 'child::tr[th[contains(text(), "Intact")]]'); //Selects the table row of the relic header. The six siblings after this header are drops.
            let relicList: Relic[] = [];

            relicDomList.forEach((relicDom) => {
                let [era, type, , quality] = relicDom.firstChild.firstChild.data.replace(/[\(\)]/g, '').split(' ');
                quality = quality.toLowerCase();
                let itemDrops: ItemDrop[] = [];

                let currentRow = select(relicDom, 'following-sibling::tr[1]')[0];
                for (let i = 0; i < 6; i++) {
                    const re = /(.*) +(prime) *(.*)/;
                    if (currentRow.firstChild.firstChild.data.toLowerCase().indexOf('forma') != -1) {
                        currentRow = select(currentRow, 'following-sibling::tr[1]')[0];
                        continue;
                    }
                    let [, itemName, , component] = currentRow.firstChild.firstChild.data.toLowerCase().match(re);
                    itemName = itemName.replace(/&/g, 'and');
                    component = component.replace(' blueprint', '');
                    if (itemName.includes('kavasa')) {
                        if (component.includes('collar')) component = 'collar blueprint';
                        else if (component.includes('buckle')) component = 'collar buckle';
                        else if (component.includes('band')) component = 'collar band';
                    }
                    let itemDropDomChance = currentRow.lastChild.firstChild.data.match(/(\w+) \((\d+).(\d+)%\)/);
                    let itemDropRarity = itemDropDomChance[1];
                    let itemChance = parseInt(itemDropDomChance[2] + itemDropDomChance[3]) / 10000;
                    let itemRarity = purities[quality.toLowerCase()].indexOf(itemChance);

                    let item = new Item({
                        name: itemName,
                        component: component
                    });

                    if (items.get(item.urlName) == null) {
                        items.set(item.urlName, item);
                    }

                    itemDrops.push(new ItemDrop({
                        name: item.urlName,
                        rarity: itemRarity,
                        dropRarity: itemDropRarity,
                        chance: itemChance
                    }));

                    currentRow = select(currentRow, 'following-sibling::tr[1]')[0];
                }

                relicList.push(new Relic({
                    era: era,
                    type: type,
                    items: itemDrops,
                    purity: quality
                }));
            });
            resolve({lastUpdated: lastUpdated, relics: relicList});
        }
    });
}

function getItemPrices(item: Item): Promise<[string, { avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number }]> {
    return new Promise<[string, { avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number }]>((resolve, reject) => {
        let result = "";
        let request = https.request({
            host: 'api.warframe.market',
            path: `/v1/items/${item.urlName}/statistics?include=item`,
            headers: {
                'Language': 'end',
                'Platform': 'pc',
                'Content-Type': 'application/json'
            },
            agent: userAgent
        }, response => {
            response.on('data', (data) => {
                result += data;
            });
            response.on('end', () => {
                let priceData = {avg_price: 0, low: 0, high: 0, ducats: 0, ducats_per_plat: 0};
                let resultObj = JSON.parse(result);
                let itemPriceData = resultObj['payload']['statistics']['48hours'];
                priceData.ducats = resultObj['include']['item']['items_in_set'].filter((nitem) => nitem['url_name'] == item.urlName)[0]['ducats'];

                let i = 1;
                for (let sold = 0; i <= itemPriceData.length && sold < 10; i++) {
                    priceData.avg_price += itemPriceData[itemPriceData.length - i]['avg_price'];
                    priceData.low += itemPriceData[itemPriceData.length - i]['min_price'];
                    priceData.high += itemPriceData[itemPriceData.length - i]['max_price'];
                    sold += itemPriceData[itemPriceData.length - i]['volume'];
                }
                i--;
                priceData.avg_price /= i;
                priceData.low /= i;
                priceData.high /= i;
                priceData.ducats_per_plat = priceData.ducats / priceData.low;

                resolve([resultObj.include.item._id, priceData]);
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
        request.end();
    });
}

function getOrders(item: Item): Promise<{ quantity: number, price: number, name: string }[]> {
    return new Promise((resolve, reject) => {
        let result = "";
        let request = https.request({
            host: 'api.warframe.market',
            path: `/v1/items/${item.urlName}/orders?include=item`,
            headers: {
                'Language': 'end',
                'Platform': 'pc',
                'Content-Type': 'application/json'
            },
            agent: userAgent
        }, response => {
            response.on('data', (data) => {
                result += data;
            });
            response.on('end', () => {
                let resultObj = JSON.parse(result);
                item.prices = {avg_price: 0, ducats: 0, high: 0, low: 0, ducats_per_plat: 0};
                item.prices.ducats = resultObj['include']['item']['items_in_set'].filter(i => i['url_name'] === item.urlName)[0]['ducats'];
                let rawOrders = resultObj['payload']['orders'];
                let filteredOrders = rawOrders.filter((order) => {
                    return order.user.status === "ingame" && order.order_type === "sell" && item.prices.ducats / order.platinum > 13;
                });

                resolve(filteredOrders.map((order) => {
                    return {item: item, quantity: order.quantity, price: order.platinum, name: order.user.ingame_name}
                }));
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
        request.end();
    });
}

function getSortedRelicDucatList(purity?: string) {
    let reducedRelics = relics.relics.map((relic, i) => {
        let val = 0;
        relic.items.forEach((item: ItemDrop) => {
            val += purities[purity == null ? relic.purity : purity][item.rarity] * items[items[item.name]].price.ducats;
        });
        return {index: i, value: val};
    });
    let sortedReducedRelics = reducedRelics.sort((a, b) => {
        return a.value - b.value;
    });
    return sortedReducedRelics.map(relic => {
        return {value: relic.value, relic: relics.relics[relic.index]}
    })
}

function getSortedRelicDucatPerPlat() {
    let itemNames = Array.from(items.keys());
    let reducedItemNames = itemNames.map(((value, index) => {
        if (items.get(value).prices == null)
            return;
        return {value: items.get(value).prices.ducats_per_plat, index: index};
    }));
    let sortedReducedItemNames = reducedItemNames.sort((a, b) => a.value - b.value);
    return sortedReducedItemNames.map(value => {
        return {name: itemNames[value.index], value: value.value}
    });
}

async function rateLimitedFunctionCalls(objectMap: Map<any, any>, mainFunction: Function, thenFunction: Function, batchSize: number = 5) {
    let objectArrayBunches: any[] = [];
    let mapIterator = objectMap.entries();
    for (let i = 0; i < objectMap.size / batchSize; i++) {
        let result = [];
        for (let j = 0; j < batchSize; j++) {
            let current = mapIterator.next().value;
            if (current == null) break;
            result.push(current[0]);
        }

        objectArrayBunches.push(result);
    }
    // let proms = [];
    let proms = [];
    for (let key in objectArrayBunches) {
        for (let item of objectArrayBunches[key]) {
            if (item != null) {
                proms.push(
                    mainFunction(objectMap.get(item))
                        .then((result) => thenFunction(item, result))
                        .catch(reason => console.log(reason))
                );
            }
        }
        console.log(`${Number(key) + 1}/${objectArrayBunches.length}`);
        await snooze(2650);
    }
    await Promise.all(proms);
}

let targets: any[];

async function lookupOrders() {
    items = new Map<string, Item>();
    relics = await getRelicDrops();

    const producation = true;
    let orderCollectionByUser: Map<string, OrderCollection> = new Map<string, OrderCollection>();
    if (producation) {
        let startTime = new Date().getTime()/1000;
        await rateLimitedFunctionCalls(items, getOrders, (key, orders) => {
            for (let order of orders) {
                let orderCollection = orderCollectionByUser.get(order.name);
                if (orderCollection == null) {
                    orderCollection = new OrderCollection();
                    orderCollectionByUser.set(order.name, orderCollection);
                }
                orderCollection.add(new Order(
                    order.name,
                    new OrderItem(order.item.urlName, order.price, order.item.prices.ducats),
                    order.quantity
                ));
            }
        });
        console.log("Finished: " + ((new Date().getTime()/1000) - startTime));
    }
    let seperatedOrders: string[][] = [];
    seperatedOrders[0] = [];
    seperatedOrders[1] = [];
    for (let key of orderCollectionByUser.keys()) {
        let orderCollection = orderCollectionByUser.get(key);
        if (orderCollection.totalDucats/orderCollection.totalPlat > 15) {
            seperatedOrders[0].push(key);
        } else {
            seperatedOrders[1].push(key);
        }
    }

    let userRequests: string[] = [];
    seperatedOrders.forEach(aordersPerUser => {
        (() => {
            aordersPerUser.sort(((a, b) => {
                return orderCollectionByUser.get(b).totalDucats - orderCollectionByUser.get(a).totalDucats;
            }));
        })();
        userRequests.push(orderListToString(orderCollectionByUser, aordersPerUser));
    });
    let temp = userRequests.join('\n');
    fs.writeFileSync('./output.txt', temp);
    console.log('Success');
}

function getToken(cookie) {
    return new Promise<string>((resolve, reject) => {
        let result = "";
        let request = https.request({
            host: 'warframe.market',
            path: `/tos`,
            headers: {
                Cookie: `JWT=${cookie}`
            },
            agent: userAgent
        }, response => {
            response.setEncoding('utf8');
            response.on('data', (data) => {
                result += data;
                if (result.includes('"csrf-token" content="')) {
                    resolve(result.match(/"csrf-token" content="([^"]*)/)[1]);
                }
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
        request.end();
    });
}

async function logBuys(cookie, csrftoken, simulated = false) {
    let output = [];
    let fsPromise = new Promise<string>((resolve, reject) => fs.readFile('output.txt', {encoding: 'utf8'}, (err, data) => {
        if (err)
            reject(err);
        resolve(data);
    }));
    let data = await fsPromise;
    let lines = data.split('\n');
    let trades = [];
    for (let l of lines) {
        if (l.charAt(0) === '$' || l.charAt(0) === ';') {
            trades.push(l.substring(1, l.length).split(' '));
        }
    }
    let tradesMap = new Map<number, any>();
    trades.forEach((val, i) => tradesMap.set(i, val));
    let tradeIds: string[] = [];
    if (!simulated) {
        await rateLimitedFunctionCalls(tradesMap, (trade: string) => {
            return new Promise((resolve, reject) => {
                let result = "";
                let request = https.request({
                    host: 'api.warframe.market',
                    path: `/v1/profile/orders`,
                    headers: {
                        'Language': 'end',
                        'Platform': 'pc',
                        'Content-Type': 'application/json',
                        'x-csrftoken': `${csrftoken}`,
                        'Cookie': `JWT=${cookie}`
                    },
                    method: 'POST',
                    agent: userAgent
                }, response => {
                    response.on('data', (data) => {
                        result += data;
                    });
                    response.on('end', () => {
                        let resultObj = JSON.parse(result);

                        resolve({name: resultObj.payload.order.id, quantity: resultObj.payload.order.quantity});
                    });
                });
                request.on('error', (err) => {
                    reject(err);
                });
                request.write(JSON.stringify({
                    order_type: "buy",
                    item_id: itemIds()[trade[0]].id,
                    platinum: trade[1],
                    quantity: trade[2]
                }));
                request.end();
            });
        }, (key, trade) => {
            output.push(tradesMap.get(key)[0]);
            tradeIds.push(trade);
        });
    } else {
        tradesMap.forEach((val, key) => {
            output.push(`${val[0]}: ${val[2]}x`);
            tradeIds.push("42");
        });
    }
    let tradeMap = new Map<number, any>();
    tradeIds.forEach((val, i) => tradeMap.set(i, val));
    if (!simulated) {
        await rateLimitedFunctionCalls(tradeMap, (tId: { name: string, quantity: number }) => {
            return new Promise(async (resolve, reject) => {
                let count = new Map<number, number>();
                for (let i = 0; i < tId.quantity; i++) {
                    count.set(i, i);
                }
                await rateLimitedFunctionCalls(count, (c) => {
                    return new Promise((res, rej) => {
                        let result = "";
                        let request = https.request({
                            host: 'api.warframe.market',
                            path: `/v1/profile/orders/close/${tId.name}`,
                            headers: {
                                'Language': 'end',
                                'Platform': 'pc',
                                'Content-Type': 'application/json',
                                'x-csrftoken': `${csrftoken}`,
                                'Cookie': `JWT=${cookie}`
                            },
                            method: 'PUT',
                            agent: userAgent
                        }, resp => {
                            resp.on('data', (data) => result += data);
                            resp.on('end', () => {
                                res();
                            });
                        });
                        request.on('error', (err) => console.log(err));
                        request.end();
                    });
                }, (key, c) => {
                    resolve();
                });
            });
        }, (key, res) => {
        });
    }
    fs.writeFileSync('output.txt', output.join('\n')+`\nTotal orders: ${output.length}`);
}

async function totalOrders(cookie, token, lastKiteerDate) {
    let closedOrders = await new Promise<{urlName: string, quantity: number, platinum: number}[]>((resolve => {
        let result = "";
        let request = https.request({
            host: 'api.warframe.market',
            path: `/v1/profile/Qwyll/statistics`,
            headers: {
                'Language': 'end',
                'Platform': 'pc',
                'Content-Type': 'application/json',
                'x-csrftoken': `${token}`,
                'Cookie': `JWT=${cookie}`
            },
            agent: userAgent
        }, response => {
            response.on('data', data => result += data);
            response.on('end', () => {
                let resultData = JSON.parse(result);
                let filteredOrders = resultData['payload']['closed_orders'].filter(order => {
                    let orderDate = new Date(order.closed_date);
                    return orderDate > lastKiteerDate && order.order_type === "buy";
                });
                let sortedOrders = filteredOrders.sort((a,b) => {
                    if (a.item.url_name < b.item.url_name)
                        return -1;
                    if (a.item.url_name > b.item.url_name)
                        return 1;
                    return 0;

                });
                let orderData = sortedOrders.map(order => {return {urlName: order.item.url_name, quantity: order.quantity, platinum: order.platinum}; });
                resolve(orderData);
            });
        });
        request.on('error', err => console.log(err));
        request.end();
    }));
    let totals = new Map<string, {quantity: number, prices: number[]}>();
    let totalPlatinum = 0;
    let totalDucats = 0;
    closedOrders.forEach(order => {
        let prevTotal = totals.get(order.urlName);
        let val: {quantity: number, prices: number[]}
        if (prevTotal == null) {
            val = {quantity: order.quantity, prices: [order.platinum]};
            totals.set(order.urlName, val);
        } else {
            val = totals.get(order.urlName);
            let p = val.prices;
            p.push(order.platinum);
            totals.set(order.urlName, {quantity: val.quantity + order.quantity, prices: p});
        }
        totalPlatinum += order.platinum * order.quantity;
        if (itemIds()[order.urlName] != null && itemIds()[order.urlName].ducats != null)
            totalDucats += itemIds()[order.urlName].ducats * order.quantity;
    });
    let temp = "";
    totals.forEach((value, key) => {
        temp += (`${value.quantity}x ${key} `);
        temp += value.prices.join(' ') + '\n';
    });
    temp += `Total Platinum: ${totalPlatinum}\nTotal Ducats: ${totalDucats}\nAverage Ducats/Platinum: ${totalDucats/totalPlatinum}`;
    fs.writeFileSync('output.txt', temp);
}

async function savePriceHistory() {
    items = new Map<string, Item>();
    await getRelicDrops();
    let prices = [];
    let names: any[];

    function getItemPriceHistory(item: Item) {
        return new Promise<[string, {
                avg_price: number, min_price: number, max_price: number, moving_avg: number,
                median: number, closed_price: number, datetime: string, donch_top: number,
                donch_bot: number, volume: number, id: string, open_price: number
            }]>((resolve, reject) => {
            let result = "";
            let request = https.request({
                host: 'api.warframe.market',
                path: `/v1/items/${item.urlName}/statistics?include=item`,
                headers: {
                    'Language': 'end',
                    'Platform': 'pc',
                    'Content-Type': 'application/json'
                },
                agent: userAgent
            }, response => {
                response.on('data', (data) => {
                    result += data;
                });
                response.on('end', () => {
                    let resultObj = JSON.parse(result);
                    let itemPriceData = resultObj['payload']['statistics']['90days'];
                    resolve(itemPriceData.map(i => [
                        i["closed_price"] || 0,
                        i["min_price"] || 0,
                        i["avg_price"] || 0,
                        i["median"] || 0,
                        Math.floor(new Date(i["datetime"]).getTime()/1000),
                        i["moving_avg"] || 0,
                        i["donch_top"] || 0,
                        i["donch_bot"] || 0,
                        i["volume"] || 0,
                        i["max_price"] || 0,
                        i["id"],
                        i["open_price"] || 0
                    ]));
                });
            });
            request.on('error', (err) => {
                reject(err);
            });
            request.end();
        });
    }

    let stream = fs.createWriteStream(`history-${Math.ceil(Math.floor((new Date().getTime()/1000)-1517431503)/(60*60*24))}.csv`, {flags: 'a'});
    await rateLimitedFunctionCalls(items, getItemPriceHistory, (item, result: any[]) => {
        result.forEach((v) => {
            let result = [item].concat(v);
            stream.write(result.join(',')+'\n');
        });
    });
    stream.end();
    console.log("History logged");
}

async function main(...args) {
    // player.play('start.mp3', err => {});
    const cookie = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqd3RfaWRlbnRpdHkiOiJRSkxUQ09SeWZDdUlwNGVQb3JZaUlyeVdDb09zZjFqMCIsImxvZ2luX3VhIjoiYidNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0OyBydjo1Ny4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzU3LjAnIiwiYXV0aF9tZXRob2QiOiJjb29raWUiLCJzZWN1cmUiOmZhbHNlLCJzaWQiOiI1RTNCZGw1Q2IzSFNOSlpacDUyQVJKSEtvdjF1MVhQYSIsImF1ZCI6Imp3dCIsImNzcmZfdG9rZW4iOiI5OGRjZWRlN2Y5Mjc1ZmIyZTc3MWM1YjdmOTQ1MmY2NmI5ZmUxYWQ1IiwiZXhwIjoxNTIwNDY0MzY1LCJpc3MiOiJqd3QiLCJpYXQiOjE1MTUyODAzNjUsImxvZ2luX2lwIjoiYicxOTkuMTcuNTUuMTY0JyJ9.KeUATSWUoIeGwG13OH-yeGzg1bh4BVKFWWVfQc_MURk';
    let csrftoken = await getToken(cookie);
    if (process.argv.includes("lookup")) {
        await lookupOrders();
    }
    if (process.argv.includes("input")) {
        player.play('input.mp3', err => {});
        console.log("Waiting for user input:");
        await new Promise((resolve) => {
            const stdin = process.openStdin();
            stdin.addListener('data', d => {stdin.destroy(); resolve()});
            stdin.addListener('end', () => {});
        });
        console.log("Got user input.");
    }
    if (process.argv.includes("log")) {
        await logBuys(cookie, csrftoken);
    }
    if (process.argv.includes("total")) {
        await totalOrders(cookie, csrftoken, new Date(2018, 0, 12, 0, 0, 0, 0));
    }
    if (process.argv.includes("history")) {
        await savePriceHistory();
    }
    console.log("Done");
    process.exitCode = 0;
    // player.play('done.mp3', err => {});
}

main();

function orderListToString(orderCollectionByUser, orders): string {
    return orders.map((user) => {
        let partString = "";
        let partlist = "";
        let totalplat = 0;
        let totalducats = 0;

        let orderCollection = orderCollectionByUser.get(user);

        let outputString = `/w ${user} Hi! I want to buy: `;
        outputString += orderCollection.orderGroups.map(group =>  group.toString()).join('\nand ');
        orderCollection.orderGroups.forEach((group, index) => {
            partlist += '\n' + group.listItems().map(i => `${i.name} ${i.price} ${i.quantity} (${i.ducats/i.price})`).join('\n');
        });
        return `${outputString}(warframe.market)\nTotal plat: ${orderCollection.totalPlat} Total ducats: ${orderCollection.totalDucats} (${orderCollection.totalDucats / orderCollection.totalPlat})${partlist}`;
    }).join('\n');
}
