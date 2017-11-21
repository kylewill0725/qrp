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
const pg_1 = require("pg");
const pgpromise = require("pg-promise");
const relic_1 = require("./relic");
var Database;
(function (Database) {
    const REMOTE_ADDR = 'jdbc:postgresql://postgres:qwer@qwyll.ddns.net:10000/postgres';
    let client;
    Database.init = () => {
        console.log('Starting');
        const client = new pg_1.Client({
            user: 'postgres',
            password: 'qwer',
            host: 'qwyll.ddns.net',
            port: '10000',
            database: 'postgres'
        });
        const cn = {
            user: 'postgres',
            password: 'qwer',
            host: 'qwyll.ddns.net',
            port: 10000,
            database: 'postgres'
        };
        const pgp = pgpromise();
        const db = pgp(cn);
        client.connect();
        // const createTableQuery = ""+
        //         "CREATE TABLE grr (" +
        //             "id SERIAL PRIMARY KEY,"+
        //             "text VARCHAR(40) not null," +
        //             "complete BOOLEAN" +
        //         ");";
        const getEraIdsQuery = `SELECT * FROM public."RelicEras"`;
        // client.query(getEraIdsQuery, (err, res) => {
        //     console.log("Test: " + err + " : " + res);
        //     client.end();
        // });
        Database.addItem(db, new relic_1.Relic({
            era: 'Meso',
            type: 'V1',
            rating: 'Intact',
            items: [
                new relic_1.Item({ name: 'Foo', rarity: 'Common', chance: 0.01 }),
                new relic_1.Item({ name: 'Bar', rarity: 'Common', chance: 0.05 })
            ]
        }));
    };
    Database.cleanup = () => {
    };
    // export let addItem = (relic: Relic) => {
    Database.addItem = (client, relic) => __awaiter(this, void 0, void 0, function* () {
        //    Get eraid
        const getEraIdsQuery = `SELECT * FROM public."RelicEras"`;
        client.one({
            text: 'SELECT * FROM public."RelicEras" WHERE name = $1',
            values: [relic.era]
        }).then(era => {
            console.log(era);
        }).catch(err => {
            console.log(err);
            client.none({
                text: 'INSERT INTO RelicEras(name) VALUES($1)',
                values: [relic.era]
            }).then(() => {
                console.log("Inserted: " + relic.era);
            }).catch(err => {
                console.log(err);
            });
        });
        //    Get typeid
        //    Get ratingid
        //    Get droptypeid
        //    Get itemid
        //    Make new relicdropinfo
        //    Make new relic
    });
})(Database = exports.Database || (exports.Database = {}));
//# sourceMappingURL=dropDatabase.js.map