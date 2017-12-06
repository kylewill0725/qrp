import {Item, ItemDrop, Relic} from '../relic';
import {DOMParser} from "xmldom";
import * as select from 'xpath.js';
import * as https from 'https';
import * as fs from "fs";

const purities = {
    'intact': [0.2533, 0.11, 0.02],
    'exceptional': [0.2333, 0.13, 0.04],
    'flawless': [0.2, 0.17, 0.06],
    'radiant': [0.1667, 0.2, 0.1]
};

let relics: {lastUpdated: Date, relics: Relic[]};
let items = {};

function getRelicDrops(): Promise<{lastUpdated: Date, relics: Relic[]}> {
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
            lastUpdated = new Date(parseInt(this.headers['etag'])*1000);
            const dom = new DOMParser().parseFromString(content);
            const relicRewardsTable = select(dom, '//h3[@id="relicRewards"]')[0].nextSibling;
            const relicDomList = select(relicRewardsTable, 'child::tr[th[contains(text(), "Intact")]]'); //Selects the table row of the relic header. The six siblings after this header are drops.
            let relicList: Relic[] = [];

            relicDomList.forEach((relicDom) => {
                let [era, type,, quality] = relicDom.firstChild.firstChild.data.replace(/[\(\)]/g, '').split(' ');
                quality = quality.toLowerCase();
                let itemDrops: ItemDrop[] = [];

                let currentRow = select(relicDom, 'following-sibling::tr[1]')[0];
                for (let i = 0; i < 6; i++) {
                    const re = /(.*) +(prime) *(.*)/;
                    if (currentRow.firstChild.firstChild.data.toLowerCase().indexOf('forma') != -1) {
                        currentRow = select(currentRow, 'following-sibling::tr[1]')[0];
                        continue;
                    }
                    let [,itemName,,component] = currentRow.firstChild.firstChild.data.toLowerCase().match(re);
                    itemName = itemName.replace(/&/g, 'and');
                    component = component.replace(' blueprint', '');
                    if (itemName.includes('kavasa')) {
                        if (component.includes('collar')) component = 'collar blueprint';
                        else if (component.includes('buckle')) component = 'collar buckle';
                        else if (component.includes('band')) component = 'collar band';
                    }
                    let itemDropDomChance = currentRow.lastChild.firstChild.data.match(/(\w+) \((\d+).(\d+)%\)/);
                    let itemDropRarity = itemDropDomChance[1];
                    let itemChance = parseInt(itemDropDomChance[2]+itemDropDomChance[3])/10000;
                    let itemRarity = purities[quality.toLowerCase()].indexOf(itemChance);

                    let item = new Item({
                        name: itemName,
                        component: component
                    });

                    if (items[item.urlName] == null) {
                        items[item.urlName] = item;
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

function getItemPrices(item: Item): Promise<{avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}> {
    return new Promise<{avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}>((resolve, reject) => {
        let result = "";
        let request = https.request({
            host: 'api.warframe.market',
            path: `/v1/items/${item.urlName}/statistics?include=item`,
            headers: {
                'Language': 'end',
                'Platform': 'pc',
                'Content-Type': 'application/json'
            }
        },response => {
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
                priceData.ducats_per_plat = priceData.ducats/priceData.avg_price;

                resolve(priceData);
            });
        });
        request.on('error', (err) => {
            reject(err);
        });
        request.end();
    });
}

function getOrders(item: Item): Promise<{quantity: number, price: number, name: string}[]> {
    return new Promise((resolve, reject) => {
        let result = "";
        let request = https.request({
            host: 'api.warframe.market',
            path: `/v1/items/${item.urlName}/orders`,
            headers: {
                'Language': 'end',
                'Platform': 'pc',
                'Content-Type': 'application/json'
            }
        }, response => {
            response.on('data', (data) => {
                result += data;
            });
            response.on('end', () => {
                let resultObj = JSON.parse(result);
                let rawOrders = resultObj['payload']['orders'];
                let filteredOrders = rawOrders.filter((order) => {
                    return order.user.status === "ingame" && order.order_type === "sell" && item.prices.ducats / order.platinum > 13;
                });

                resolve(filteredOrders.map((order) => { return {item: item,quantity: order.quantity, price: order.platinum, name: order.user.ingame_name}}));
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
    return sortedReducedRelics.map(relic => {return {value: relic.value, relic: relics.relics[relic.index]}})
}

function getSortedRelicDucatPerPlat() {
    let itemNames = Object.keys(items);
    let reducedItemNames = itemNames.map(((value, index) => {
        return {value: items[value].prices.ducats_per_plat, index: index};
    }));
    let sortedReducedItemNames = reducedItemNames.sort((a, b) => a.value - b.value);
    return sortedReducedItemNames.map(value => {return {name: itemNames[value.index], value: value.value}});
}

async function main() {
    if (fs.existsSync('data.json')) {
        let dataJson = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf8'}));
        let revivedRelics = dataJson.relics.relics.map((relic) => {
            return Relic.reviver(relic);
        });
        relics = {lastUpdated: dataJson.lastUpdated, relics: revivedRelics};
        items = {};
        Object.keys(dataJson.items).map((item) => {
            items[item] = Item.reviver({
                name: dataJson.items[item].name,
                component: dataJson.items[item].component,
                lastUpdated: dataJson.items[item].lastUpdated,
                prices: dataJson.items[item].prices
            });
        });
        console.log('done');
    } else {
        relics = await getRelicDrops();
        let pricePromises = [];
        Object.keys(items).forEach((item) => {
            pricePromises.push(getItemPrices(items[item]).then(price => {
                items[item].prices = price;
                items[item].lastUpdated = new Date();
            }).catch(reason => console.log(reason)));
        });
        await Promise.all(pricePromises);

        await new Promise((resolve, reject) => fs.open('data.json', 'w',(err, fd) => {
            fs.write(fd, JSON.stringify({relics: relics, items: items}),((err2, written, str) => {}));
            console.log('done');
            resolve();
        }));
    }

    let targets = getSortedRelicDucatPerPlat().reverse().filter(value => value.value > 10);
    let orders = [];
    let ordersPromises = [];
    let users: string[] = [];

    targets.forEach(async (target) => {
        ordersPromises.push(getOrders(items[target.name]).then(order => orders = orders.concat(order)));
    });
    await Promise.all(ordersPromises);
    let ordersPerUser = {};
    orders.forEach((order) => {
        if (ordersPerUser[order.name] == null) {
            ordersPerUser[order.name] = [];
        }
        ordersPerUser[order.name].push(order);
    });
    let sortedOrders = [];
    (() => {
        let userOrders = Object.keys(ordersPerUser).map(((key) => {
            return [key, ordersPerUser[key]];
        }));
        userOrders.sort(((a, b) => {
            let ATotalValue = 0;
            a[1].forEach((order) => {ATotalValue += order.price*order.quantity});
            let BTotalValue = 0;
            b[1].forEach((order) => {BTotalValue += order.price*order.quantity});
            return ATotalValue - BTotalValue;
        }));
        sortedOrders = userOrders.reverse();
    })();
    let userRequests: string[] = sortedOrders.map((user) => {
        let partString = "";
        user[1].forEach((item, index) => {
            partString += `${item.quantity}x ${item.item.name} ${item.item.component}: ${item.quantity*item.price}plat${index < (user[1].length - 1) ? ',' : ''} `;
        });
        return `/w ${user[0]} Hi! I want to buy: ${partString}(warframe.market)`;
    });
    console.log();
}
main();