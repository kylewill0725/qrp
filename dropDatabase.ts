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
        const getEraIdQuery = `SELECT * FROM public."RelicEras" WHERE name = $1`;
        const insertEraQuery = `INSERT INTO public."RelicEras"(name) VALUES($1) RETURNING id`;
        let eraId = await insertIfNone(client, [relic.era], getEraIdQuery, insertEraQuery)['id'];
//    Get typeid
        const getTypeIdQuery = `SELECT * FROM public."RelicTypes" WHERE name = $1`;
        const insertTypeQuery = `INSERT INTO public."RelicEras"(name) VALUES($1) RETURNING id`;
        let typeId = await insertIfNone(client, [relic.type], getTypeIdQuery, insertTypeQuery)['id'];
//    Get ratingid
//    Get droptypeid
//    Get itemid
//    Make new relicdropinfo
//    Make new relic
    };

    let insertIfNone = async (client: IDatabase<any>, values: any[], selectQuery: string, insertQuery: string) => {
        let result;
        try {
            result = await client.one({
                text: selectQuery,
                values: values
            });
        } catch(err) {
            try {
                result = await client.one({
                    text: insertQuery,
                    values: values
                });
            } catch (err) {
                console.log(err);
            }
        }
        return result || false;
    }
}