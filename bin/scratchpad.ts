import {Item, ItemDrop, Relic, itemIds} from '../relic';
import {DOMParser} from "xmldom";
import * as select from 'xpath.js';
import * as https from 'https';
import * as fs from "fs";
import * as notifier from "node-notifier";
import {setTimeout} from "timers";

const purities = {
    'intact': [0.2533, 0.11, 0.02],
    'exceptional': [0.2333, 0.13, 0.04],
    'flawless': [0.2, 0.17, 0.06],
    'radiant': [0.1667, 0.2, 0.1]
};

let relics: { lastUpdated: Date, relics: Relic[] };
let items: Map<string, Item>;

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
    for (let key in objectArrayBunches) {
        let proms = [];
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
        await Promise.all(proms);
    }
}

let targets: any[];

async function lookupOrders() {
    notifier.notify({title: 'Starting', message: ''});
    items = new Map<string, Item>();
    if (fs.existsSync('data.json')) {
        let dataJson = JSON.parse(/*fs.readFileSync('data.json', {encoding: 'utf8'})*/`
            {"items":{"braton_prime_stock":{"__type":"Item","name":"braton","component":"stock","lastUpdated":"2017-12-30T05:16:42.715Z","prices":{"avg_price":3.2142857142857144,"low":2.857142857142857,"high":3.5714285714285716,"ducats":15,"ducats_per_plat":5.25}},"akstiletto_prime_barrel":{"__type":"Item","name":"akstiletto","component":"barrel","lastUpdated":"2017-12-30T05:16:43.225Z","prices":{"avg_price":7.333333333333333,"low":6.666666666666667,"high":8,"ducats":45,"ducats_per_plat":6.75}},"fragor_prime_head":{"__type":"Item","name":"fragor","component":"head","lastUpdated":"2017-12-30T05:16:43.610Z","prices":{"avg_price":5.1,"low":4.8,"high":5.4,"ducats":15,"ducats_per_plat":3.125}},"dual_kamas_prime_handle":{"__type":"Item","name":"dual kamas","component":"handle","lastUpdated":"2017-12-30T05:16:44.214Z","prices":{"avg_price":8.8,"low":8.6,"high":9,"ducats":45,"ducats_per_plat":5.232558139534884}},"trinity_prime_systems":{"__type":"Item","name":"trinity","component":"systems","lastUpdated":"2017-12-30T05:16:44.731Z","prices":{"avg_price":10.1,"low":9.6,"high":10.6,"ducats":15,"ducats_per_plat":1.5625}},"nikana_prime_blueprint":{"__type":"Item","name":"nikana","component":"blueprint","lastUpdated":"2017-12-30T05:16:45.369Z","prices":{"avg_price":11.25,"low":10.5,"high":12,"ducats":65,"ducats_per_plat":6.190476190476191}},"aklex_prime_blueprint":{"__type":"Item","name":"aklex","component":"blueprint","lastUpdated":"2017-12-30T05:16:45.878Z","prices":{"avg_price":13.125,"low":10.75,"high":15.5,"ducats":45,"ducats_per_plat":4.186046511627907}},"lex_prime_receiver":{"__type":"Item","name":"lex","component":"receiver","lastUpdated":"2017-12-30T05:16:46.437Z","prices":{"avg_price":8.166666666666666,"low":7.833333333333333,"high":8.5,"ducats":15,"ducats_per_plat":1.9148936170212767}},"lex_prime_blueprint":{"__type":"Item","name":"lex","component":"blueprint","lastUpdated":"2017-12-30T05:16:46.879Z","prices":{"avg_price":3.4,"low":3,"high":3.8,"ducats":25,"ducats_per_plat":8.333333333333334}},"aklex_prime_link":{"__type":"Item","name":"aklex","component":"link","lastUpdated":"2017-12-30T05:16:47.405Z","prices":{"avg_price":46.75,"low":35.25,"high":58.25,"ducats":100,"ducats_per_plat":2.8368794326241136}},"lex_prime_barrel":{"__type":"Item","name":"lex","component":"barrel","lastUpdated":"2017-12-30T05:16:48.038Z","prices":{"avg_price":3.0833333333333335,"low":3,"high":3.1666666666666665,"ducats":15,"ducats_per_plat":5}},"braton_prime_barrel":{"__type":"Item","name":"braton","component":"barrel","lastUpdated":"2017-12-30T05:16:48.552Z","prices":{"avg_price":2.5833333333333335,"low":2.3333333333333335,"high":2.8333333333333335,"ducats":15,"ducats_per_plat":6.428571428571428}},"akbolto_prime_receiver":{"__type":"Item","name":"akbolto","component":"receiver","lastUpdated":"2017-12-30T05:16:48.939Z","prices":{"avg_price":67.25,"low":59.5,"high":75,"ducats_per_plat":null}},"hydroid_prime_neuroptics":{"__type":"Item","name":"hydroid","component":"neuroptics","lastUpdated":"2017-12-30T05:16:49.597Z","prices":{"avg_price":13.166666666666666,"low":9.666666666666666,"high":16.666666666666668,"ducats":45,"ducats_per_plat":4.655172413793104}},"cernos_prime_string":{"__type":"Item","name":"cernos","component":"string","lastUpdated":"2017-12-30T05:16:50.083Z","prices":{"avg_price":3.857142857142857,"low":3.5714285714285716,"high":4.142857142857143,"ducats":45,"ducats_per_plat":12.6}},"cernos_prime_blueprint":{"__type":"Item","name":"cernos","component":"blueprint","lastUpdated":"2017-12-30T05:16:50.721Z","prices":{"avg_price":3.75,"low":3.25,"high":4.25,"ducats":45,"ducats_per_plat":13.846153846153847}},"kogake_prime_boot":{"__type":"Item","name":"kogake","component":"boot","lastUpdated":"2017-12-30T05:16:51.124Z","prices":{"avg_price":20.75,"low":17.5,"high":24,"ducats_per_plat":null}},"banshee_prime_systems":{"__type":"Item","name":"banshee","component":"systems","lastUpdated":"2017-12-30T05:16:51.953Z","prices":{"avg_price":41.25,"low":32.5,"high":50,"ducats":100,"ducats_per_plat":3.076923076923077}},"helios_prime_carapace":{"__type":"Item","name":"helios","component":"carapace","lastUpdated":"2017-12-30T05:16:52.306Z","prices":{"avg_price":4.428571428571429,"low":3.4285714285714284,"high":5.428571428571429,"ducats":15,"ducats_per_plat":4.375}},"kavasa_prime_collar_buckle":{"__type":"Item","name":"kavasa","component":"collar buckle","lastUpdated":"2017-12-30T05:16:52.744Z","prices":{"avg_price":14.75,"low":14.5,"high":15,"ducats":65,"ducats_per_plat":4.482758620689655}},"ash_prime_chassis":{"__type":"Item","name":"ash","component":"chassis","lastUpdated":"2017-12-30T05:16:53.423Z","prices":{"avg_price":6.2,"low":4.4,"high":8,"ducats":15,"ducats_per_plat":3.4090909090909087}},"orthos_prime_blueprint":{"__type":"Item","name":"orthos","component":"blueprint","lastUpdated":"2017-12-30T05:16:53.925Z","prices":{"avg_price":6.833333333333333,"low":6.5,"high":7.166666666666667,"ducats":45,"ducats_per_plat":6.923076923076923}},"sybaris_prime_blueprint":{"__type":"Item","name":"sybaris","component":"blueprint","lastUpdated":"2017-12-30T05:16:54.392Z","prices":{"avg_price":7.25,"low":7,"high":7.5,"ducats":15,"ducats_per_plat":2.142857142857143}},"euphona_prime_blueprint":{"__type":"Item","name":"euphona","component":"blueprint","lastUpdated":"2017-12-30T05:16:54.776Z","prices":{"avg_price":4.125,"low":3,"high":5.25,"ducats":15,"ducats_per_plat":5}},"fang_prime_blade":{"__type":"Item","name":"fang","component":"blade","lastUpdated":"2017-12-30T05:16:55.431Z","prices":{"avg_price":5.2,"low":3.8,"high":6.6,"ducats":15,"ducats_per_plat":3.947368421052632}},"cernos_prime_lower_limb":{"__type":"Item","name":"cernos","component":"lower limb","lastUpdated":"2017-12-30T05:16:56.060Z","prices":{"avg_price":16.5,"low":14.666666666666666,"high":18.333333333333332,"ducats":100,"ducats_per_plat":6.818181818181818}},"vectis_prime_barrel":{"__type":"Item","name":"vectis","component":"barrel","lastUpdated":"2017-12-30T05:16:56.573Z","prices":{"avg_price":11.833333333333334,"low":11.333333333333334,"high":12.333333333333334,"ducats":15,"ducats_per_plat":1.3235294117647058}},"trinity_prime_neuroptics":{"__type":"Item","name":"trinity","component":"neuroptics","lastUpdated":"2017-12-30T05:16:57.144Z","prices":{"avg_price":11.583333333333334,"low":10.666666666666666,"high":12.5,"ducats":25,"ducats_per_plat":2.34375}},"silva_and_aegis_prime_blade":{"__type":"Item","name":"silva and aegis","component":"blade","lastUpdated":"2017-12-30T05:16:57.591Z","prices":{"avg_price":4.5,"low":4.333333333333333,"high":4.666666666666667,"ducats":45,"ducats_per_plat":10.384615384615385}},"fragor_prime_handle":{"__type":"Item","name":"fragor","component":"handle","lastUpdated":"2017-12-30T05:16:57.973Z","prices":{"avg_price":6,"low":5.4,"high":6.6,"ducats":65,"ducats_per_plat":12.037037037037036}},"ember_prime_blueprint":{"__type":"Item","name":"ember","component":"blueprint","lastUpdated":"2017-12-30T05:16:58.849Z","prices":{"avg_price":383.9,"low":380,"high":387.8,"ducats":100,"ducats_per_plat":0.2631578947368421}},"braton_prime_blueprint":{"__type":"Item","name":"braton","component":"blueprint","lastUpdated":"2017-12-30T05:16:59.113Z","prices":{"avg_price":2.2,"low":2,"high":2.4,"ducats":25,"ducats_per_plat":12.5}},"sicarus_prime_blueprint":{"__type":"Item","name":"sicarus","component":"blueprint","lastUpdated":"2017-12-30T05:16:59.608Z","prices":{"avg_price":46.25,"low":45.625,"high":46.875,"ducats":15,"ducats_per_plat":0.3287671232876712}},"glaive_prime_blade":{"__type":"Item","name":"glaive","component":"blade","lastUpdated":"2017-12-30T05:17:00.164Z","prices":{"avg_price":102.21428571428571,"low":99.85714285714286,"high":104.57142857142857,"ducats":45,"ducats_per_plat":0.45064377682403434}},"latron_prime_barrel":{"__type":"Item","name":"latron","component":"barrel","lastUpdated":"2017-12-30T05:17:01.633Z","prices":{"avg_price":31.5,"low":30,"high":33,"ducats":15,"ducats_per_plat":0.5}},"bronco_prime_barrel":{"__type":"Item","name":"bronco","component":"barrel","lastUpdated":"2017-12-30T05:17:02.377Z","prices":{"avg_price":11.875,"low":11.5,"high":12.25,"ducats":45,"ducats_per_plat":3.9130434782608696}},"paris_prime_blueprint":{"__type":"Item","name":"paris","component":"blueprint","lastUpdated":"2017-12-30T05:17:02.840Z","prices":{"avg_price":1.7,"low":1.4,"high":2,"ducats":15,"ducats_per_plat":10.714285714285715}},"euphona_prime_receiver":{"__type":"Item","name":"euphona","component":"receiver","lastUpdated":"2017-12-30T05:17:03.481Z","prices":{"avg_price":24.6,"low":22.6,"high":26.6,"ducats":100,"ducats_per_plat":4.424778761061947}},"galatine_prime_blueprint":{"__type":"Item","name":"galatine","component":"blueprint","lastUpdated":"2017-12-30T05:17:03.929Z","prices":{"avg_price":15,"low":14,"high":16,"ducats":100,"ducats_per_plat":7.142857142857143}},"frost_prime_neuroptics":{"__type":"Item","name":"frost","component":"neuroptics","lastUpdated":"2017-12-30T05:17:04.357Z","prices":{"avg_price":29.88888888888889,"low":29.11111111111111,"high":30.666666666666668,"ducats":15,"ducats_per_plat":0.5152671755725191}},"saryn_prime_systems":{"__type":"Item","name":"saryn","component":"systems","lastUpdated":"2017-12-30T05:17:04.993Z","prices":{"avg_price":4.5,"low":4.5,"high":4.5,"ducats":15,"ducats_per_plat":3.3333333333333335}},"nekros_prime_chassis":{"__type":"Item","name":"nekros","component":"chassis","lastUpdated":"2017-12-30T05:17:05.520Z","prices":{"avg_price":3.3333333333333335,"low":3,"high":3.6666666666666665,"ducats":15,"ducats_per_plat":5}},"akstiletto_prime_receiver":{"__type":"Item","name":"akstiletto","component":"receiver","lastUpdated":"2017-12-30T05:17:06.058Z","prices":{"avg_price":16.333333333333332,"low":14,"high":18.666666666666668,"ducats":45,"ducats_per_plat":3.2142857142857144}},"helios_prime_cerebrum":{"__type":"Item","name":"helios","component":"cerebrum","lastUpdated":"2017-12-30T05:17:06.545Z","prices":{"avg_price":19,"low":18,"high":20,"ducats":100,"ducats_per_plat":5.555555555555555}},"kavasa_prime_collar_blueprint":{"__type":"Item","name":"kavasa","component":"collar blueprint","lastUpdated":"2017-12-30T05:17:07.028Z","prices":{"avg_price":6.2,"low":5.6,"high":6.8,"ducats":45,"ducats_per_plat":8.035714285714286}},"oberon_prime_chassis":{"__type":"Item","name":"oberon","component":"chassis","lastUpdated":"2017-12-30T05:17:07.673Z","prices":{"avg_price":8,"low":7.6,"high":8.4,"ducats":15,"ducats_per_plat":1.973684210526316}},"fang_prime_handle":{"__type":"Item","name":"fang","component":"handle","lastUpdated":"2017-12-30T05:17:08.209Z","prices":{"avg_price":4.916666666666667,"low":4.666666666666667,"high":5.166666666666667,"ducats":25,"ducats_per_plat":5.357142857142857}},"hikou_prime_pouch":{"__type":"Item","name":"hikou","component":"pouch","lastUpdated":"2017-12-30T05:17:08.686Z","prices":{"avg_price":25.625,"low":24.75,"high":26.5,"ducats":15,"ducats_per_plat":0.6060606060606061}},"odonata_prime_harness":{"__type":"Item","name":"odonata","component":"harness","lastUpdated":"2017-12-30T05:17:09.194Z","prices":{"avg_price":7.571428571428571,"low":7.428571428571429,"high":7.714285714285714,"ducats":15,"ducats_per_plat":2.019230769230769}},"trinity_prime_chassis":{"__type":"Item","name":"trinity","component":"chassis","lastUpdated":"2017-12-30T05:17:09.690Z","prices":{"avg_price":13.75,"low":12.5,"high":15,"ducats":45,"ducats_per_plat":3.6}},"akstiletto_prime_link":{"__type":"Item","name":"akstiletto","component":"link","lastUpdated":"2017-12-30T05:17:10.359Z","prices":{"avg_price":5.666666666666667,"low":4.666666666666667,"high":6.666666666666667,"ducats":45,"ducats_per_plat":9.642857142857142}},"nikana_prime_hilt":{"__type":"Item","name":"nikana","component":"hilt","lastUpdated":"2017-12-30T05:17:10.846Z","prices":{"avg_price":32.125,"low":29.25,"high":35,"ducats":100,"ducats_per_plat":3.4188034188034186}},"odonata_prime_wings":{"__type":"Item","name":"odonata","component":"wings","lastUpdated":"2017-12-30T05:17:11.397Z","prices":{"avg_price":26.785714285714285,"low":26,"high":27.571428571428573,"ducats":45,"ducats_per_plat":1.7307692307692308}},"ash_prime_systems":{"__type":"Item","name":"ash","component":"systems","lastUpdated":"2017-12-30T05:17:11.882Z","prices":{"avg_price":74.375,"low":63.75,"high":85,"ducats":65,"ducats_per_plat":1.0196078431372548}},"carrier_prime_carapace":{"__type":"Item","name":"carrier","component":"carapace","lastUpdated":"2017-12-30T05:17:12.382Z","prices":{"avg_price":10.416666666666666,"low":10,"high":10.833333333333334,"ducats":15,"ducats_per_plat":1.5}},"paris_prime_upper_limb":{"__type":"Item","name":"paris","component":"upper limb","lastUpdated":"2017-12-30T05:17:13.126Z","prices":{"avg_price":3.9285714285714284,"low":3.857142857142857,"high":4,"ducats":25,"ducats_per_plat":6.481481481481481}},"nekros_prime_blueprint":{"__type":"Item","name":"nekros","component":"blueprint","lastUpdated":"2017-12-30T05:17:13.557Z","prices":{"avg_price":23.833333333333332,"low":20,"high":27.666666666666668,"ducats":100,"ducats_per_plat":5}},"ash_prime_neuroptics":{"__type":"Item","name":"ash","component":"neuroptics","lastUpdated":"2017-12-30T05:17:14.073Z","prices":{"avg_price":7.428571428571429,"low":6.714285714285714,"high":8.142857142857142,"ducats":45,"ducats_per_plat":6.702127659574468}},"volt_prime_blueprint":{"__type":"Item","name":"volt","component":"blueprint","lastUpdated":"2017-12-30T05:17:14.596Z","prices":{"avg_price":48,"low":40.4,"high":55.6,"ducats":45,"ducats_per_plat":1.113861386138614}},"bronco_prime_blueprint":{"__type":"Item","name":"bronco","component":"blueprint","lastUpdated":"2017-12-30T05:17:15.073Z","prices":{"avg_price":3.2,"low":2.2,"high":4.2,"ducats":15,"ducats_per_plat":6.8181818181818175}},"nami_skyla_prime_blade":{"__type":"Item","name":"nami skyla","component":"blade","lastUpdated":"2017-12-30T05:17:15.744Z","prices":{"avg_price":21,"low":17.5,"high":24.5,"ducats":100,"ducats_per_plat":5.714285714285714}},"cernos_prime_upper_limb":{"__type":"Item","name":"cernos","component":"upper limb","lastUpdated":"2017-12-30T05:17:16.270Z","prices":{"avg_price":2.2,"low":1.8,"high":2.6,"ducats":15,"ducats_per_plat":8.333333333333334}},"nekros_prime_neuroptics":{"__type":"Item","name":"nekros","component":"neuroptics","lastUpdated":"2017-12-30T05:17:16.735Z","prices":{"avg_price":12.5,"low":10,"high":15,"ducats":45,"ducats_per_plat":4.5}},"galatine_prime_blade":{"__type":"Item","name":"galatine","component":"blade","lastUpdated":"2017-12-30T05:17:17.254Z","prices":{"avg_price":3.1666666666666665,"low":2.8333333333333335,"high":3.5,"ducats":15,"ducats_per_plat":5.294117647058823}},"dual_kamas_prime_blueprint":{"__type":"Item","name":"dual kamas","component":"blueprint","lastUpdated":"2017-12-30T05:17:17.629Z","prices":{"avg_price":4.928571428571429,"low":4.571428571428571,"high":5.285714285714286,"ducats":15,"ducats_per_plat":3.28125}},"helios_prime_systems":{"__type":"Item","name":"helios","component":"systems","lastUpdated":"2017-12-30T05:17:18.263Z","prices":{"avg_price":4.166666666666667,"low":4,"high":4.333333333333333,"ducats":45,"ducats_per_plat":11.25}},"galatine_prime_handle":{"__type":"Item","name":"galatine","component":"handle","lastUpdated":"2017-12-30T05:17:18.801Z","prices":{"avg_price":4.375,"low":4.25,"high":4.5,"ducats":45,"ducats_per_plat":10.588235294117647}},"rhino_prime_blueprint":{"__type":"Item","name":"rhino","component":"blueprint","lastUpdated":"2017-12-30T05:17:19.549Z","prices":{"avg_price":162.75,"low":157,"high":168.5,"ducats":100,"ducats_per_plat":0.6369426751592356}},"dakra_prime_blueprint":{"__type":"Item","name":"dakra","component":"blueprint","lastUpdated":"2017-12-30T05:17:19.783Z","prices":{"avg_price":7.666666666666667,"low":6.666666666666667,"high":8.666666666666666,"ducats":45,"ducats_per_plat":6.75}},"oberon_prime_systems":{"__type":"Item","name":"oberon","component":"systems","lastUpdated":"2017-12-30T05:17:20.305Z","prices":{"avg_price":34.625,"low":32,"high":37.25,"ducats":100,"ducats_per_plat":3.125}},"boar_prime_receiver":{"__type":"Item","name":"boar","component":"receiver","lastUpdated":"2017-12-30T05:17:21.004Z","prices":{"avg_price":8,"low":7.166666666666667,"high":8.833333333333334,"ducats":15,"ducats_per_plat":2.093023255813953}},"ankyros_prime_blade":{"__type":"Item","name":"ankyros","component":"blade","lastUpdated":"2017-12-30T05:17:21.374Z","prices":{"avg_price":43.8,"low":43.6,"high":44,"ducats":65,"ducats_per_plat":1.4908256880733946}},"bronco_prime_receiver":{"__type":"Item","name":"bronco","component":"receiver","lastUpdated":"2017-12-30T05:17:21.961Z","prices":{"avg_price":4.6,"low":3.8,"high":5.4,"ducats":15,"ducats_per_plat":3.947368421052632}},"mag_prime_systems":{"__type":"Item","name":"mag","component":"systems","lastUpdated":"2017-12-30T05:17:22.880Z","prices":{"avg_price":31.2,"low":28.6,"high":33.8,"ducats":15,"ducats_per_plat":0.5244755244755245}},"boltor_prime_stock":{"__type":"Item","name":"boltor","component":"stock","lastUpdated":"2017-12-30T05:17:23.002Z","prices":{"avg_price":21.2,"low":20,"high":22.4,"ducats":15,"ducats_per_plat":0.75}},"burston_prime_barrel":{"__type":"Item","name":"burston","component":"barrel","lastUpdated":"2017-12-30T05:17:23.634Z","prices":{"avg_price":6.75,"low":6,"high":7.5,"ducats":45,"ducats_per_plat":7.5}},"scindo_prime_blade":{"__type":"Item","name":"scindo","component":"blade","lastUpdated":"2017-12-30T05:17:24.271Z","prices":{"avg_price":28.083333333333332,"low":25,"high":31.166666666666668,"ducats":100,"ducats_per_plat":4}},"tigris_prime_blueprint":{"__type":"Item","name":"tigris","component":"blueprint","lastUpdated":"2017-12-30T05:17:24.653Z","prices":{"avg_price":14.7,"low":12.8,"high":16.6,"ducats":100,"ducats_per_plat":7.8125}},"akbronco_prime_link":{"__type":"Item","name":"akbronco","component":"link","lastUpdated":"2017-12-30T05:17:25.169Z","prices":{"avg_price":4.75,"low":4,"high":5.5,"ducats":45,"ducats_per_plat":11.25}},"trinity_prime_blueprint":{"__type":"Item","name":"trinity","component":"blueprint","lastUpdated":"2017-12-30T05:17:25.683Z","prices":{"avg_price":16.3,"low":13.4,"high":19.2,"ducats":45,"ducats_per_plat":3.3582089552238803}},"volt_prime_neuroptics":{"__type":"Item","name":"volt","component":"neuroptics","lastUpdated":"2017-12-30T05:17:26.361Z","prices":{"avg_price":42.9,"low":39.8,"high":46,"ducats":45,"ducats_per_plat":1.1306532663316584}},"vectis_prime_stock":{"__type":"Item","name":"vectis","component":"stock","lastUpdated":"2017-12-30T05:17:26.856Z","prices":{"avg_price":44,"low":42,"high":46,"ducats":65,"ducats_per_plat":1.5476190476190477}},"carrier_prime_systems":{"__type":"Item","name":"carrier","component":"systems","lastUpdated":"2017-12-30T05:17:27.346Z","prices":{"avg_price":4.666666666666667,"low":4.333333333333333,"high":5,"ducats":15,"ducats_per_plat":3.4615384615384617}},"odonata_prime_systems":{"__type":"Item","name":"odonata","component":"systems","lastUpdated":"2017-12-30T05:17:27.878Z","prices":{"avg_price":3.25,"low":3.25,"high":3.25,"ducats":15,"ducats_per_plat":4.615384615384615}},"vauban_prime_chassis":{"__type":"Item","name":"vauban","component":"chassis","lastUpdated":"2017-12-30T05:17:28.386Z","prices":{"avg_price":16.166666666666668,"low":14.333333333333334,"high":18,"ducats":100,"ducats_per_plat":6.976744186046512}},"braton_prime_receiver":{"__type":"Item","name":"braton","component":"receiver","lastUpdated":"2017-12-30T05:17:29.048Z","prices":{"avg_price":5.5,"low":4.5,"high":6.5,"ducats":45,"ducats_per_plat":10}},"mag_prime_neuroptics":{"__type":"Item","name":"mag","component":"neuroptics","lastUpdated":"2017-12-30T05:17:29.946Z","prices":{"avg_price":14.25,"low":12.5,"high":16,"ducats":15,"ducats_per_plat":1.2}},"boar_prime_barrel":{"__type":"Item","name":"boar","component":"barrel","lastUpdated":"2017-12-30T05:17:30.390Z","prices":{"avg_price":13.777777777777779,"low":13.555555555555555,"high":14,"ducats":45,"ducats_per_plat":3.319672131147541}},"vasto_prime_barrel":{"__type":"Item","name":"vasto","component":"barrel","lastUpdated":"2017-12-30T05:17:30.562Z","prices":{"avg_price":10.857142857142858,"low":10.714285714285714,"high":11,"ducats":15,"ducats_per_plat":1.4000000000000001}},"valkyr_prime_chassis":{"__type":"Item","name":"valkyr","component":"chassis","lastUpdated":"2017-12-30T05:17:31.079Z","prices":{"avg_price":25,"low":20.5,"high":29.5,"ducats":100,"ducats_per_plat":4.878048780487805}},"tigris_prime_receiver":{"__type":"Item","name":"tigris","component":"receiver","lastUpdated":"2017-12-30T05:17:31.718Z","prices":{"avg_price":4.5,"low":3.75,"high":5.25,"ducats":45,"ducats_per_plat":12}},"kogake_prime_blueprint":{"__type":"Item","name":"kogake","component":"blueprint","lastUpdated":"2017-12-30T05:17:32.103Z","prices":{"avg_price":8.1,"low":7.4,"high":8.8,"ducats_per_plat":null}},"ballistica_prime_lower_limb":{"__type":"Item","name":"ballistica","component":"lower limb","lastUpdated":"2017-12-30T05:17:32.818Z","prices":{"avg_price":8.5,"low":8.2,"high":8.8,"ducats":15,"ducats_per_plat":1.829268292682927}},"venka_prime_gauntlet":{"__type":"Item","name":"venka","component":"gauntlet","lastUpdated":"2017-12-30T05:17:33.254Z","prices":{"avg_price":26,"low":23.5,"high":28.5,"ducats":100,"ducats_per_plat":4.25531914893617}},"venka_prime_blades":{"__type":"Item","name":"venka","component":"blades","lastUpdated":"2017-12-30T05:17:33.649Z","prices":{"avg_price":6.5,"low":6,"high":7,"ducats":15,"ducats_per_plat":2.5}},"saryn_prime_neuroptics":{"__type":"Item","name":"saryn","component":"neuroptics","lastUpdated":"2017-12-30T05:17:34.367Z","prices":{"avg_price":14.5,"low":6.75,"high":22.25,"ducats":45,"ducats_per_plat":6.666666666666667}},"nami_skyla_prime_blueprint":{"__type":"Item","name":"nami skyla","component":"blueprint","lastUpdated":"2017-12-30T05:17:34.763Z","prices":{"avg_price":4,"low":3.8333333333333335,"high":4.166666666666667,"ducats":15,"ducats_per_plat":3.9130434782608696}},"vectis_prime_blueprint":{"__type":"Item","name":"vectis","component":"blueprint","lastUpdated":"2017-12-30T05:17:35.389Z","prices":{"avg_price":7,"low":7,"high":7,"ducats":45,"ducats_per_plat":6.428571428571429}},"valkyr_prime_blueprint":{"__type":"Item","name":"valkyr","component":"blueprint","lastUpdated":"2017-12-30T05:17:35.868Z","prices":{"avg_price":5.9,"low":2.4,"high":9.4,"ducats":15,"ducats_per_plat":6.25}},"silva_and_aegis_prime_blueprint":{"__type":"Item","name":"silva and aegis","component":"blueprint","lastUpdated":"2017-12-30T05:17:36.454Z","prices":{"avg_price":4.6,"low":4.4,"high":4.8,"ducats":45,"ducats_per_plat":10.227272727272727}},"boar_prime_stock":{"__type":"Item","name":"boar","component":"stock","lastUpdated":"2017-12-30T05:17:37.115Z","prices":{"avg_price":29.785714285714285,"low":29.285714285714285,"high":30.285714285714285,"ducats":100,"ducats_per_plat":3.4146341463414633}},"rhino_prime_neuroptics":{"__type":"Item","name":"rhino","component":"neuroptics","lastUpdated":"2017-12-30T05:17:37.850Z","prices":{"avg_price":49.875,"low":46.25,"high":53.5,"ducats":45,"ducats_per_plat":0.972972972972973}},"vasto_prime_receiver":{"__type":"Item","name":"vasto","component":"receiver","lastUpdated":"2017-12-30T05:17:38.002Z","prices":{"avg_price":5.714285714285714,"low":5.571428571428571,"high":5.857142857142857,"ducats":15,"ducats_per_plat":2.6923076923076925}},"akstiletto_prime_blueprint":{"__type":"Item","name":"akstiletto","component":"blueprint","lastUpdated":"2017-12-30T05:17:38.608Z","prices":{"avg_price":13,"low":9.666666666666666,"high":16.333333333333332,"ducats":100,"ducats_per_plat":10.344827586206897}},"boltor_prime_receiver":{"__type":"Item","name":"boltor","component":"receiver","lastUpdated":"2017-12-30T05:17:39.372Z","prices":{"avg_price":19.8125,"low":17.875,"high":21.75,"ducats":45,"ducats_per_plat":2.5174825174825175}},"ankyros_prime_blueprint":{"__type":"Item","name":"ankyros","component":"blueprint","lastUpdated":"2017-12-30T05:17:39.885Z","prices":{"avg_price":7.111111111111111,"low":7.111111111111111,"high":7.111111111111111,"ducats":15,"ducats_per_plat":2.109375}},"ballistica_prime_blueprint":{"__type":"Item","name":"ballistica","component":"blueprint","lastUpdated":"2017-12-30T05:17:40.501Z","prices":{"avg_price":15.5,"low":14.75,"high":16.25,"ducats":100,"ducats_per_plat":6.779661016949152}},"tigris_prime_stock":{"__type":"Item","name":"tigris","component":"stock","lastUpdated":"2017-12-30T05:17:40.894Z","prices":{"avg_price":2.3333333333333335,"low":1.6666666666666667,"high":3,"ducats":15,"ducats_per_plat":9}},"orthos_prime_blade":{"__type":"Item","name":"orthos","component":"blade","lastUpdated":"2017-12-30T05:17:41.534Z","prices":{"avg_price":6.5,"low":5.5,"high":7.5,"ducats":45,"ducats_per_plat":8.181818181818182}},"paris_prime_lower_limb":{"__type":"Item","name":"paris","component":"lower limb","lastUpdated":"2017-12-30T05:17:42.060Z","prices":{"avg_price":2,"low":1.5,"high":2.5,"ducats":15,"ducats_per_plat":10}},"nova_prime_systems":{"__type":"Item","name":"nova","component":"systems","lastUpdated":"2017-12-30T05:17:42.713Z","prices":{"avg_price":25.9,"low":22,"high":29.8,"ducats":15,"ducats_per_plat":0.6818181818181818}},"kavasa_prime_collar_band":{"__type":"Item","name":"kavasa","component":"collar band","lastUpdated":"2017-12-30T05:17:43.219Z","prices":{"avg_price":6.25,"low":6.25,"high":6.25,"ducats":45,"ducats_per_plat":7.2}},"nova_prime_neuroptics":{"__type":"Item","name":"nova","component":"neuroptics","lastUpdated":"2017-12-30T05:17:43.741Z","prices":{"avg_price":7.25,"low":5.75,"high":8.75,"ducats":15,"ducats_per_plat":2.608695652173913}},"nami_skyla_prime_handle":{"__type":"Item","name":"nami skyla","component":"handle","lastUpdated":"2017-12-30T05:17:45.928Z","prices":{"avg_price":3.1666666666666665,"low":3,"high":3.3333333333333335,"ducats":45,"ducats_per_plat":15}},"carrier_prime_cerebrum":{"__type":"Item","name":"carrier","component":"cerebrum","lastUpdated":"2017-12-30T05:17:46.207Z","prices":{"avg_price":69,"low":66.4,"high":71.6,"ducats":65,"ducats_per_plat":0.9789156626506024}},"akbolto_prime_barrel":{"__type":"Item","name":"akbolto","component":"barrel","lastUpdated":"2017-12-30T05:17:46.732Z","prices":{"avg_price":20,"low":17.5,"high":22.5,"ducats_per_plat":null}},"hikou_prime_stars":{"__type":"Item","name":"hikou","component":"stars","lastUpdated":"2017-12-30T05:17:47.371Z","prices":{"avg_price":10.125,"low":7.5,"high":12.75,"ducats":15,"ducats_per_plat":2}},"scindo_prime_blueprint":{"__type":"Item","name":"scindo","component":"blueprint","lastUpdated":"2017-12-30T05:17:47.874Z","prices":{"avg_price":4.75,"low":4.5,"high":5,"ducats":45,"ducats_per_plat":10}},"odonata_prime_blueprint":{"__type":"Item","name":"odonata","component":"blueprint","lastUpdated":"2017-12-30T05:17:48.375Z","prices":{"avg_price":7.7,"low":6,"high":9.4,"ducats":45,"ducats_per_plat":7.5}},"fragor_prime_blueprint":{"__type":"Item","name":"fragor","component":"blueprint","lastUpdated":"2017-12-30T05:17:48.924Z","prices":{"avg_price":6.25,"low":6,"high":6.5,"ducats":65,"ducats_per_plat":10.833333333333334}},"vauban_prime_blueprint":{"__type":"Item","name":"vauban","component":"blueprint","lastUpdated":"2017-12-30T05:17:49.582Z","prices":{"avg_price":18.125,"low":16.5,"high":19.75,"ducats":100,"ducats_per_plat":6.0606060606060606}},"latron_prime_blueprint":{"__type":"Item","name":"latron","component":"blueprint","lastUpdated":"2017-12-30T05:17:50.107Z","prices":{"avg_price":9.714285714285714,"low":9.714285714285714,"high":9.714285714285714,"ducats":15,"ducats_per_plat":1.5441176470588236}},"ember_prime_systems":{"__type":"Item","name":"ember","component":"systems","lastUpdated":"2017-12-30T05:17:50.814Z","prices":{"avg_price":74.625,"low":68,"high":81.25,"ducats":45,"ducats_per_plat":0.6617647058823529}},"glaive_prime_blueprint":{"__type":"Item","name":"glaive","component":"blueprint","lastUpdated":"2017-12-30T05:17:51.130Z","prices":{"avg_price":71.85714285714286,"low":70.14285714285714,"high":73.57142857142857,"ducats":100,"ducats_per_plat":1.4256619144602851}},"frost_prime_chassis":{"__type":"Item","name":"frost","component":"chassis","lastUpdated":"2017-12-30T05:17:51.677Z","prices":{"avg_price":9.928571428571429,"low":9.428571428571429,"high":10.428571428571429,"ducats":15,"ducats_per_plat":1.5909090909090908}},"mag_prime_blueprint":{"__type":"Item","name":"mag","component":"blueprint","lastUpdated":"2017-12-30T05:17:52.696Z","prices":{"avg_price":43.333333333333336,"low":35,"high":51.666666666666664,"ducats":100,"ducats_per_plat":2.857142857142857}},"burston_prime_stock":{"__type":"Item","name":"burston","component":"stock","lastUpdated":"2017-12-30T05:17:52.804Z","prices":{"avg_price":5.9375,"low":5.75,"high":6.125,"ducats":15,"ducats_per_plat":2.608695652173913}},"fang_prime_blueprint":{"__type":"Item","name":"fang","component":"blueprint","lastUpdated":"2017-12-30T05:17:53.335Z","prices":{"avg_price":1.9,"low":1.8,"high":2,"ducats":15,"ducats_per_plat":8.333333333333334}},"reaper_prime_handle":{"__type":"Item","name":"reaper","component":"handle","lastUpdated":"2017-12-30T05:17:53.832Z","prices":{"avg_price":18.3,"low":17,"high":19.6,"ducats":15,"ducats_per_plat":0.8823529411764706}},"tigris_prime_barrel":{"__type":"Item","name":"tigris","component":"barrel","lastUpdated":"2017-12-30T05:17:54.352Z","prices":{"avg_price":3.5,"low":3,"high":4,"ducats":45,"ducats_per_plat":15}},"nova_prime_chassis":{"__type":"Item","name":"nova","component":"chassis","lastUpdated":"2017-12-30T05:17:55.007Z","prices":{"avg_price":164.66666666666666,"low":163,"high":166.33333333333334,"ducats":100,"ducats_per_plat":0.6134969325153374}},"soma_prime_blueprint":{"__type":"Item","name":"soma","component":"blueprint","lastUpdated":"2017-12-30T05:17:55.508Z","prices":{"avg_price":5.416666666666667,"low":5.166666666666667,"high":5.666666666666667,"ducats":15,"ducats_per_plat":2.9032258064516125}},"helios_prime_blueprint":{"__type":"Item","name":"helios","component":"blueprint","lastUpdated":"2017-12-30T05:17:56.015Z","prices":{"avg_price":4.5,"low":4.333333333333333,"high":4.666666666666667,"ducats":45,"ducats_per_plat":10.384615384615385}},"spira_prime_blueprint":{"__type":"Item","name":"spira","component":"blueprint","lastUpdated":"2017-12-30T05:17:56.521Z","prices":{"avg_price":5.142857142857143,"low":3.2857142857142856,"high":7,"ducats":15,"ducats_per_plat":4.565217391304348}},"nekros_prime_systems":{"__type":"Item","name":"nekros","component":"systems","lastUpdated":"2017-12-30T05:17:57.043Z","prices":{"avg_price":20.166666666666668,"low":17.666666666666668,"high":22.666666666666668,"ducats":100,"ducats_per_plat":5.660377358490566}},"paris_prime_string":{"__type":"Item","name":"paris","component":"string","lastUpdated":"2017-12-30T05:17:57.685Z","prices":{"avg_price":4.9,"low":4.2,"high":5.6,"ducats":15,"ducats_per_plat":3.571428571428571}},"paris_prime_grip":{"__type":"Item","name":"paris","component":"grip","lastUpdated":"2017-12-30T05:17:58.192Z","prices":{"avg_price":4.125,"low":4,"high":4.25,"ducats":45,"ducats_per_plat":11.25}},"sybaris_prime_stock":{"__type":"Item","name":"sybaris","component":"stock","lastUpdated":"2017-12-30T05:17:58.702Z","prices":{"avg_price":2.357142857142857,"low":2,"high":2.7142857142857144,"ducats":15,"ducats_per_plat":7.5}},"burston_prime_receiver":{"__type":"Item","name":"burston","component":"receiver","lastUpdated":"2017-12-30T05:17:59.219Z","prices":{"avg_price":3.2142857142857144,"low":2.142857142857143,"high":4.285714285714286,"ducats":15,"ducats_per_plat":7}},"spira_prime_pouch":{"__type":"Item","name":"spira","component":"pouch","lastUpdated":"2017-12-30T05:17:59.738Z","prices":{"avg_price":17.1,"low":12.6,"high":21.6,"ducats":100,"ducats_per_plat":7.936507936507937}},"soma_prime_stock":{"__type":"Item","name":"soma","component":"stock","lastUpdated":"2017-12-30T05:18:00.412Z","prices":{"avg_price":62.25,"low":59.333333333333336,"high":65.16666666666667,"ducats":100,"ducats_per_plat":1.6853932584269662}},"ash_prime_blueprint":{"__type":"Item","name":"ash","component":"blueprint","lastUpdated":"2017-12-30T05:18:00.909Z","prices":{"avg_price":18.7,"low":16.6,"high":20.8,"ducats":45,"ducats_per_plat":2.710843373493976}},"nyx_prime_blueprint":{"__type":"Item","name":"nyx","component":"blueprint","lastUpdated":"2017-12-30T05:18:01.420Z","prices":{"avg_price":5.1,"low":4.6,"high":5.6,"ducats":15,"ducats_per_plat":3.2608695652173916}},"hikou_prime_blueprint":{"__type":"Item","name":"hikou","component":"blueprint","lastUpdated":"2017-12-30T05:18:01.815Z","prices":{"avg_price":4.055555555555555,"low":4,"high":4.111111111111111,"ducats":15,"ducats_per_plat":3.75}},"akbronco_prime_blueprint":{"__type":"Item","name":"akbronco","component":"blueprint","lastUpdated":"2017-12-30T05:18:02.418Z","prices":{"avg_price":4.928571428571429,"low":4.857142857142857,"high":5,"ducats":15,"ducats_per_plat":3.088235294117647}},"spira_prime_blade":{"__type":"Item","name":"spira","component":"blade","lastUpdated":"2017-12-30T05:18:03.079Z","prices":{"avg_price":31.083333333333332,"low":30,"high":32.166666666666664,"ducats":100,"ducats_per_plat":3.3333333333333335}},"sybaris_prime_barrel":{"__type":"Item","name":"sybaris","component":"barrel","lastUpdated":"2017-12-30T05:18:03.577Z","prices":{"avg_price":16.833333333333332,"low":13.333333333333334,"high":20.333333333333332,"ducats":100,"ducats_per_plat":7.5}},"saryn_prime_blueprint":{"__type":"Item","name":"saryn","component":"blueprint","lastUpdated":"2017-12-30T05:18:04.099Z","prices":{"avg_price":15.5,"low":7.75,"high":23.25,"ducats":65,"ducats_per_plat":8.387096774193548}},"soma_prime_receiver":{"__type":"Item","name":"soma","component":"receiver","lastUpdated":"2017-12-30T05:18:04.603Z","prices":{"avg_price":24.571428571428573,"low":24.428571428571427,"high":24.714285714285715,"ducats":45,"ducats_per_plat":1.842105263157895}},"valkyr_prime_neuroptics":{"__type":"Item","name":"valkyr","component":"neuroptics","lastUpdated":"2017-12-30T05:18:05.092Z","prices":{"avg_price":4.5,"low":3.3333333333333335,"high":5.666666666666667,"ducats":45,"ducats_per_plat":13.5}},"ballistica_prime_upper_limb":{"__type":"Item","name":"ballistica","component":"upper limb","lastUpdated":"2017-12-30T05:18:05.740Z","prices":{"avg_price":3.75,"low":3.25,"high":4.25,"ducats":45,"ducats_per_plat":13.846153846153847}},"volt_prime_systems":{"__type":"Item","name":"volt","component":"systems","lastUpdated":"2017-12-30T05:18:06.229Z","prices":{"avg_price":15.2,"low":14.6,"high":15.8,"ducats":45,"ducats_per_plat":3.0821917808219177}},"akbolto_prime_link":{"__type":"Item","name":"akbolto","component":"link","lastUpdated":"2017-12-30T05:18:06.642Z","prices":{"avg_price":7,"low":4,"high":10,"ducats_per_plat":null}},"burston_prime_blueprint":{"__type":"Item","name":"burston","component":"blueprint","lastUpdated":"2017-12-30T05:18:07.267Z","prices":{"avg_price":4.083333333333333,"low":3.3333333333333335,"high":4.833333333333333,"ducats":15,"ducats_per_plat":4.5}},"mirage_prime_chassis":{"__type":"Item","name":"mirage","component":"chassis","lastUpdated":"2017-12-30T05:18:07.631Z","prices":{"avg_price":10,"low":5,"high":15,"ducats_per_plat":null}},"mag_prime_chassis":{"__type":"Item","name":"mag","component":"chassis","lastUpdated":"2017-12-30T05:18:09.126Z","prices":{"avg_price":8,"low":7.25,"high":8.75,"ducats":45,"ducats_per_plat":6.206896551724138}},"dakra_prime_handle":{"__type":"Item","name":"dakra","component":"handle","lastUpdated":"2017-12-30T05:18:09.230Z","prices":{"avg_price":5.125,"low":4.75,"high":5.5,"ducats":15,"ducats_per_plat":3.1578947368421053}},"orthos_prime_handle":{"__type":"Item","name":"orthos","component":"handle","lastUpdated":"2017-12-30T05:18:09.745Z","prices":{"avg_price":2.4,"low":2.4,"high":2.4,"ducats":15,"ducats_per_plat":6.25}},"valkyr_prime_systems":{"__type":"Item","name":"valkyr","component":"systems","lastUpdated":"2017-12-30T05:18:10.275Z","prices":{"avg_price":24,"low":17,"high":31,"ducats":100,"ducats_per_plat":5.882352941176471}},"vauban_prime_systems":{"__type":"Item","name":"vauban","component":"systems","lastUpdated":"2017-12-30T05:18:10.773Z","prices":{"avg_price":20,"low":16.666666666666668,"high":23.333333333333332,"ducats":100,"ducats_per_plat":6}},"scindo_prime_handle":{"__type":"Item","name":"scindo","component":"handle","lastUpdated":"2017-12-30T05:18:11.404Z","prices":{"avg_price":5.583333333333333,"low":5,"high":6.166666666666667,"ducats":45,"ducats_per_plat":9}},"reaper_prime_blade":{"__type":"Item","name":"reaper","component":"blade","lastUpdated":"2017-12-30T05:18:11.778Z","prices":{"avg_price":51.285714285714285,"low":49,"high":53.57142857142857,"ducats":45,"ducats_per_plat":0.9183673469387755}},"dual_kamas_prime_blade":{"__type":"Item","name":"dual kamas","component":"blade","lastUpdated":"2017-12-30T05:18:12.426Z","prices":{"avg_price":41.0625,"low":40.625,"high":41.5,"ducats":100,"ducats_per_plat":2.4615384615384617}},"frost_prime_blueprint":{"__type":"Item","name":"frost","component":"blueprint","lastUpdated":"2017-12-30T05:18:12.935Z","prices":{"avg_price":84.41666666666667,"low":81.5,"high":87.33333333333333,"ducats":100,"ducats_per_plat":1.2269938650306749}},"latron_prime_stock":{"__type":"Item","name":"latron","component":"stock","lastUpdated":"2017-12-30T05:18:13.440Z","prices":{"avg_price":12.428571428571429,"low":11.285714285714286,"high":13.571428571428571,"ducats":15,"ducats_per_plat":1.3291139240506329}},"oberon_prime_blueprint":{"__type":"Item","name":"oberon","component":"blueprint","lastUpdated":"2017-12-30T05:18:14.122Z","prices":{"avg_price":4.875,"low":4,"high":5.75,"ducats":45,"ducats_per_plat":11.25}},"ember_prime_chassis":{"__type":"Item","name":"ember","component":"chassis","lastUpdated":"2017-12-30T05:18:14.836Z","prices":{"avg_price":46,"low":40.25,"high":51.75,"ducats":15,"ducats_per_plat":0.37267080745341613}},"sicarus_prime_barrel":{"__type":"Item","name":"sicarus","component":"barrel","lastUpdated":"2017-12-30T05:18:15.093Z","prices":{"avg_price":22.666666666666668,"low":21.833333333333332,"high":23.5,"ducats":15,"ducats_per_plat":0.6870229007633588}},"ballistica_prime_string":{"__type":"Item","name":"ballistica","component":"string","lastUpdated":"2017-12-30T05:18:15.661Z","prices":{"avg_price":5.5,"low":3.3333333333333335,"high":7.666666666666667,"ducats":45,"ducats_per_plat":13.5}},"mirage_prime_neuroptics":{"__type":"Item","name":"mirage","component":"neuroptics","lastUpdated":"2017-12-30T05:18:15.989Z","prices":{"avg_price":9.5,"low":6.5,"high":12.5,"ducats_per_plat":null}},"kogake_prime_gauntlet":{"__type":"Item","name":"kogake","component":"gauntlet","lastUpdated":"2017-12-30T05:18:16.526Z","prices":{"avg_price":25.875,"low":21.75,"high":30,"ducats_per_plat":null}},"hydroid_prime_chassis":{"__type":"Item","name":"hydroid","component":"chassis","lastUpdated":"2017-12-30T05:18:17.130Z","prices":{"avg_price":5,"low":5,"high":5,"ducats":15,"ducats_per_plat":3}},"boltor_prime_barrel":{"__type":"Item","name":"boltor","component":"barrel","lastUpdated":"2017-12-30T05:18:17.659Z","prices":{"avg_price":13.333333333333334,"low":10,"high":16.666666666666668,"ducats":15,"ducats_per_plat":1.5}},"rhino_prime_chassis":{"__type":"Item","name":"rhino","component":"chassis","lastUpdated":"2017-12-30T05:18:18.437Z","prices":{"avg_price":80,"low":78,"high":82,"ducats":65,"ducats_per_plat":0.8333333333333334}},"ankyros_prime_gauntlet":{"__type":"Item","name":"ankyros","component":"gauntlet","lastUpdated":"2017-12-30T05:18:18.583Z","prices":{"avg_price":13.083333333333334,"low":12.666666666666666,"high":13.5,"ducats":15,"ducats_per_plat":1.1842105263157896}},"vauban_prime_neuroptics":{"__type":"Item","name":"vauban","component":"neuroptics","lastUpdated":"2017-12-30T05:18:19.243Z","prices":{"avg_price":20.333333333333332,"low":19,"high":21.666666666666668,"ducats":100,"ducats_per_plat":5.2631578947368425}},"euphona_prime_barrel":{"__type":"Item","name":"euphona","component":"barrel","lastUpdated":"2017-12-30T05:18:19.739Z","prices":{"avg_price":3.5833333333333335,"low":3,"high":4.166666666666667,"ducats":45,"ducats_per_plat":15}},"nyx_prime_neuroptics":{"__type":"Item","name":"nyx","component":"neuroptics","lastUpdated":"2017-12-30T05:18:20.258Z","prices":{"avg_price":64.875,"low":56,"high":73.75,"ducats":100,"ducats_per_plat":1.7857142857142858}},"hydroid_prime_blueprint":{"__type":"Item","name":"hydroid","component":"blueprint","lastUpdated":"2017-12-30T05:18:20.781Z","prices":{"avg_price":5.875,"low":4.75,"high":7,"ducats":45,"ducats_per_plat":9.473684210526315}},"nikana_prime_blade":{"__type":"Item","name":"nikana","component":"blade","lastUpdated":"2017-12-30T05:18:21.296Z","prices":{"avg_price":36.125,"low":33,"high":39.25,"ducats":100,"ducats_per_plat":3.0303030303030303}},"vectis_prime_receiver":{"__type":"Item","name":"vectis","component":"receiver","lastUpdated":"2017-12-30T05:18:21.969Z","prices":{"avg_price":73.85714285714286,"low":71.71428571428571,"high":76,"ducats":100,"ducats_per_plat":1.3944223107569722}},"oberon_prime_neuroptics":{"__type":"Item","name":"oberon","component":"neuroptics","lastUpdated":"2017-12-30T05:18:22.679Z","prices":{"avg_price":21.1,"low":18.4,"high":23.8,"ducats":100,"ducats_per_plat":5.434782608695652}},"banshee_prime_neuroptics":{"__type":"Item","name":"banshee","component":"neuroptics","lastUpdated":"2017-12-30T05:18:22.992Z","prices":{"avg_price":4.5,"low":2.75,"high":6.25,"ducats":15,"ducats_per_plat":5.454545454545454}},"saryn_prime_chassis":{"__type":"Item","name":"saryn","component":"chassis","lastUpdated":"2017-12-30T05:18:23.526Z","prices":{"avg_price":52.625,"low":46.5,"high":58.75,"ducats":100,"ducats_per_plat":2.150537634408602}},"carrier_prime_blueprint":{"__type":"Item","name":"carrier","component":"blueprint","lastUpdated":"2017-12-30T05:18:23.973Z","prices":{"avg_price":5.1,"low":4,"high":6.2,"ducats":15,"ducats_per_plat":3.75}},"cernos_prime_grip":{"__type":"Item","name":"cernos","component":"grip","lastUpdated":"2017-12-30T05:18:24.659Z","prices":{"avg_price":3.5,"low":3,"high":4,"ducats":15,"ducats_per_plat":5}},"venka_prime_blueprint":{"__type":"Item","name":"venka","component":"blueprint","lastUpdated":"2017-12-30T05:18:25.149Z","prices":{"avg_price":3.75,"low":3.5,"high":4,"ducats":45,"ducats_per_plat":12.857142857142858}},"volt_prime_chassis":{"__type":"Item","name":"volt","component":"chassis","lastUpdated":"2017-12-30T05:18:25.652Z","prices":{"avg_price":17.3,"low":15.8,"high":18.8,"ducats":45,"ducats_per_plat":2.848101265822785}},"banshee_prime_chassis":{"__type":"Item","name":"banshee","component":"chassis","lastUpdated":"2017-12-30T05:18:26.313Z","prices":{"avg_price":20.5,"low":17.333333333333332,"high":23.666666666666668,"ducats":100,"ducats_per_plat":5.76923076923077}},"boltor_prime_blueprint":{"__type":"Item","name":"boltor","component":"blueprint","lastUpdated":"2017-12-30T05:18:26.650Z","prices":{"avg_price":43.916666666666664,"low":43,"high":44.833333333333336,"ducats":100,"ducats_per_plat":2.3255813953488373}},"dakra_prime_blade":{"__type":"Item","name":"dakra","component":"blade","lastUpdated":"2017-12-30T05:18:27.305Z","prices":{"avg_price":17.166666666666668,"low":15.833333333333334,"high":18.5,"ducats":65,"ducats_per_plat":4.105263157894736}},"banshee_prime_blueprint":{"__type":"Item","name":"banshee","component":"blueprint","lastUpdated":"2017-12-30T05:18:27.867Z","prices":{"avg_price":4.833333333333333,"low":4,"high":5.666666666666667,"ducats":45,"ducats_per_plat":11.25}},"rhino_prime_systems":{"__type":"Item","name":"rhino","component":"systems","lastUpdated":"2017-12-30T05:18:28.610Z","prices":{"avg_price":17.166666666666668,"low":16,"high":18.333333333333332,"ducats":15,"ducats_per_plat":0.9375}},"boar_prime_blueprint":{"__type":"Item","name":"boar","component":"blueprint","lastUpdated":"2017-12-30T05:18:28.876Z","prices":{"avg_price":7.428571428571429,"low":7.285714285714286,"high":7.571428571428571,"ducats":15,"ducats_per_plat":2.058823529411765}},"hydroid_prime_systems":{"__type":"Item","name":"hydroid","component":"systems","lastUpdated":"2017-12-30T05:18:29.337Z","prices":{"avg_price":17.625,"low":15.25,"high":20,"ducats":100,"ducats_per_plat":6.557377049180328}},"sybaris_prime_receiver":{"__type":"Item","name":"sybaris","component":"receiver","lastUpdated":"2017-12-30T05:18:30.011Z","prices":{"avg_price":5,"low":4.4,"high":5.6,"ducats":45,"ducats_per_plat":10.227272727272727}},"akbolto_prime_blueprint":{"__type":"Item","name":"akbolto","component":"blueprint","lastUpdated":"2017-12-30T05:18:30.522Z","prices":{"avg_price":4.25,"low":4,"high":4.5,"ducats_per_plat":null}},"nova_prime_blueprint":{"__type":"Item","name":"nova","component":"blueprint","lastUpdated":"2017-12-30T05:18:31.065Z","prices":{"avg_price":39.3,"low":36.6,"high":42,"ducats":45,"ducats_per_plat":1.2295081967213115}},"nyx_prime_chassis":{"__type":"Item","name":"nyx","component":"chassis","lastUpdated":"2017-12-30T05:18:31.457Z","prices":{"avg_price":160.75,"low":158.33333333333334,"high":163.16666666666666,"ducats":100,"ducats_per_plat":0.631578947368421}},"mirage_prime_blueprint":{"__type":"Item","name":"mirage","component":"blueprint","lastUpdated":"2017-12-30T05:18:31.834Z","prices":{"avg_price":41.75,"low":34,"high":49.5,"ducats_per_plat":null}},"nyx_prime_systems":{"__type":"Item","name":"nyx","component":"systems","lastUpdated":"2017-12-30T05:18:32.500Z","prices":{"avg_price":17,"low":16,"high":18,"ducats":45,"ducats_per_plat":2.8125}},"sicarus_prime_receiver":{"__type":"Item","name":"sicarus","component":"receiver","lastUpdated":"2017-12-30T05:18:33.007Z","prices":{"avg_price":125.83333333333333,"low":115.83333333333333,"high":135.83333333333334,"ducats":100,"ducats_per_plat":0.8633093525179857}},"soma_prime_barrel":{"__type":"Item","name":"soma","component":"barrel","lastUpdated":"2017-12-30T05:18:33.500Z","prices":{"avg_price":12.5,"low":11,"high":14,"ducats":15,"ducats_per_plat":1.3636363636363635}},"glaive_prime_disc":{"__type":"Item","name":"glaive","component":"disc","lastUpdated":"2017-12-30T05:18:34.009Z","prices":{"avg_price":13.9,"low":12.4,"high":15.4,"ducats":45,"ducats_per_plat":3.629032258064516}},"vasto_prime_blueprint":{"__type":"Item","name":"vasto","component":"blueprint","lastUpdated":"2017-12-30T05:18:34.508Z","prices":{"avg_price":29.333333333333332,"low":28.333333333333332,"high":30.333333333333332,"ducats":45,"ducats_per_plat":1.5882352941176472}},"silva_and_aegis_prime_guard":{"__type":"Item","name":"silva and aegis","component":"guard","lastUpdated":"2017-12-30T05:18:35.159Z","prices":{"avg_price":13.666666666666666,"low":12.333333333333334,"high":15,"ducats":100,"ducats_per_plat":8.108108108108107}},"latron_prime_receiver":{"__type":"Item","name":"latron","component":"receiver","lastUpdated":"2017-12-30T05:18:35.651Z","prices":{"avg_price":13,"low":11.333333333333334,"high":14.666666666666666,"ducats":15,"ducats_per_plat":1.3235294117647058}},"reaper_prime_blueprint":{"__type":"Item","name":"reaper","component":"blueprint","lastUpdated":"2017-12-30T05:18:36.035Z","prices":{"avg_price":14.857142857142858,"low":14.857142857142858,"high":14.857142857142858,"ducats":15,"ducats_per_plat":1.0096153846153846}},"frost_prime_systems":{"__type":"Item","name":"frost","component":"systems","lastUpdated":"2017-12-30T05:18:36.676Z","prices":{"avg_price":17.25,"low":17,"high":17.5,"ducats":45,"ducats_per_plat":2.6470588235294117}},"ember_prime_neuroptics":{"__type":"Item","name":"ember","component":"neuroptics","lastUpdated":"2017-12-30T05:18:37.486Z","prices":{"avg_price":18.6,"low":18.4,"high":18.8,"ducats":15,"ducats_per_plat":0.8152173913043479}},"mirage_prime_systems":{"__type":"Item","name":"mirage","component":"systems","lastUpdated":"2017-12-30T05:18:38.001Z","prices":{"avg_price":20.5,"low":17.5,"high":23.5,"ducats_per_plat":null}},"silva_and_aegis_prime_hilt":{"__type":"Item","name":"silva and aegis","component":"hilt","lastUpdated":"2017-12-30T05:18:38.653Z","prices":{"avg_price":5,"low":4.875,"high":5.125,"ducats":15,"ducats_per_plat":3.076923076923077}},"ballistica_prime_receiver":{"__type":"Item","name":"ballistica","component":"receiver","lastUpdated":"2017-12-30T05:18:39.199Z","prices":{"avg_price":4.916666666666667,"low":4.666666666666667,"high":5.166666666666667,"ducats":45,"ducats_per_plat":9.642857142857142}}}}
        `);
        // let revivedRelics = dataJson.relics.relics.map((relic) => {
        //     return Relic.reviver(relic);
        // });
        relics = await getRelicDrops(); //{lastUpdated: dataJson.lastUpdated, relics: revivedRelics};
        Object.keys(dataJson.items).map((item) => {
            items.set(item, Item.reviver({
                name: dataJson.items[item].name,
                component: dataJson.items[item].component,
                lastUpdated: dataJson.items[item].lastUpdated,
                prices: dataJson.items[item].prices
            }));
        });
        console.log('done');
    } else {
        relics = await getRelicDrops();

        // await rateLimitedFunctionCalls(items, getItemPrices, (key, prices) => {
        //     let item = items.get(key);
        //     items.delete(key);
        //     item.id = prices[0];
        //     item.prices = prices[1];
        //     item.lastUpdated = new Date();
        //     items.set(key, item);
        // });
    }
    const producation = true;
    let orders = [];
    if (producation) {
        // targets = getSortedRelicDucatPerPlat().reverse().filter(value => value.value > 10);
        // function getOrdersFromTarget(target: {name: string, value: number}): Promise<{quantity: number, price: number, name: string}[]> {
        //     let item = items.get(target.name);
        //     return getOrders(item);
        // }
        // let targetMap = new Map<number, any>();
        // targets.forEach((val, i) => targetMap.set(i, val));
        // await rateLimitedFunctionCalls(targetMap, 5, getOrdersFromTarget, (key, order) => {
        //     orders = orders.concat(order);
        // });
        await rateLimitedFunctionCalls(items, getOrders, (key, order) => {
            orders = orders.concat(order);
        });
    } else {
//         orders = JSON.parse(`[
//   {
//     "item": {
//       "__type": "Item",
//       "name": "cernos",
//       "component": "string",
//       "lastUpdated": "2017-12-26T00:42:54.538Z",
//       "prices": {
//         "avg_price": 3.357142857142857,
//         "low": 3.2857142857142856,
//         "high": 3.4285714285714284,
//         "ducats": 45,
//         "ducats_per_plat": 13.404255319148936
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "rugged53"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "helios",
//       "component": "systems",
//       "lastUpdated": "2017-12-26T00:43:04.417Z",
//       "prices": {
//         "avg_price": 3.6666666666666665,
//         "low": 3.5,
//         "high": 3.8333333333333335,
//         "ducats": 45,
//         "ducats_per_plat": 12.272727272727273
//       }
//     },
//     "quantity": 2,
//     "price": 3,
//     "name": "deadjon1237"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "venka",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:08.446Z",
//       "prices": {
//         "avg_price": 2.5714285714285716,
//         "low": 2.4285714285714284,
//         "high": 2.7142857142857144,
//         "ducats": 45,
//         "ducats_per_plat": 17.5
//       }
//     },
//     "quantity": 4,
//     "price": 3,
//     "name": "Laederlappen"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "venka",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:08.446Z",
//       "prices": {
//         "avg_price": 2.5714285714285716,
//         "low": 2.4285714285714284,
//         "high": 2.7142857142857144,
//         "ducats": 45,
//         "ducats_per_plat": 17.5
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "rugged53"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "venka",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:08.446Z",
//       "prices": {
//         "avg_price": 2.5714285714285716,
//         "low": 2.4285714285714284,
//         "high": 2.7142857142857144,
//         "ducats": 45,
//         "ducats_per_plat": 17.5
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "NeonZeas"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "nami skyla",
//       "component": "handle",
//       "lastUpdated": "2017-12-26T00:43:13.166Z",
//       "prices": {
//         "avg_price": 4.375,
//         "low": 3,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.285714285714286
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "B4tm4nD4rkKnight"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "nami skyla",
//       "component": "handle",
//       "lastUpdated": "2017-12-26T00:43:13.166Z",
//       "prices": {
//         "avg_price": 4.375,
//         "low": 3,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.285714285714286
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "LareTheHunter"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "galatine",
//       "component": "handle",
//       "lastUpdated": "2017-12-26T00:43:11.826Z",
//       "prices": {
//         "avg_price": 3.375,
//         "low": 3,
//         "high": 3.75,
//         "ducats": 45,
//         "ducats_per_plat": 13.333333333333334
//       }
//     },
//     "quantity": 2,
//     "price": 3,
//     "name": "Bereniso"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "oberon",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:10.267Z",
//       "prices": {
//         "avg_price": 3.5,
//         "low": 3.3333333333333335,
//         "high": 3.6666666666666665,
//         "ducats": 45,
//         "ducats_per_plat": 12.857142857142858
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Dernasur"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "oberon",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:10.267Z",
//       "prices": {
//         "avg_price": 3.5,
//         "low": 3.3333333333333335,
//         "high": 3.6666666666666665,
//         "ducats": 45,
//         "ducats_per_plat": 12.857142857142858
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Ashen_shadow"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "euphona",
//       "component": "barrel",
//       "lastUpdated": "2017-12-26T00:43:05.692Z",
//       "prices": {
//         "avg_price": 3.1666666666666665,
//         "low": 3.111111111111111,
//         "high": 3.2222222222222223,
//         "ducats": 45,
//         "ducats_per_plat": 14.210526315789474
//       }
//     },
//     "quantity": 2,
//     "price": 3,
//     "name": "Iconn2"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "euphona",
//       "component": "barrel",
//       "lastUpdated": "2017-12-26T00:43:05.692Z",
//       "prices": {
//         "avg_price": 3.1666666666666665,
//         "low": 3.111111111111111,
//         "high": 3.2222222222222223,
//         "ducats": 45,
//         "ducats_per_plat": 14.210526315789474
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "holoziom123"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "euphona",
//       "component": "barrel",
//       "lastUpdated": "2017-12-26T00:43:05.692Z",
//       "prices": {
//         "avg_price": 3.1666666666666665,
//         "low": 3.111111111111111,
//         "high": 3.2222222222222223,
//         "ducats": 45,
//         "ducats_per_plat": 14.210526315789474
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Sylvantis"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "kavasa",
//       "component": "collar blueprint",
//       "lastUpdated": "2017-12-26T00:43:05.657Z",
//       "prices": {
//         "avg_price": 3.75,
//         "low": 3.75,
//         "high": 3.75,
//         "ducats": 45,
//         "ducats_per_plat": 12
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "ktoto101010"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "tigris",
//       "component": "receiver",
//       "lastUpdated": "2017-12-26T00:43:09.891Z",
//       "prices": {
//         "avg_price": 3.8,
//         "low": 3.4,
//         "high": 4.2,
//         "ducats": 45,
//         "ducats_per_plat": 11.842105263157896
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Eyleus"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "paris",
//       "component": "grip",
//       "lastUpdated": "2017-12-26T00:43:09.075Z",
//       "prices": {
//         "avg_price": 3.4,
//         "low": 3.4,
//         "high": 3.4,
//         "ducats": 45,
//         "ducats_per_plat": 13.23529411764706
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "supereece"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "paris",
//       "component": "grip",
//       "lastUpdated": "2017-12-26T00:43:09.075Z",
//       "prices": {
//         "avg_price": 3.4,
//         "low": 3.4,
//         "high": 3.4,
//         "ducats": 45,
//         "ducats_per_plat": 13.23529411764706
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Wolfpatronus"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 3,
//     "price": 3,
//     "name": "Laederlappen"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "D3r3zz3d"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "supereece"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "iF1GHTx"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "expendid"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "YureiBlossom"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Kenpachi25"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 2,
//     "name": "Eyleus"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Yamafan"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "akbronco",
//       "component": "link",
//       "lastUpdated": "2017-12-26T00:43:11.287Z",
//       "prices": {
//         "avg_price": 2.75,
//         "low": 2.25,
//         "high": 3.25,
//         "ducats": 45,
//         "ducats_per_plat": 16.363636363636363
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "sctgod"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "cernos",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:05.139Z",
//       "prices": {
//         "avg_price": 4.25,
//         "low": 2.75,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.588235294117647
//       }
//     },
//     "quantity": 1,
//     "price": 2,
//     "name": "deadjon1237"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "cernos",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:05.139Z",
//       "prices": {
//         "avg_price": 4.25,
//         "low": 2.75,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.588235294117647
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "YureiBlossom"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "cernos",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:05.139Z",
//       "prices": {
//         "avg_price": 4.25,
//         "low": 2.75,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.588235294117647
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Catwithagun"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "cernos",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:05.139Z",
//       "prices": {
//         "avg_price": 4.25,
//         "low": 2.75,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.588235294117647
//       }
//     },
//     "quantity": 1,
//     "price": 2,
//     "name": "Yamafan"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "cernos",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:05.139Z",
//       "prices": {
//         "avg_price": 4.25,
//         "low": 2.75,
//         "high": 5.75,
//         "ducats": 45,
//         "ducats_per_plat": 10.588235294117647
//       }
//     },
//     "quantity": 1,
//     "price": 2,
//     "name": "Deminast"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "sybaris",
//       "component": "receiver",
//       "lastUpdated": "2017-12-26T00:43:02.323Z",
//       "prices": {
//         "avg_price": 4.055555555555555,
//         "low": 4,
//         "high": 4.111111111111111,
//         "ducats": 45,
//         "ducats_per_plat": 11.095890410958905
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "DefunctDude"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "tigris",
//       "component": "barrel",
//       "lastUpdated": "2017-12-26T00:43:01.934Z",
//       "prices": {
//         "avg_price": 2.6,
//         "low": 2.4,
//         "high": 2.8,
//         "ducats": 45,
//         "ducats_per_plat": 17.307692307692307
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Sylvantis"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "tigris",
//       "component": "barrel",
//       "lastUpdated": "2017-12-26T00:43:01.934Z",
//       "prices": {
//         "avg_price": 2.6,
//         "low": 2.4,
//         "high": 2.8,
//         "ducats": 45,
//         "ducats_per_plat": 17.307692307692307
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Yamafan"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "helios",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:10.444Z",
//       "prices": {
//         "avg_price": 3.375,
//         "low": 3.25,
//         "high": 3.5,
//         "ducats": 45,
//         "ducats_per_plat": 13.333333333333334
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "deadjon1237"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "helios",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:10.444Z",
//       "prices": {
//         "avg_price": 3.375,
//         "low": 3.25,
//         "high": 3.5,
//         "ducats": 45,
//         "ducats_per_plat": 13.333333333333334
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Lostarkofpandora"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "helios",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:10.444Z",
//       "prices": {
//         "avg_price": 3.375,
//         "low": 3.25,
//         "high": 3.5,
//         "ducats": 45,
//         "ducats_per_plat": 13.333333333333334
//       }
//     },
//     "quantity": 2,
//     "price": 3,
//     "name": "LokenGsun"
//   },
//   {
//     "item": {
//       "__type": "Item",
//       "name": "helios",
//       "component": "blueprint",
//       "lastUpdated": "2017-12-26T00:43:10.444Z",
//       "prices": {
//         "avg_price": 3.375,
//         "low": 3.25,
//         "high": 3.5,
//         "ducats": 45,
//         "ducats_per_plat": 13.333333333333334
//       }
//     },
//     "quantity": 1,
//     "price": 3,
//     "name": "Laederlappen"
//   }
// ]`);
    }
    let ordersPerUser = {};
    let ducatsPerUser = {};
    let platPerUser = {};
    orders.forEach((order) => {
        if (ordersPerUser[order.name] == null) {
            ordersPerUser[order.name] = [];
        }
        if (platPerUser[order.name] == null) {
            platPerUser[order.name] = 0;
        }
        if (ducatsPerUser[order.name] == null) {
            ducatsPerUser[order.name] = 0;
        }
        ducatsPerUser[order.name] += order.quantity * order.item.prices.ducats;
        platPerUser[order.name] += order.quantity * order.price;
        ordersPerUser[order.name].push(order);
    });
    let seperatedOrders = [
        {},
        {}
    ];
    Object.keys(ordersPerUser).forEach(((key) => {
        if (ducatsPerUser[key] / platPerUser[key] > 15) {
            seperatedOrders[0][key] = ordersPerUser[key];
        } else {
            seperatedOrders[1][key] = ordersPerUser[key];
        }
    }));
    let userRequests: string[] = [];
    seperatedOrders.forEach(aordersPerUser => {
        let sortedOrders = [];
        (() => {
            let userOrders = Object.keys(aordersPerUser).map(((key) => {
                return [key, aordersPerUser[key]];
            }));
            userOrders.sort(((a, b) => {
                let ATotalValue = 0;
                a[1].forEach((order) => {
                    ATotalValue += order.item.prices.ducats * order.quantity
                });
                let BTotalValue = 0;
                b[1].forEach((order) => {
                    BTotalValue += order.item.prices.ducats * order.quantity
                });
                return ATotalValue - BTotalValue;
            }));
            sortedOrders = userOrders.reverse();
        })();
        userRequests.push(orderListToString(sortedOrders));
    });
    let temp = userRequests.join('\n');
    fs.writeFileSync('./output.txt', temp);
    console.log('Success');
    notifier.notify({title: 'Orders Loaded'});
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

async function logBuys(cookie, csrftoken) {

    let fsPromise = new Promise<string>((resolve, reject) => fs.readFile('output.txt', {encoding: 'utf8'}, (err, data) => {
        if (err)
            reject(err);
        resolve(data);
    }));
    let data = await fsPromise;
    let lines = data.split('\n');
    let trades = [];
    for (let l of lines) {
        if (l.charAt(0) === '$') {
            trades.push(l.substring(1, l.length).split(' '));
        }
    }
    let tradesMap = new Map<number, any>();
    trades.forEach((val, i) => tradesMap.set(i, val));
    let tradeIds: string[] = [];
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
        tradeIds.push(trade);
    });
    let tradeMap = new Map<number, any>();
    tradeIds.forEach((val, i) => tradeMap.set(i, val));
    await rateLimitedFunctionCalls(tradeMap, (tId: {name: string, quantity: number}) => {
        return new Promise(async (resolve, reject) => {
            let count = new Map<number, number>();
            for (let i = 0; i < tId.quantity; i++) {
                count.set(i,i);
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
                    return orderDate > lastKiteerDate;
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
    let totals = new Map<string, number>();
    let totalPlatinum = 0;
    let totalDucats = 0;
    closedOrders.forEach(order => {
        let prevTotal = totals.get(order.urlName);
        if (prevTotal == null) {
            totals.set(order.urlName, order.quantity);
        } else {
            totals.set(order.urlName, prevTotal + order.quantity);
        }
        totalPlatinum += order.platinum * order.quantity;
        if (itemIds()[order.urlName] != null)
            totalDucats += itemIds()[order.urlName].ducats * order.quantity;
    });
    let temp = "";
    totals.forEach((value, key) => {
        temp += (`${value}x ${key}\n`);
    });
    temp += `Total Platinum: ${totalPlatinum}\nTotal Ducats: ${totalDucats}\nAverage Ducats/Platinum: ${totalDucats/totalPlatinum}`;
    fs.writeFileSync('output.txt', temp);
}

async function main() {
    const cookie = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTUxMTk4MDAsImlzcyI6Imp3dCIsInNpZCI6InJFR1dIQnJrRlJoQ0tqQlRNY2VudlhIS1dZVWVNSG9qIiwiY3NyZl90b2tlbiI6ImU2NTQyNDg2Zjc1ZjUzNTc1OWM4NDJmMGRkM2UyYjI3MzgwNWFiODYiLCJsb2dpbl9pcCI6ImInMjQuMTgxLjE1My4yMjYnIiwiYXVkIjoiand0IiwibG9naW5fdWEiOiJiJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjU3LjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvNTcuMCciLCJhdXRoX21ldGhvZCI6ImNvb2tpZSIsImV4cCI6MTUyMDMwMzgwMCwic2VjdXJlIjp0cnVlLCJqd3RfaWRlbnRpdHkiOiJEdWxzNXJXOEN5ZXhvYkZvOFFNY1hucE1FM3FaTnhtQSJ9.YWhloe6C2WudjUoBQQvHvAQ_gSY7KHiV_th5kWHezWo';
    let csrftoken = await getToken(cookie);
    await lookupOrders();
    // console.log("Waiting for user input:");
    // await new Promise((resolve) => {
    //     const stdin = process.openStdin();
    //     stdin.addListener('data', d => {resolve()});
    //     stdin.addListener('end', () => {});
    // });
    // console.log("Got user input.");
    // await logBuys(cookie, csrftoken);
    // await totalOrders(cookie, csrftoken, new Date(2017, 11, 30, 0, 0, 0, 0));
    console.log("Done");
}

main();

function orderListToString(orders): string {
    return orders.map((user) => {
        let partString = "";
        let partlist = "";
        let totalplat = 0;
        let totalducats = 0;
        user[1].forEach((item, index) => {
            if (item.price == 0 && item.quantity > 5) {
                partlist += `\n/w ${user[0]} Hi! just wanted to check to see if you meant to sell ${item.quantity}x ${item.item.name} ${item.item.name} for ${item.price} a piece. I do believe that you accidentally swapped the quantity and price fields though.`;
            } else {
                totalplat += item.quantity * item.price;
                totalducats += item.quantity * item.item.prices.ducats;
                partlist += `\n${item.item.urlName} ${item.price} ${item.quantity} (${item.item.prices.ducats / item.price})`;
                partString += `${item.quantity}x ${item.item.name} ${item.item.component}: ${item.quantity * item.price}plat${index < (user[1].length - 1) ? ',' : ''} `;
            }
        });
        return `/w ${user[0]} Hi! I want to buy: ${partString}(warframe.market)\nTotal plat: ${totalplat} Total ducats: ${totalducats} (${totalducats / totalplat})${partlist}`;
    }).join('\n');
}