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

let relics = [];

function getRelicDrops(): Promise<Relic[]> {
    return new Promise((resolve, reject) => {
        let content = "";
        https.get('https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html', (response) => {
            response.on('data', (d) => {
                content += d;
            });
            response.on('end', parseWarframeDropsSite);
        });
        function parseWarframeDropsSite() {
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
                    let itemDropDomName = currentRow.firstChild.firstChild.data.replace(/( prime)( \w+)( blueprint)*/gi, '$2').split(' ');
                    let itemName = itemDropDomName.slice(0, -1).join(' ');
                    let component = itemDropDomName.slice(-1)[0];

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
                    rating: quality
                }));
            });
            resolve(relicList);
        }
    });
}

async function main() {
    if (fs.existsSync('data.json')) {

    } else {
        relics = await getRelicDrops();
        console.log('done');
    }
}

main();

module.exports = app;
