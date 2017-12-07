import {Item, ItemDrop, Relic} from './relic';
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

let __relics: {lastUpdated: Date, relics: Relic[]};
export function getRelics() {
    if (__relics == null) {
        getRelicDrops().then(relics => __relics = relics);
    }
    if (__relics.lastUpdated.getTime() + (1000*60*60*24) < (new Date()).getTime()) {
        getRelicDrops().then(relics => {
            __relics.lastUpdated = new Date();
            __relics = relics;
        });
    }
    return __relics;
}

let __items = {};
export function getItems() {
    if (__items == null) {
        getRelicDrops().then(());
    }
    return __items;
}

export async function init() {
    if (fs.existsSync('data.json')) {
        let dataJson = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf8'}));
        let revivedRelics = dataJson.relics.relics.map((relic) => {
            return Relic.reviver(relic);
        });
        __relics = {lastUpdated: dataJson.lastUpdated, relics: revivedRelics};
        __items = {};
        Object.keys(dataJson.items).map((item) => {
            __items[item] = Item.reviver({
                name: dataJson.items[item].name,
                component: dataJson.items[item].component,
                lastUpdated: dataJson.items[item].lastUpdated,
                prices: dataJson.items[item].prices
            });
        });
        console.log('done');
    } else {
        __relics = await getRelicDrops();
        Object.keys(__items).forEach((item) => {
            __items[item].prices;
        });

        await new Promise((resolve, reject) => fs.open('data.json', 'w',(err, fd) => {
            fs.write(fd, JSON.stringify({relics: __relics, items: __items}),((err2, written, str) => {}));
            console.log('done');
            resolve();
        }));
    }
}

function getRelicDropTable() {
    return new Promise((resolve, reject) => {
        let content = "";
        let lastUpdated: Date;
        https.get('https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html', (response) => {
            response.on('data', (d) => {
                content += d;
            });
            response.on('end', () => {
                if (response.statusCode !== 200) reject(response.statusCode);
                const dom = new DOMParser().parseFromString(content);

            });
        });
    });
}

function getRelicDrops(): Promise<{lastUpdated: Date, relics: Relic[]}> {
    return new Promise((resolve, reject) => {

        function parseWarframeDropsSite() {
            lastUpdated = new Date(parseInt(this.headers['etag'])*1000);
            const dom = new DOMParser().parseFromString(content);
            const relicRewardsTable = select(dom, '//h3[@id="relicRewards"]')[0].nextSibling;
            const relicDomList = select(relicRewardsTable, 'child::tr[th[contains(text(), "Intact")]]'); //Selects the table row of the relic header. The six siblings after this header are drops.
            let relicList: Relic[] = [];

            relicDomList.forEach((relicDom) => {
                let [era, type,, quality] = relicDom.firstChild.firstChild.data.replace(/[\(\)]/g, '').split(' ');
                let isVaulted = content.match(new RegExp(era + " " + type, "gi")).length < 5;
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

                    if (__items[item.urlName] == null) {
                        __items[item.urlName] = item;
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
                    isVaulted: isVaulted,
                    items: itemDrops,
                    purity: quality
                }));
            });
            resolve({lastUpdated: lastUpdated, relics: relicList});
        }
    });
}