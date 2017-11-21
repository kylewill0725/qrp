import {Pool, Client} from 'pg';
import * as pgpromise from 'pg-promise';
import {IMain, IDatabase} from 'pg-promise';
import {Relic, Item} from './relic';

export namespace Database {
    const REMOTE_ADDR = 'jdbc:postgresql://postgres:qwer@qwyll.ddns.net:10000/postgres';
    let client;

    export let init = () => {
        console.log('Starting');

        const client = new Client({
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

        const pgp: IMain = pgpromise();

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
        addItem(db, new Relic({
            era: 'Meso',
            type: 'V1',
            rating: 'Intact',
            items: [
                new Item({name: 'Foo', rarity: 'Common', chance: 0.01}),
                new Item({name: 'Bar', rarity: 'Common', chance: 0.05})
            ]
        }));
    };

    export let cleanup = () => {

    };

    // export let addItem = (relic: Relic) => {
    export let addItem = async (client: IDatabase<any>, relic: Relic) => {
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
                console.log("Inserted: "+relic.era);
            }).catch(err => {
                console.log(err);
            })
        })
//    Get typeid
//    Get ratingid
//    Get droptypeid
//    Get itemid
//    Make new relicdropinfo
//    Make new relic
    };
}