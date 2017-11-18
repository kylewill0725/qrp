class Relic {
    era: String;
    type: String;
    rating: String;
    items: Item[];

    constructor() {}
}

class Item {
    name: String;
    rarity: String;
    chance: number;
}