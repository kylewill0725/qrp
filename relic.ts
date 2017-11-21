export class Relic {
    era: String;
    type: String;
    rating: String;
    items: Item[];

    constructor(fields?: { era: string, type: string, rating: string, items: Item[]}) {
        if (fields) {
            this.era = fields.era;
            this.type = fields.type;
            this.rating = fields.rating;
            this.items = fields.items;
        }
    }
}

export class Item {
    name: String;
    rarity: String;
    chance: number;
    constructor(fields?: { name: string, rarity: string, chance: number}) {
        if (fields) {
            this.name = fields.name;
            this.rarity = fields.rarity;
            this.chance = fields.chance;
        }
    }
}