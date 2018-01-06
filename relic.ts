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
    id: string;
    component: string;
    lastUpdated: Date;
    prices: {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number};

    constructor(fields?: { name: string, component: string, id?: string, lastUpdated?: number, prices?: {avg_price: number, low: number, high: number, ducats: number, ducats_per_plat: number}}) {
        if (fields) {
            this.name = fields.name;
            this.component = fields.component;
            this.id = fields.id;
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
            id: data['id'],
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

let item_ids = JSON.parse(`{
  "trinity_prime_systems": {
    "id": "561536a1b66f836f854b966a",
    "ducats": 15
  },
  "akstiletto_prime_barrel": {
    "id": "573b804a0ec44a47787a6916",
    "ducats": 45
  },
  "dual_kamas_prime_handle": {
    "id": "561536e4b66f836f8e15eb18",
    "ducats": 45
  },
  "fragor_prime_head": {
    "id": "573b80280ec44a47787a6913",
    "ducats": 15
  },
  "braton_prime_stock": {
    "id": "54a73e65e779893a797fff35",
    "ducats": 15
  },
  "aklex_prime_link": {
    "id": "588c7923c353473a172364f3",
    "ducats": 100
  },
  "aklex_prime_blueprint": {
    "id": "588bc3bcc353473a172364f2",
    "ducats": 45
  },
  "nikana_prime_blueprint": {
    "id": "56c3bbee5d2f0202da32e940",
    "ducats": 65
  },
  "lex_prime_receiver": {
    "id": "54a73e65e779893a797fff4f",
    "ducats": 15
  },
  "lex_prime_blueprint": {
    "id": "54a73e65e779893a797fff4e",
    "ducats": 25
  },
  "lex_prime_barrel": {
    "id": "54a73e65e779893a797fff4d",
    "ducats": 15
  },
  "akbolto_prime_receiver": {
    "id": "5a311f83c2c9e90dfff475d4"
  },
  "cernos_prime_string": {
    "id": "583580fd2c2ada003badef89",
    "ducats": 45
  },
  "braton_prime_barrel": {
    "id": "54a73e65e779893a797fff32",
    "ducats": 15
  },
  "hydroid_prime_neuroptics": {
    "id": "59a48b625cd9938cfede7039",
    "ducats": 45
  },
  "kavasa_prime_collar_buckle": {
    "id": "56153730b66f836f9488bcce",
    "ducats": 65
  },
  "kogake_prime_boot": {
    "id": "5a311f84c2c9e90dfff475e4"
  },
  "helios_prime_carapace": {
    "id": "58b57068eb26db5c31192116",
    "ducats": 15
  },
  "banshee_prime_systems": {
    "id": "58b57068eb26db5c3119210d",
    "ducats": 100
  },
  "cernos_prime_blueprint": {
    "id": "583580d52c2ada003badef85",
    "ducats": 45
  },
  "euphona_prime_blueprint": {
    "id": "58b57068eb26db5c31192112",
    "ducats": 15
  },
  "sybaris_prime_blueprint": {
    "id": "592dd262011e88f094afec82",
    "ducats": 15
  },
  "fang_prime_blade": {
    "id": "54a73e65e779893a797fff40",
    "ducats": 15
  },
  "ash_prime_chassis": {
    "id": "559daaa7e779897b35d626c6",
    "ducats": 15
  },
  "orthos_prime_blueprint": {
    "id": "54a73e65e779893a797fff51",
    "ducats": 45
  },
  "cernos_prime_lower_limb": {
    "id": "583580e12c2ada003badef86",
    "ducats": 100
  },
  "fragor_prime_handle": {
    "id": "573b80230ec44a47787a6912",
    "ducats": 65
  },
  "vectis_prime_barrel": {
    "id": "559daae0e779897b5273b716",
    "ducats": 15
  },
  "trinity_prime_neuroptics": {
    "id": "56153692b66f836f7d649936",
    "ducats": 25
  },
  "silva_and_aegis_prime_blade": {
    "id": "592dd262011e88f094afec8a",
    "ducats": 45
  },
  "sicarus_prime_blueprint": {
    "id": "54a73e65e779893a797fff5f",
    "ducats": 15
  },
  "glaive_prime_blade": {
    "id": "54a73e65e779893a797fff43",
    "ducats": 45
  },
  "ember_prime_blueprint": {
    "id": "54a73e65e779893a797fff81",
    "ducats": 100
  },
  "latron_prime_barrel": {
    "id": "54a73e65e779893a797fff49",
    "ducats": 15
  },
  "braton_prime_blueprint": {
    "id": "54a73e65e779893a797fff33",
    "ducats": 25
  },
  "euphona_prime_receiver": {
    "id": "58b57068eb26db5c31192111",
    "ducats": 100
  },
  "paris_prime_blueprint": {
    "id": "54a73e65e779893a797fff55",
    "ducats": 15
  },
  "bronco_prime_barrel": {
    "id": "54a73e65e779893a797fff36",
    "ducats": 45
  },
  "frost_prime_neuroptics": {
    "id": "54a73e65e779893a797fff6c",
    "ducats": 15
  },
  "galatine_prime_blueprint": {
    "id": "57bc9c99e506eb45ea25145d",
    "ducats": 100
  },
  "helios_prime_cerebrum": {
    "id": "58b57068eb26db5c31192115",
    "ducats": 100
  },
  "kavasa_prime_collar_blueprint": {
    "id": "56153727b66f836f91a8e849",
    "ducats": 45
  },
  "akstiletto_prime_receiver": {
    "id": "573b804f0ec44a47787a6917",
    "ducats": 45
  },
  "nekros_prime_chassis": {
    "id": "57bc9a40e506eb45ea251452",
    "ducats": 15
  },
  "saryn_prime_systems": {
    "id": "56c3bbe05d2f0202da32e93d",
    "ducats": 15
  },
  "trinity_prime_chassis": {
    "id": "5615369ab66f836f805c5a8b",
    "ducats": 45
  },
  "fang_prime_handle": {
    "id": "54a73e65e779893a797fff42",
    "ducats": 25
  },
  "oberon_prime_chassis": {
    "id": "592dd262011e88f094afec7f",
    "ducats": 15
  },
  "odonata_prime_harness": {
    "id": "5527a279e77989205639861f",
    "ducats": 15
  },
  "hikou_prime_pouch": {
    "id": "54a73e65e779893a797fff47",
    "ducats": 15
  },
  "ash_prime_systems": {
    "id": "559daaafe779897b399db0fd",
    "ducats": 65
  },
  "odonata_prime_wings": {
    "id": "5527a280e779892059574ca9",
    "ducats": 45
  },
  "akstiletto_prime_link": {
    "id": "573b80590ec44a47787a6918",
    "ducats": 45
  },
  "nikana_prime_hilt": {
    "id": "56c3bbf85d2f0202da32e942",
    "ducats": 100
  },
  "carrier_prime_carapace": {
    "id": "559daad1e779897b4be73862",
    "ducats": 15
  },
  "nekros_prime_blueprint": {
    "id": "57bcb14ce506eb45ea25145e",
    "ducats": 100
  },
  "bronco_prime_blueprint": {
    "id": "54a73e65e779893a797fff37",
    "ducats": 15
  },
  "volt_prime_blueprint": {
    "id": "55244820e779890907ef6805",
    "ducats": 45
  },
  "ash_prime_neuroptics": {
    "id": "559daab7e779897b3d86cb8f",
    "ducats": 45
  },
  "paris_prime_upper_limb": {
    "id": "54a73e65e779893a797fff57",
    "ducats": 25
  },
  "galatine_prime_blade": {
    "id": "57bc9c99e506eb45ea25145c",
    "ducats": 15
  },
  "nekros_prime_neuroptics": {
    "id": "57bc9a40e506eb45ea251453",
    "ducats": 45
  },
  "cernos_prime_upper_limb": {
    "id": "583580f42c2ada003badef87",
    "ducats": 15
  },
  "dual_kamas_prime_blueprint": {
    "id": "561536d5b66f836f889b79bb",
    "ducats": 15
  },
  "nami_skyla_prime_blade": {
    "id": "59a5cd4d5cd9938cfede7041",
    "ducats": 100
  },
  "oberon_prime_systems": {
    "id": "592dd262011e88f094afec80",
    "ducats": 100
  },
  "rhino_prime_blueprint": {
    "id": "54a73e65e779893a797fff77",
    "ducats": 100
  },
  "helios_prime_systems": {
    "id": "58b57068eb26db5c31192117",
    "ducats": 45
  },
  "dakra_prime_blueprint": {
    "id": "54a73e65e779893a797fff3e",
    "ducats": 45
  },
  "galatine_prime_handle": {
    "id": "57bc9c99e506eb45ea25145b",
    "ducats": 45
  },
  "ankyros_prime_blade": {
    "id": "54a73e65e779893a797fff24",
    "ducats": 65
  },
  "bronco_prime_receiver": {
    "id": "54a73e65e779893a797fff38",
    "ducats": 15
  },
  "mag_prime_systems": {
    "id": "54a73e65e779893a797fff7b",
    "ducats": 15
  },
  "boar_prime_receiver": {
    "id": "54a73e65e779893a797fff2c",
    "ducats": 15
  },
  "boltor_prime_stock": {
    "id": "54a73e65e779893a797fff31",
    "ducats": 15
  },
  "scindo_prime_blade": {
    "id": "54a73e65e779893a797fff5b",
    "ducats": 100
  },
  "tigris_prime_blueprint": {
    "id": "57bc9c84e506eb45ea251459",
    "ducats": 100
  },
  "akbronco_prime_link": {
    "id": "54a73e65e779893a797fff23",
    "ducats": 45
  },
  "burston_prime_barrel": {
    "id": "54a73e65e779893a797fff39",
    "ducats": 45
  },
  "trinity_prime_blueprint": {
    "id": "56153689b66f836f7a3c0baf",
    "ducats": 45
  },
  "vectis_prime_stock": {
    "id": "559daaf7e779897b5f3f5480",
    "ducats": 65
  },
  "vauban_prime_chassis": {
    "id": "573b7fc20ec44a47787a690e",
    "ducats": 100
  },
  "volt_prime_neuroptics": {
    "id": "55158cd0e7798915e9d64c1e",
    "ducats": 45
  },
  "odonata_prime_systems": {
    "id": "5527a288e77989205f31e525",
    "ducats": 15
  },
  "carrier_prime_systems": {
    "id": "559daad8e779897b4f59525f",
    "ducats": 15
  },
  "boar_prime_barrel": {
    "id": "54a73e65e779893a797fff2a",
    "ducats": 45
  },
  "mag_prime_neuroptics": {
    "id": "54a73e65e779893a797fff6e",
    "ducats": 15
  },
  "valkyr_prime_chassis": {
    "id": "58358a092c2ada0047b386f8",
    "ducats": 100
  },
  "braton_prime_receiver": {
    "id": "54a73e65e779893a797fff34",
    "ducats": 45
  },
  "vasto_prime_barrel": {
    "id": "54a73e65e779893a797fff65",
    "ducats": 15
  },
  "venka_prime_blades": {
    "id": "58358e1c2c2ada00655a4ef6",
    "ducats": 15
  },
  "ballistica_prime_lower_limb": {
    "id": "59a5cd4d5cd9938cfede7044",
    "ducats": 15
  },
  "tigris_prime_receiver": {
    "id": "57bc9c84e506eb45ea251458",
    "ducats": 45
  },
  "venka_prime_gauntlet": {
    "id": "58358e1b2c2ada00655a4ef5",
    "ducats": 100
  },
  "kogake_prime_blueprint": {
    "id": "5a311f84c2c9e90dfff475e5"
  },
  "vectis_prime_blueprint": {
    "id": "559daae8e779897b56bee133",
    "ducats": 45
  },
  "valkyr_prime_blueprint": {
    "id": "583589fd2c2ada0047b386f6",
    "ducats": 15
  },
  "saryn_prime_neuroptics": {
    "id": "56c3bbdb5d2f0202da32e93c",
    "ducats": 45
  },
  "nami_skyla_prime_blueprint": {
    "id": "59a5c2565cd9938cfede703f",
    "ducats": 15
  },
  "silva_and_aegis_prime_blueprint": {
    "id": "592dd262011e88f094afec87",
    "ducats": 45
  },
  "boar_prime_stock": {
    "id": "54a73e65e779893a797fff2d",
    "ducats": 100
  },
  "akstiletto_prime_blueprint": {
    "id": "573b80450ec44a47787a6915",
    "ducats": 100
  },
  "rhino_prime_neuroptics": {
    "id": "54a73e65e779893a797fff6f",
    "ducats": 45
  },
  "vasto_prime_receiver": {
    "id": "54a73e65e779893a797fff67",
    "ducats": 15
  },
  "boltor_prime_receiver": {
    "id": "54a73e65e779893a797fff30",
    "ducats": 45
  },
  "orthos_prime_blade": {
    "id": "54a73e65e779893a797fff50",
    "ducats": 45
  },
  "ankyros_prime_blueprint": {
    "id": "54a73e65e779893a797fff25",
    "ducats": 15
  },
  "tigris_prime_stock": {
    "id": "57bc9c84e506eb45ea251456",
    "ducats": 15
  },
  "paris_prime_lower_limb": {
    "id": "54a73e65e779893a797fff54",
    "ducats": 15
  },
  "ballistica_prime_blueprint": {
    "id": "59a5c2565cd9938cfede703d",
    "ducats": 100
  },
  "nami_skyla_prime_handle": {
    "id": "59a5cd4d5cd9938cfede7042",
    "ducats": 45
  },
  "nova_prime_neuroptics": {
    "id": "54a73e65e779893a797fff68",
    "ducats": 15
  },
  "nova_prime_systems": {
    "id": "54a73e65e779893a797fff6a",
    "ducats": 15
  },
  "kavasa_prime_collar_band": {
    "id": "56153734b66f836f976f5501",
    "ducats": 45
  },
  "carrier_prime_cerebrum": {
    "id": "559daacae779897b47b74c13",
    "ducats": 65
  },
  "fragor_prime_blueprint": {
    "id": "573b801c0ec44a47787a6911",
    "ducats": 65
  },
  "akbolto_prime_barrel": {
    "id": "5a311f85c2c9e90dfff475f7"
  },
  "scindo_prime_blueprint": {
    "id": "54a73e65e779893a797fff5c",
    "ducats": 45
  },
  "hikou_prime_stars": {
    "id": "54a73e65e779893a797fff48",
    "ducats": 15
  },
  "odonata_prime_blueprint": {
    "id": "5527a26de77989205156b2b7",
    "ducats": 45
  },
  "vauban_prime_blueprint": {
    "id": "573b7fbd0ec44a47787a690d",
    "ducats": 100
  },
  "glaive_prime_blueprint": {
    "id": "54a73e65e779893a797fff44",
    "ducats": 100
  },
  "ember_prime_systems": {
    "id": "54a73e65e779893a797fff7a",
    "ducats": 45
  },
  "frost_prime_chassis": {
    "id": "54a73e65e779893a797fff7d",
    "ducats": 15
  },
  "latron_prime_blueprint": {
    "id": "54a73e65e779893a797fff4a",
    "ducats": 15
  },
  "tigris_prime_barrel": {
    "id": "57bc9c84e506eb45ea251457",
    "ducats": 45
  },
  "fang_prime_blueprint": {
    "id": "54a73e65e779893a797fff41",
    "ducats": 15
  },
  "reaper_prime_handle": {
    "id": "54a73e65e779893a797fff5a",
    "ducats": 15
  },
  "burston_prime_stock": {
    "id": "54a73e65e779893a797fff3c",
    "ducats": 15
  },
  "mag_prime_blueprint": {
    "id": "54a73e65e779893a797fff82",
    "ducats": 100
  },
  "nova_prime_chassis": {
    "id": "54a73e65e779893a797fff69",
    "ducats": 100
  },
  "nekros_prime_systems": {
    "id": "57bc9a40e506eb45ea251454",
    "ducats": 100
  },
  "spira_prime_blueprint": {
    "id": "56c3bc025d2f0202da32e944",
    "ducats": 15
  },
  "helios_prime_blueprint": {
    "id": "58b57068eb26db5c31192118",
    "ducats": 45
  },
  "soma_prime_blueprint": {
    "id": "54a73e65e779893a797fff62",
    "ducats": 15
  },
  "spira_prime_pouch": {
    "id": "56c3bc115d2f0202da32e946",
    "ducats": 100
  },
  "burston_prime_receiver": {
    "id": "54a73e65e779893a797fff3b",
    "ducats": 15
  },
  "paris_prime_string": {
    "id": "54a73e65e779893a797fff56",
    "ducats": 15
  },
  "paris_prime_grip": {
    "id": "54a73e65e779893a797fff53",
    "ducats": 45
  },
  "sybaris_prime_stock": {
    "id": "592dd262011e88f094afec83",
    "ducats": 15
  },
  "soma_prime_stock": {
    "id": "54a73e65e779893a797fff64",
    "ducats": 100
  },
  "nyx_prime_blueprint": {
    "id": "54a73e65e779893a797fff72",
    "ducats": 15
  },
  "hikou_prime_blueprint": {
    "id": "54a73e65e779893a797fff46",
    "ducats": 15
  },
  "akbronco_prime_blueprint": {
    "id": "54a73e65e779893a797fff22",
    "ducats": 15
  },
  "ash_prime_blueprint": {
    "id": "559daa9fe779897b3263c2c7",
    "ducats": 45
  },
  "saryn_prime_blueprint": {
    "id": "56c3bbd55d2f0202da32e93b",
    "ducats": 65
  },
  "soma_prime_receiver": {
    "id": "54a73e65e779893a797fff63",
    "ducats": 45
  },
  "spira_prime_blade": {
    "id": "56c3bc0c5d2f0202da32e945",
    "ducats": 100
  },
  "sybaris_prime_barrel": {
    "id": "592dd262011e88f094afec85",
    "ducats": 100
  },
  "valkyr_prime_neuroptics": {
    "id": "58358a062c2ada0047b386f7",
    "ducats": 45
  },
  "akbolto_prime_link": {
    "id": "5a311f84c2c9e90dfff475f3"
  },
  "mirage_prime_chassis": {
    "id": "5a2feeb2c2c9e90cbdaa23d5"
  },
  "burston_prime_blueprint": {
    "id": "54a73e65e779893a797fff3a",
    "ducats": 15
  },
  "volt_prime_systems": {
    "id": "55158ce0e7798915f4c95b78",
    "ducats": 45
  },
  "ballistica_prime_upper_limb": {
    "id": "59a5cd4d5cd9938cfede7043",
    "ducats": 45
  },
  "mag_prime_chassis": {
    "id": "54a73e65e779893a797fff83",
    "ducats": 45
  },
  "dakra_prime_handle": {
    "id": "54a73e65e779893a797fff3f",
    "ducats": 15
  },
  "orthos_prime_handle": {
    "id": "54a73e65e779893a797fff52",
    "ducats": 15
  },
  "valkyr_prime_systems": {
    "id": "58358a0c2c2ada0047b386f9",
    "ducats": 100
  },
  "vauban_prime_systems": {
    "id": "573d0efa336297b2dfca2909",
    "ducats": 100
  },
  "scindo_prime_handle": {
    "id": "54a73e65e779893a797fff5d",
    "ducats": 45
  },
  "frost_prime_blueprint": {
    "id": "54a73e65e779893a797fff80",
    "ducats": 100
  },
  "dual_kamas_prime_blade": {
    "id": "561536deb66f836f8bbaca47",
    "ducats": 100
  },
  "reaper_prime_blade": {
    "id": "54a73e65e779893a797fff58",
    "ducats": 45
  },
  "latron_prime_stock": {
    "id": "54a73e65e779893a797fff4c",
    "ducats": 15
  },
  "ballistica_prime_string": {
    "id": "59a5cd4d5cd9938cfede7045",
    "ducats": 45
  },
  "sicarus_prime_barrel": {
    "id": "54a73e65e779893a797fff5e",
    "ducats": 15
  },
  "mirage_prime_neuroptics": {
    "id": "5a2feeb2c2c9e90cbdaa23d6"
  },
  "oberon_prime_blueprint": {
    "id": "592dd262011e88f094afec7d",
    "ducats": 45
  },
  "ember_prime_chassis": {
    "id": "54a73e65e779893a797fff7e",
    "ducats": 15
  },
  "rhino_prime_chassis": {
    "id": "54a73e65e779893a797fff78",
    "ducats": 65
  },
  "hydroid_prime_chassis": {
    "id": "59a48b625cd9938cfede703a",
    "ducats": 15
  },
  "ankyros_prime_gauntlet": {
    "id": "54a73e65e779893a797fff26",
    "ducats": 15
  },
  "kogake_prime_gauntlet": {
    "id": "5a311f85c2c9e90dfff475f6"
  },
  "boltor_prime_barrel": {
    "id": "54a73e65e779893a797fff2e",
    "ducats": 15
  },
  "hydroid_prime_blueprint": {
    "id": "59a48b625cd9938cfede7038",
    "ducats": 45
  },
  "nikana_prime_blade": {
    "id": "56c3bbf45d2f0202da32e941",
    "ducats": 100
  },
  "vauban_prime_neuroptics": {
    "id": "573b7fc80ec44a47787a690f",
    "ducats": 100
  },
  "euphona_prime_barrel": {
    "id": "58b57068eb26db5c3119210f",
    "ducats": 45
  },
  "nyx_prime_neuroptics": {
    "id": "54a73e65e779893a797fff71",
    "ducats": 100
  },
  "carrier_prime_blueprint": {
    "id": "559daac1e779897b4253a85e",
    "ducats": 15
  },
  "saryn_prime_chassis": {
    "id": "56c3bbe45d2f0202da32e93e",
    "ducats": 100
  },
  "oberon_prime_neuroptics": {
    "id": "592dd262011e88f094afec7e",
    "ducats": 100
  },
  "banshee_prime_neuroptics": {
    "id": "58b57068eb26db5c3119210b",
    "ducats": 15
  },
  "vectis_prime_receiver": {
    "id": "559daaefe779897b5a2d3551",
    "ducats": 100
  },
  "volt_prime_chassis": {
    "id": "55158cd9e7798915ee6bd13f",
    "ducats": 45
  },
  "cernos_prime_grip": {
    "id": "583580fb2c2ada003badef88",
    "ducats": 15
  },
  "banshee_prime_chassis": {
    "id": "58b57068eb26db5c3119210c",
    "ducats": 100
  },
  "venka_prime_blueprint": {
    "id": "58358e192c2ada00655a4ef4",
    "ducats": 45
  },
  "boltor_prime_blueprint": {
    "id": "54a73e65e779893a797fff2f",
    "ducats": 100
  },
  "dakra_prime_blade": {
    "id": "54a73e65e779893a797fff3d",
    "ducats": 65
  },
  "banshee_prime_blueprint": {
    "id": "58b57068eb26db5c3119210a",
    "ducats": 45
  },
  "boar_prime_blueprint": {
    "id": "54a73e65e779893a797fff2b",
    "ducats": 15
  },
  "rhino_prime_systems": {
    "id": "54a73e65e779893a797fff7f",
    "ducats": 15
  },
  "hydroid_prime_systems": {
    "id": "59a48b625cd9938cfede703b",
    "ducats": 100
  },
  "mirage_prime_blueprint": {
    "id": "5a2feeb2c2c9e90cbdaa23d4"
  },
  "sybaris_prime_receiver": {
    "id": "592dd262011e88f094afec84",
    "ducats": 45
  },
  "nyx_prime_chassis": {
    "id": "54a73e65e779893a797fff73",
    "ducats": 100
  },
  "nova_prime_blueprint": {
    "id": "54a73e65e779893a797fff6b",
    "ducats": 45
  },
  "akbolto_prime_blueprint": {
    "id": "5a311f83c2c9e90dfff475d5"
  },
  "nyx_prime_systems": {
    "id": "54a73e65e779893a797fff76",
    "ducats": 45
  },
  "sicarus_prime_receiver": {
    "id": "54a73e65e779893a797fff60",
    "ducats": 100
  },
  "soma_prime_barrel": {
    "id": "54a73e65e779893a797fff61",
    "ducats": 15
  },
  "glaive_prime_disc": {
    "id": "54a73e65e779893a797fff45",
    "ducats": 45
  },
  "vasto_prime_blueprint": {
    "id": "54a73e65e779893a797fff66",
    "ducats": 45
  },
  "reaper_prime_blueprint": {
    "id": "54a73e65e779893a797fff59",
    "ducats": 15
  },
  "silva_and_aegis_prime_guard": {
    "id": "592dd262011e88f094afec88",
    "ducats": 100
  },
  "frost_prime_systems": {
    "id": "54a73e65e779893a797fff79",
    "ducats": 45
  },
  "latron_prime_receiver": {
    "id": "54a73e65e779893a797fff4b",
    "ducats": 15
  },
  "ember_prime_neuroptics": {
    "id": "54a73e65e779893a797fff6d",
    "ducats": 15
  },
  "ballistica_prime_receiver": {
    "id": "59a5cd4d5cd9938cfede7046",
    "ducats": 45
  },
  "mirage_prime_systems": {
    "id": "5a2feeb1c2c9e90cbdaa23d2"
  },
  "silva_and_aegis_prime_hilt": {
    "id": "592dd262011e88f094afec89",
    "ducats": 15
  }
}`);

export function itemIds() {
    return item_ids;
}