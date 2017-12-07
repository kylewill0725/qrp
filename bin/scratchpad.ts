import {Item, ItemDrop, Relic} from '../relic';
import * as qim from '../QRPInstanceManager';
import {DOMParser} from "xmldom";
import * as select from 'xpath.js';
import * as https from 'https';
import * as fs from "fs";
import {getItems, getRelics} from "../QRPInstanceManager";
//
// function getOrders(item: Item): Promise<{quantity: number, price: number, name: string}[]> {
//     return new Promise((resolve, reject) => {
//         let result = "";
//         let request = https.request({
//             host: 'api.warframe.market',
//             path: `/v1/items/${item.urlName}/orders`,
//             headers: {
//                 'Language': 'end',
//                 'Platform': 'pc',
//                 'Content-Type': 'application/json'
//             }
//         }, response => {
//             response.on('data', (data) => {
//                 result += data;
//             });
//             response.on('end', () => {
//                 let resultObj = JSON.parse(result);
//                 let rawOrders = resultObj['payload']['orders'];
//                 let filteredOrders = rawOrders.filter((order) => {
//                     return order.user.status === "ingame" && order.order_type === "sell" && item.prices.ducats / order.platinum > 13;
//                 });
//
//                 resolve(filteredOrders.map((order) => { return {item: item,quantity: order.quantity, price: order.platinum, name: order.user.ingame_name}}));
//             });
//         });
//         request.on('error', (err) => {
//             reject(err);
//         });
//         request.end();
//     });
// }
//
// async function getSortedRelicDucatList(purity?: string) {
//     let reducedRelics = (await qim.getRelics()).relics.map((relic, i) => {
//         let val = 0;
//         relic.items.forEach(async (item: ItemDrop) => {
//             val += purities[purity == null ? relic.purity : purity][item.rarity] * (await qim.getItems())[await qim.getItems()[item.name]].price.ducats;
//         });
//         return {index: i, value: val};
//     });
//     let sortedReducedRelics = reducedRelics.sort((a, b) => {
//         return a.value - b.value;
//     });
//     return sortedReducedRelics.map(relic => {return {value: relic.value, relic: relics.relics[relic.index]}})
// }
//
// function getSortedRelicDucatPerPlat() {
//     let itemNames = Object.keys(items);
//     let reducedItemNames = itemNames.map(((value, index) => {
//         return {value: items[value].prices.ducats_per_plat, index: index};
//     }));
//     let sortedReducedItemNames = reducedItemNames.sort((a, b) => a.value - b.value);
//     return sortedReducedItemNames.map(value => {return {name: itemNames[value.index], value: value.value}});
// }
//
// async function main() {
//     if (fs.existsSync('data.json')) {
//         let dataJson = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf8'}));
//         let revivedRelics = dataJson.relics.relics.map((relic) => {
//             return Relic.reviver(relic);
//         });
//         relics = {lastUpdated: dataJson.lastUpdated, relics: revivedRelics};
//         items = {};
//         Object.keys(dataJson.items).map((item) => {
//             items[item] = Item.reviver({
//                 name: dataJson.items[item].name,
//                 component: dataJson.items[item].component,
//                 lastUpdated: dataJson.items[item].lastUpdated,
//                 prices: dataJson.items[item].prices
//             });
//         });
//         console.log('done');
//     } else {
//         relics = await getRelicDrops();
//         let pricePromises = [];
//         Object.keys(items).forEach((item) => {
//             pricePromises.push(getItemPrices(items[item]).then(price => {
//                 items[item].prices = price;
//                 items[item].lastUpdated = new Date();
//             }).catch(reason => console.log(reason)));
//         });
//         await Promise.all(pricePromises);
//
//         await new Promise((resolve, reject) => fs.open('data.json', 'w',(err, fd) => {
//             fs.write(fd, JSON.stringify({relics: relics, items: items}),((err2, written, str) => {}));
//             console.log('done');
//             resolve();
//         }));
//     }
//
//     let targets = getSortedRelicDucatPerPlat().reverse().filter(value => value.value > 10);
//     let orders = [];
//     let ordersPromises = [];
//     let users: string[] = [];
//
//     targets.forEach(async (target) => {
//         ordersPromises.push(getOrders(items[target.name]).then(order => orders = orders.concat(order)));
//     });
//     await Promise.all(ordersPromises);
//     let ordersPerUser = {};
//     orders.forEach((order) => {
//         if (ordersPerUser[order.name] == null) {
//             ordersPerUser[order.name] = [];
//         }
//         ordersPerUser[order.name].push(order);
//     });
//     let sortedOrders = [];
//     (() => {
//         let userOrders = Object.keys(ordersPerUser).map(((key) => {
//             return [key, ordersPerUser[key]];
//         }));
//         userOrders.sort(((a, b) => {
//             let ATotalValue = 0;
//             a[1].forEach((order) => {ATotalValue += order.price*order.quantity});
//             let BTotalValue = 0;
//             b[1].forEach((order) => {BTotalValue += order.price*order.quantity});
//             return ATotalValue - BTotalValue;
//         }));
//         sortedOrders = userOrders.reverse();
//     })();
//     let userRequests: string[] = sortedOrders.map((user) => {
//         let partString = "";
//         user[1].forEach((item, index) => {
//             partString += `${item.quantity}x ${item.item.name} ${item.item.component}: ${item.quantity*item.price}plat${index < (user[1].length - 1) ? ',' : ''} `;
//         });
//         return `/w ${user[0]} Hi! I want to buy: ${partString}(warframe.market)`;
//     });
//     console.log();
// }
// main();

let commonPrices = getRelics().then((relics) => {
    let test = relics.relics[0].commonItems.reduce(async (previousValue, currentValue) => {
        let prevVal = await previousValue;
        let items = await getItems();
        prevVal['plat'] += (await items[currentValue.name].prices).avg_price;
        prevVal['ducats'] += (await items[currentValue.name].prices).ducats;
        return prevVal;
    }, new Promise((resolve) => resolve({plat: 0, ducats: 0 })));
});