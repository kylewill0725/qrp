export class Relic {
    static purities = {
        'intact': [0.2533, 0.11, 0.02],
        'exceptional': [0.2333, 0.13, 0.04],
        'flawless': [0.2, 0.17, 0.06],
        'radiant': [0.1667, 0.2, 0.1]
    };

    __type = 'Relic';
    era: string;
    type: string;
    purity: string;
    items: ItemDrop[];

    constructor(fields?: { era: string, type: string, purity: string, items: ItemDrop[]}) {
        if (fields) {
            this.era = fields.era;
            this.type = fields.type;
            this.purity = fields.purity;
            this.items = fields.items;
        }
    }

    static reviver(data) {
        let items: ItemDrop[] = data['items'].map((item) => {
            return ItemDrop.reviver(item);
        });
        return new Relic({
            era: data['era'],
            type: data['type'],
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
    prices: {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number};

    constructor(fields?: { name: string, component: string, lastUpdated?: number, prices?: {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}}) {
        if (fields) {
            this.name = fields.name;
            this.component = fields.component;
            this.lastUpdated = fields.lastUpdated == null ? new Date(0) : new Date(fields.lastUpdated);
            this.prices = fields.prices;
        }
    }

    get urlName() {
        return `${this.name} prime ${this.component}`.replace(/ /g, '_');
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
    rarity: string;
    __dropRarity: string;
    chance: number;

    constructor(fields?: { name: string, rarity: string, dropRarity: string, chance: number}) {
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