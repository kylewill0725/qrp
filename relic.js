"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Relic {
    constructor(fields) {
        if (fields) {
            this.era = fields.era;
            this.type = fields.type;
            this.rating = fields.rating;
            this.items = fields.items;
        }
    }
}
exports.Relic = Relic;
class Item {
    constructor(fields) {
        if (fields) {
            this.name = fields.name;
            this.rarity = fields.rarity;
            this.chance = fields.chance;
        }
    }
}
exports.Item = Item;
//# sourceMappingURL=relic.js.map