import * as https from 'https';
import {DOMParser} from 'xmldom';
import * as select from 'xpath.js';

function getRelicDrops() {

    let content = "";
    https.get("https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html", (response) => {
        response.on('data', (d) => {
            content += d;
        });
        response.on('end', parseWarframeDropsSite);
    });
    function parseWarframeDropsSite() {
        const dom = new DOMParser().parseFromString(content);
        const relicRewardsTable = select(dom, '//h3[@id="relicRewards"]')[0].nextSibling;
        const relicList = select(relicRewardsTable, 'child::tr[th]'); //Selects the table row of the relic header. The six siblings after this header are drops.
        relicList.forEach(() => {

        });
    }
}

getRelicDrops();