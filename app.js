"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const xmldom_1 = require("xmldom");
const select = require("xpath.js");
const https = require("https");
const index = require("./routes/index");
const users = require("./routes/users");
const relic_1 = require("./relic");
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
function getRelicDrops() {
    return new Promise((resolve, reject) => {
        let content = "";
        https.get('https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html', (response) => {
            response.on('data', (d) => {
                content += d;
            });
            response.on('end', parseWarframeDropsSite);
        });
        function parseWarframeDropsSite() {
            const dom = new xmldom_1.DOMParser().parseFromString(content);
            const relicRewardsTable = select(dom, '//h3[@id="relicRewards"]')[0].nextSibling;
            const relicDomList = select(relicRewardsTable, 'child::tr[th[contains(text(), "Intact")]]'); //Selects the table row of the relic header. The six siblings after this header are drops.
            let relicList = [];
            const rarities = {
                'intact': [0.2533, 0.11, 0.02],
                'exceptional': [0.2333, 0.13, 0.04],
                'flawless': [0.2, 0.17, 0.06],
                'radiant': [0.1667, 0.2, 0.1]
            };
            relicDomList.forEach((relicDom) => {
                let [era, type, , quality] = relicDom.firstChild.firstChild.data.replace(/[\(\)]/g, '').split(' ');
                let items = [];
                let currentRow = select(relicDom, 'following-sibling::tr[1]')[0];
                for (let i = 0; i < 6; i++) {
                    let itemDropDomName = currentRow.firstChild.firstChild.data.replace(/( prime)( \w+)( blueprint)*/gi, '$2').split(' ');
                    let itemName = itemDropDomName.slice(0, -1).join(' ');
                    let component = itemDropDomName.slice(-1)[0];
                    let itemDropDomChance = currentRow.lastChild.firstChild.data.match(/(\w+) \((\d+).(\d+)%\)/);
                    let itemDropRarity = itemDropDomChance[1];
                    let itemChance = parseInt(itemDropDomChance[2] + itemDropDomChance[3]) / 10000;
                    let itemRarity = rarities[quality.toLowerCase()].indexOf(itemChance);
                    items.push(new relic_1.ItemDrop({
                        name: itemName,
                        component: component,
                        rarity: itemRarity,
                        dropRarity: itemDropRarity,
                        chance: itemChance
                    }));
                    currentRow = select(currentRow, 'following-sibling::tr[1]')[0];
                }
                relicList.push(new relic_1.Relic({
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync('data.json')) {
        }
        else {
            relics = yield getRelicDrops();
            console.log('done');
        }
    });
}
main();
module.exports = app;
//# sourceMappingURL=app.js.map