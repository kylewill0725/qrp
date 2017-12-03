export class Relic {
    era: string;
    type: string;
    rating: string;
    items: ItemDrop[];

    constructor(fields?: { era: string, type: string, rating: string, items: ItemDrop[]}) {
        if (fields) {
            this.era = fields.era;
            this.type = fields.type;
            this.rating = fields.rating;
            this.items = fields.items;
        }
    }
}

export class ItemDrop {
    name: string;
    component: string;
    rarity: string;
    __dropRarity: string;
    chance: number;

    constructor(fields?: { name: string, component: string, rarity: string, dropRarity: string, chance: number}) {
        if (fields) {
            this.name = fields.name;
            this.component = fields.component;
            this.rarity = fields.rarity;
            this.__dropRarity = fields.dropRarity;
            this.chance = fields.chance;
        }
    }
}