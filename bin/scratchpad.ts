import {Relic} from '../relic';

const testRelics: Relic[] = JSON.parse(`[
  {
    "era": "Axi",
    "type": "A1",
    "rating": "Intact",
    "items": [
      {
        "name": "Akstiletto",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fragor",
        "component": "Head",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Dual Kamas",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nikana",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      }
    ]
  },
  {
    "era": "Axi",
    "type": "A2",
    "rating": "Intact",
    "items": [
      {
        "name": "Aklex",
        "component": "Link",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Aklex",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "B1",
    "rating": "Intact",
    "items": [
      {
        "name": "Banshee",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Cernos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Kavasa",
        "component": "Buckle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Euphona",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ash",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "B2",
    "rating": "Intact",
    "items": [
      {
        "name": "Banshee",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Orthos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fragor",
        "component": "Head",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Sybaris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "C1",
    "rating": "Intact",
    "items": [
      {
        "name": "Cernos Lower",
        "component": "Limb",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Orthos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vectis",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "C2",
    "rating": "Intact",
    "items": [
      {
        "name": "Cernos Lower",
        "component": "Limb",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Silva & Aegis",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fragor",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Trinity",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "E1",
    "rating": "Intact",
    "items": [
      {
        "name": "Ember",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Glaive",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Latron",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Sicarus",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Frost",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "E2",
    "rating": "Intact",
    "items": [
      {
        "name": "Euphona",
        "component": "Receiver",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Bronco",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "G1",
    "rating": "Intact",
    "items": [
      {
        "name": "Galatine",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Kavasa Kubrow Collar",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Nekros",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "H1",
    "rating": "Intact",
    "items": [
      {
        "name": "Helios",
        "component": "Cerebrum",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akstiletto",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fragor",
        "component": "Head",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vectis",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "H2",
    "rating": "Intact",
    "items": [
      {
        "name": "Helios",
        "component": "Cerebrum",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Trinity",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Akstiletto",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Oberon",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "K1",
    "rating": "Intact",
    "items": [
      {
        "name": "Kavasa",
        "component": "Buckle",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Odonata",
        "component": "Harness",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Hikou",
        "component": "Pouch",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akstiletto",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "N1",
    "rating": "Intact",
    "items": [
      {
        "name": "Akstiletto",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Odonata",
        "component": "Wings",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ash",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      }
    ]
  },
  {
    "era": "Axi",
    "type": "N2",
    "rating": "Intact",
    "items": [
      {
        "name": "Carrier",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Nikana",
        "component": "Hilt",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Ash",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "N3",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Volt",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Bronco",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Dual Kamas",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "N4",
    "rating": "Intact",
    "items": [
      {
        "name": "Nikana",
        "component": "Hilt",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Hydroid",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fragor",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Cernos Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nekros",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "N5",
    "rating": "Intact",
    "items": [
      {
        "name": "Nami Skyla",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Nekros",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Helios",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Euphona",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Oberon",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "O1",
    "rating": "Intact",
    "items": [
      {
        "name": "Oberon",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akstiletto",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Galatine",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Euphona",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "R1",
    "rating": "Intact",
    "items": [
      {
        "name": "Rhino",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Dakra",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Ankyros",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Boltor",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Mag",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Boar",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "S1",
    "rating": "Intact",
    "items": [
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akbronco",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Scindo",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Trinity",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Axi",
    "type": "T1",
    "rating": "Intact",
    "items": [
      {
        "name": "Tigris",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akstiletto",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Burston",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vectis",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Odonata",
        "component": "Harness",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "V1",
    "rating": "Intact",
    "items": [
      {
        "name": "Odonata",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vauban",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Carrier",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Dual Kamas",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Volt",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Axi",
    "type": "V2",
    "rating": "Intact",
    "items": [
      {
        "name": "Vectis",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Hikou",
        "component": "Pouch",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Mag",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Boar",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Axi",
    "type": "V3",
    "rating": "Intact",
    "items": [
      {
        "name": "Vectis",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Orthos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vasto",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Trinity",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "V4",
    "rating": "Intact",
    "items": [
      {
        "name": "Vectis",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Cernos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Trinity",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Odonata",
        "component": "Harness",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "V5",
    "rating": "Intact",
    "items": [
      {
        "name": "Valkyr",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Braton",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Tigris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Venka",
        "component": "Blades",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Dual Kamas",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Axi",
    "type": "V6",
    "rating": "Intact",
    "items": [
      {
        "name": "Valkyr",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Galatine",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ballistica Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "A1",
    "rating": "Intact",
    "items": [
      {
        "name": "Saryn",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vectis",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akstiletto",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vasto",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "A2",
    "rating": "Intact",
    "items": [
      {
        "name": "Akstiletto",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akbronco",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Cernos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Valkyr",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "B1",
    "rating": "Intact",
    "items": [
      {
        "name": "Boar",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Rhino",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Boltor",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Mag",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ankyros",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "B2",
    "rating": "Intact",
    "items": [
      {
        "name": "Ballistica",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Orthos",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Tigris",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "C1",
    "rating": "Intact",
    "items": [
      {
        "name": "Carrier",
        "component": "Cerebrum",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Kavasa",
        "component": "Band",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nova",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nova",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "F1",
    "rating": "Intact",
    "items": [
      {
        "name": "Scindo",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fragor",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Odonata",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "F2",
    "rating": "Intact",
    "items": [
      {
        "name": "Odonata",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Hikou",
        "component": "Stars",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vauban",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Lith",
    "type": "G1",
    "rating": "Intact",
    "items": [
      {
        "name": "Glaive",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Ember",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Latron",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Frost",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Reaper",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "H1",
    "rating": "Intact",
    "items": [
      {
        "name": "Helios",
        "component": "Cerebrum",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akstiletto",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Nami Skyla",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "K1",
    "rating": "Intact",
    "items": [
      {
        "name": "Kavasa",
        "component": "Buckle",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Tigris",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Odonata",
        "component": "Harness",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "M1",
    "rating": "Intact",
    "items": [
      {
        "name": "Mag",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Soma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Dakra",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Boar",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "N1",
    "rating": "Intact",
    "items": [
      {
        "name": "Nova",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akbronco",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Nekros",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "N2",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Helios",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Kavasa",
        "component": "Band",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Spira",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Carrier",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "N3",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Braton",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Sybaris",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Valkyr",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "S1",
    "rating": "Intact",
    "items": [
      {
        "name": "Paris",
        "component": "Grip",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Spira",
        "component": "Pouch",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Hikou",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "S2",
    "rating": "Intact",
    "items": [
      {
        "name": "Soma",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Carrier",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Akbronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nyx",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Kavasa",
        "component": "Band",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Lith",
    "type": "S3",
    "rating": "Intact",
    "items": [
      {
        "name": "Spira",
        "component": "Pouch",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Ash",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Soma",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akbronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "S4",
    "rating": "Intact",
    "items": [
      {
        "name": "Saryn",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Trinity",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Kavasa Kubrow Collar",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "S5",
    "rating": "Intact",
    "items": [
      {
        "name": "Spira",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akbronco",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Galatine",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "S6",
    "rating": "Intact",
    "items": [
      {
        "name": "Spira",
        "component": "Pouch",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Kavasa",
        "component": "Band",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Valkyr",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Dual Kamas",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "T1",
    "rating": "Intact",
    "items": [
      {
        "name": "Tigris",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Ballistica Upper",
        "component": "Limb",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Valkyr",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akbronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "V1",
    "rating": "Intact",
    "items": [
      {
        "name": "Fragor",
        "component": "Handle",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Volt",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Lith",
    "type": "V2",
    "rating": "Intact",
    "items": [
      {
        "name": "Vauban",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "V3",
    "rating": "Intact",
    "items": [
      {
        "name": "Valkyr",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Tigris",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Helios",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Cernos Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Lith",
    "type": "V4",
    "rating": "Intact",
    "items": [
      {
        "name": "Vauban",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Tigris",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Helios",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Spira",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nekros",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Venka",
        "component": "Blades",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "B1",
    "rating": "Intact",
    "items": [
      {
        "name": "Boar",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Dakra",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Mag",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Orthos",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Orthos",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "C1",
    "rating": "Intact",
    "items": [
      {
        "name": "Carrier",
        "component": "Cerebrum",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Nova",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Scindo",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ash",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Meso",
    "type": "C2",
    "rating": "Intact",
    "items": [
      {
        "name": "Carrier",
        "component": "Cerebrum",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Valkyr",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Odonata",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Cernos Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "C3",
    "rating": "Intact",
    "items": [
      {
        "name": "Cernos Lower",
        "component": "Limb",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Saryn",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Helios",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nami Skyla",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "D1",
    "rating": "Intact",
    "items": [
      {
        "name": "Orthos",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Orthos",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Dual Kamas",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Lex",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "F1",
    "rating": "Intact",
    "items": [
      {
        "name": "Fragor",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Nekros",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Dual Kamas",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Bronco",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "F2",
    "rating": "Intact",
    "items": [
      {
        "name": "Frost",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Reaper",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Latron",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ember",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Sicarus",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "G1",
    "rating": "Intact",
    "items": [
      {
        "name": "Galatine",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Silva & Aegis",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Ballistica",
        "component": "String",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Venka",
        "component": "Blades",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "M1",
    "rating": "Intact",
    "items": [
      {
        "name": "Mag",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Boar",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Rhino",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Dakra",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Boltor",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ankyros",
        "component": "Gauntlet",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "N1",
    "rating": "Intact",
    "items": [
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Nyx",
        "component": "Neuroptics",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Dual Kamas",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Meso",
    "type": "N2",
    "rating": "Intact",
    "items": [
      {
        "name": "Ash",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vauban",
        "component": "Neuroptics",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Hikou",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "N3",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Euphona",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Cerebrum",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Burston",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "N4",
    "rating": "Intact",
    "items": [
      {
        "name": "Nikana",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Oberon",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Orthos",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "N5",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Hydroid",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Tigris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "O1",
    "rating": "Intact",
    "items": [
      {
        "name": "Oberon",
        "component": "Neuroptics",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Akstiletto",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Cernos",
        "component": "String",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akbronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "S1",
    "rating": "Intact",
    "items": [
      {
        "name": "Soma",
        "component": "Stock",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Odonata",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Nova",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Tigris",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "S2",
    "rating": "Intact",
    "items": [
      {
        "name": "Saryn",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Paris",
        "component": "Grip",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "S3",
    "rating": "Intact",
    "items": [
      {
        "name": "Spira",
        "component": "Pouch",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Ash",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Valkyr",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nekros",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Akbronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "S4",
    "rating": "Intact",
    "items": [
      {
        "name": "Saryn",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Banshee",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "S5",
    "rating": "Intact",
    "items": [
      {
        "name": "Sybaris",
        "component": "Barrel",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Saryn",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Burston",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "S6",
    "rating": "Intact",
    "items": [
      {
        "name": "Spira",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Cernos",
        "component": "String",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Tigris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Helios",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Valkyr",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "V1",
    "rating": "Intact",
    "items": [
      {
        "name": "Burston",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Spira",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Carrier",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vectis",
        "component": "Receiver",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Meso",
    "type": "V2",
    "rating": "Intact",
    "items": [
      {
        "name": "Vasto",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ash",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nikana",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Volt",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Meso",
    "type": "V3",
    "rating": "Intact",
    "items": [
      {
        "name": "Valkyr",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Kavasa",
        "component": "Band",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Volt",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Spira",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "V4",
    "rating": "Intact",
    "items": [
      {
        "name": "Vauban",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Valkyr",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Ash",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Meso",
    "type": "V5",
    "rating": "Intact",
    "items": [
      {
        "name": "Venka",
        "component": "Gauntlet",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Euphona",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Silva & Aegis",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Bronco",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Cernos",
        "component": "Grip",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Spira",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "A1",
    "rating": "Intact",
    "items": [
      {
        "name": "Akstiletto",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Cernos",
        "component": "String",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vectis",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "B1",
    "rating": "Intact",
    "items": [
      {
        "name": "Banshee",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Vectis",
        "component": "Stock",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Burston",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Trinity",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "B2",
    "rating": "Intact",
    "items": [
      {
        "name": "Banshee",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Venka",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Tigris",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "B3",
    "rating": "Intact",
    "items": [
      {
        "name": "Boltor",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Mag",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Dakra",
        "component": "Blade",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Boar",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Rhino",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "D1",
    "rating": "Intact",
    "items": [
      {
        "name": "Dakra",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Mag",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Trinity",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vasto",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Boar",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Neo",
    "type": "H1",
    "rating": "Intact",
    "items": [
      {
        "name": "Hydroid",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Banshee",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Tigris",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Orthos",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fragor",
        "component": "Head",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N1",
    "rating": "Intact",
    "items": [
      {
        "name": "Nyx",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Soma",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Kavasa Kubrow Collar",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Hikou",
        "component": "Stars",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vectis",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N2",
    "rating": "Intact",
    "items": [
      {
        "name": "Lex",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Vauban",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Fang",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vasto",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nova",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N3",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Ash",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Odonata",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N4",
    "rating": "Intact",
    "items": [
      {
        "name": "Nikana",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Venka",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ash",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N5",
    "rating": "Intact",
    "items": [
      {
        "name": "Nikana",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Ash",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Akstiletto",
        "component": "Link",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Saryn",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Helios",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N6",
    "rating": "Intact",
    "items": [
      {
        "name": "Nikana",
        "component": "Hilt",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Sybaris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Bronco",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Cernos Upper",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "N7",
    "rating": "Intact",
    "items": [
      {
        "name": "Nekros",
        "component": "Systems",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Banshee",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Valkyr",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Trinity",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Euphona",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Venka",
        "component": "Blades",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S1",
    "rating": "Intact",
    "items": [
      {
        "name": "Saryn",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Trinity",
        "component": "Chassis",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Carrier",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Lex",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Soma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S2",
    "rating": "Intact",
    "items": [
      {
        "name": "Nyx",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Saryn",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Burston",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris Lower",
        "component": "Limb",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nova",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris Upper",
        "component": "Limb",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S3",
    "rating": "Intact",
    "items": [
      {
        "name": "Soma",
        "component": "Barrel",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Vasto",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Spira",
        "component": "Blade",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Carrier",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S5",
    "rating": "Intact",
    "items": [
      {
        "name": "Sicarus",
        "component": "Receiver",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Glaive",
        "component": "Disc",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Frost",
        "component": "Systems",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Latron",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Ember",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Reaper",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S6",
    "rating": "Intact",
    "items": [
      {
        "name": "Silva & Aegis",
        "component": "Guard",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Tigris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Kavasa",
        "component": "Buckle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Burston",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Trinity",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S7",
    "rating": "Intact",
    "items": [
      {
        "name": "Silva & Aegis",
        "component": "Guard",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Sybaris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Ballistica",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Banshee",
        "component": "Neuroptics",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Fang",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Helios",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "S8",
    "rating": "Intact",
    "items": [
      {
        "name": "Spira",
        "component": "Pouch",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Nikana",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fragor",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Hydroid",
        "component": "Chassis",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "T1",
    "rating": "Intact",
    "items": [
      {
        "name": "Tigris",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Banshee",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fragor",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Dual Kamas",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Burston",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "V1",
    "rating": "Intact",
    "items": [
      {
        "name": "Nyx",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Volt",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Dual Kamas",
        "component": "Blueprint",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Nova",
        "component": "Chassis",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      }
    ]
  },
  {
    "era": "Neo",
    "type": "V2",
    "rating": "Intact",
    "items": [
      {
        "name": "Vauban",
        "component": "Blueprint",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Galatine",
        "component": "Handle",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Fang",
        "component": "Handle",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Braton",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "V3",
    "rating": "Intact",
    "items": [
      {
        "name": "Vauban",
        "component": "Neuroptics",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Tigris",
        "component": "Receiver",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Galatine",
        "component": "Blade",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Carrier",
        "component": "Systems",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "V4",
    "rating": "Intact",
    "items": [
      {
        "name": "Venka",
        "component": "Gauntlet",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Saryn",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Ash",
        "component": "Neuroptics",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Cernos",
        "component": "Grip",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Tigris",
        "component": "Stock",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Bronco",
        "component": "Receiver",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  },
  {
    "era": "Neo",
    "type": "V5",
    "rating": "Intact",
    "items": [
      {
        "name": "Vauban",
        "component": "Neuroptics",
        "rarity": 2,
        "__dropRarity": "Rare",
        "chance": 0.02
      },
      {
        "name": "Forma",
        "component": "Blueprint",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Burston",
        "component": "Barrel",
        "rarity": 1,
        "__dropRarity": "Uncommon",
        "chance": 0.11
      },
      {
        "name": "Helios",
        "component": "Carapace",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Paris",
        "component": "String",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      },
      {
        "name": "Silva & Aegis",
        "component": "Hilt",
        "rarity": 0,
        "__dropRarity": "Uncommon",
        "chance": 0.2533
      }
    ]
  }
]`);
