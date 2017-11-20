import {Pool, Client} from 'pg';
import * as util from "util";

export namespace Database {
    const REMOTE_ADDR = 'jdbc:postgresql://qwyll.ddns.net:10000/postgres';
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
        addItem(client);
    };

    export let cleanup = () => {

    };

    // export let addItem = (relic: Relic) => {
    export let addItem = (client) => {
//    Get eraid
        let next = (err, res) => {};
        const getEraIdsQuery = `SELECT * FROM public."RelicEras"`;
        client.query(getEraIdsQuery, next);
        next = (err, res) => {
            console.log("Result: " + res);
            client.end();
        }
//    Get typeid
//    Get ratingid
//    Get droptypeid
//    Get itemid
//    Make new relicdropinfo
//    Make new relic
    };
}