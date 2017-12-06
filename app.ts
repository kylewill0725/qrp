import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import {DOMParser} from 'xmldom';
import * as select from 'xpath.js';
import * as https from 'https';

import * as index from './routes/index';
import * as users from './routes/users';
import {ItemDrop, Relic} from "./relic";
import {isNullOrUndefined} from "util";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

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

            const rarities = {
                'intact': [0.2533, 0.11, 0.02],
                'exceptional': [0.2333, 0.13, 0.04],
                'flawless': [0.2, 0.17, 0.06],
                'radiant': [0.1667, 0.2, 0.1]
            };

            relicDomList.forEach((relicDom) => {
                let [era, type,, quality] = relicDom.firstChild.firstChild.data.replace(/[\(\)]/g, '').split(' ');
                let items: ItemDrop[] = [];

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
                    let itemRarity = rarities[quality.toLowerCase()].indexOf(itemChance);


                    items.push(new ItemDrop({
                        name: itemName,
                        component: component,
                        rarity: itemRarity,
                        dropRarity: itemDropRarity,
                        chance: itemChance
                    }));

                    currentRow = select(currentRow, 'following-sibling::tr[1]')[0];
                }

                relicList.push(new Relic({
                    era: era,
                    type: type,
                    items: items,
                    purity: quality
                }));
            });
            resolve({lastUpdated: lastUpdated, relics: relicList});
        }
    });
}

function getItemPrices(item: ItemDrop): Promise<{avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}> {
    return new Promise<{avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}>((resolve, reject) => {
        const itemUrlName = `${item.name} prime ${item.component}`.replace(/ /g, '_');
        let result = "";
        let request = https.request({
            host: 'api.warframe.market',
            path: `/v1/items/${itemUrlName}/statistics?include=item`,
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
                priceData.ducats = resultObj['include']['item']['items_in_set'].filter((item) => item['url_name'] == itemUrlName)[0]['ducats'];

                let i = 1;
                for (let sold = 0; i <= itemPriceData.length && sold < 10; i++) {
                    priceData.avg_price += itemPriceData[itemPriceData.length - i]['avg_price'];
                    priceData.low += itemPriceData[itemPriceData.length - i]['min_price'];
                    priceData.high += itemPriceData[itemPriceData.length - i]['max_price'];
                    sold += itemPriceData[itemPriceData.length - i]['volume'];
                }
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

function getSortedRelicDucatList() {
    let reducedRelics = relics.relics.map((relic, i) => {
        let val = 0;
        relic.items.forEach(item => {
            val += item.chance * items[item.urlName].price.ducats;
        });
        return {index: i, value: val};
    });
    let sortedReducedRelics = reducedRelics.sort((a, b) => {
        return a.value - b.value;
    });
    return sortedReducedRelics.map(relic => relics[relic.index])
}

async function main() {
    if (fs.existsSync('data.json')) {
        let dataJson = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf8'}));
        relics = dataJson.relics;
        items = dataJson.items;
        console.log('done');
    } else {
        let relics = await getRelicDrops();
        let pricePromises = [];
        relics.relics.forEach((relic) => {
            relic.items.forEach((item) => {
                let itemUrlName = `${item.name} prime ${item.component}`.replace(/ /g, '_');
                if (items[itemUrlName] === undefined) {
                    pricePromises.push(getItemPrices(item).then(price => items[itemUrlName] = {
                        lastUpdated: new Date(),
                        price: price
                    }).catch(reason => console.log(reason)));
                }
            });
        });
        await Promise.all(pricePromises);

        await new Promise((resolve, reject) => {fs.open('data.json', 'w',(err, fd) => {
            fs.write(fd, JSON.stringify({relics: relics, items: items}),((err2, written, str) => {}));
            console.log('done');
            resolve();
        });});
    }
    let test = getSortedRelicDucatList();
}
main();

module.exports = app;
