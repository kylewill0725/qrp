import * as https from "https";

export class Relic {
    static purities = {
        'intact': [0.2533, 0.11, 0.02],
        'exceptional': [0.2333, 0.13, 0.04],
        'flawless': [0.2, 0.17, 0.06],
        'radiant': [0.1667, 0.2, 0.1]
    };

    __type = 'Relic';
    /**
     * Era of relic.
     * lith, meso, neo, axi
     */
    era: string;

    /**
     * Type of relic
     * a1, b1, c1, ...
     */
    type: string;

    /**
     * Tells if relic is vaulted.
     */
    isVaulted: boolean;

    /**
     * Purity of relic
     * intact, exceptional, flawless, radiant
     */
    purity: string;

    /**
     * Array of item drops for the relic.
     */
    items: ItemDrop[];

    constructor(fields?: { era: string, type: string, isVaulted: boolean, purity: string, items: ItemDrop[]}) {
        if (fields) {
            this.era = fields.era;
            this.type = fields.type;
            this.isVaulted = fields.isVaulted;
            this.purity = fields.purity;
            this.items = fields.items;
        }
    }

    get name() {
        return this.era + " " + this.type;
    }

    get commonItems() {
        return this.items.filter(item => item.rarity == 0);
    }

    get uncommonItems() {
        return this.items.filter(item => item.rarity == 1);
    }

    get rareItems() {
        return this.items.filter(item => item.rarity == 2);
    }

    static reviver(data) {
        let items: ItemDrop[] = data['items'].map((item) => {
            return ItemDrop.reviver(item);
        });
        return new Relic({
            era: data['era'],
            type: data['type'],
            isVaulted: data['isVaulted'],
            purity: data['purity'],
            items: items
        });
    }
}

export class Item {

    __type = 'Item';
    name: string;
    component: string;
    lastUpdated: Date;
    __prices: {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number};

    constructor(fields?: { name: string, component: string, lastUpdated?: number, prices?: {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}}) {
        if (fields) {
            this.name = fields.name;
            this.component = fields.component;
            this.lastUpdated = fields.lastUpdated == null ? new Date(0) : new Date(fields.lastUpdated);
            this.__prices = fields.prices;
        }
    }

    get urlName() {
        return `${this.name} prime ${this.component}`.replace(/ /g, '_');
    }

    get prices(): {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number} {
        if (this.lastUpdated.getTime() + (1000*60*60*24) < (new Date()).getTime()) {
            getItemPrices(this).then((prices) => {
                this.lastUpdated = new Date();
                this.__prices = prices;
                return this.__prices;
            });
        } else {
            return this.__prices;
        }
    }

    static reviver(data): Item {
        return new Item({
            name: data['name'],
            component: data['component'],
            lastUpdated: data['lastUpdated'],
            prices: data['prices']
        })
    }
}

export class ItemDrop {

    __type = 'ItemDrop';
    name: string;
    rarity: number;
    __dropRarity: string;
    chance: number;

    constructor(fields?: { name: string, rarity: number, dropRarity: string, chance: number}) {
        if (fields) {
            this.name = fields.name;
            this.rarity = fields.rarity;
            this.__dropRarity = fields.dropRarity;
            this.chance = fields.chance;
        }
    }

    static reviver(data): ItemDrop {
        return new ItemDrop({
            name: data['name'],
            rarity: data['rarity'],
            dropRarity: data['__dropRarity'],
            chance: data['chance']
        })
    }
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