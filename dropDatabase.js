"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
var Database;
(function (Database) {
    const REMOTE_ADDR = 'jdbc:postgresql://qwyll.ddns.net:10000/postgres';
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
        Database.addItem(client);
    };
    Database.cleanup = () => {
    };
    // export let addItem = (relic: Relic) => {
    Database.addItem = (client) => {
        //    Get eraid
        let next = (err, res) => { };
        const getEraIdsQuery = `SELECT * FROM public."RelicEras"`;
        client.query(getEraIdsQuery, next);
        next = (err, res) => {
            console.log("Result: " + res);
            client.end();
        };
        //    Get typeid
        //    Get ratingid
        //    Get droptypeid
        //    Get itemid
        //    Make new relicdropinfo
        //    Make new relic
    };
})(Database = exports.Database || (exports.Database = {}));
//# sourceMappingURL=dropDatabase.js.map