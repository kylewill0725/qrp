// import {Pool, Client} from 'pg';
// import * as pgpromise from 'pg-promise';
// import {IMain, IDatabase} from 'pg-promise';
// import {Relic, Item} from './relic';
//
// export namespace Database {
//     const REMOTE_ADDR = 'jdbc:postgresql://postgres:qwer@qwyll.ddns.net:10000/postgres';
//     let client;
//
//     export let init = () => {
//         console.log('Starting');
//
//         const client = new Client({
//             user: 'postgres',
//             password: 'qwer',
//             host: 'qwyll.ddns.net',
//             port: '10000',
//             database: 'postgres'
//         });
//
//         const cn = {
//             user: 'postgres',
//             password: 'qwer',
//             host: 'qwyll.ddns.net',
//             port: 10000,
//             database: 'postgres'
//         };
//
//         const pgp: IMain = pgpromise();
//
//         const db = pgp(cn);
//
//         client.connect();
//         // const createTableQuery = ""+
//         //         "CREATE TABLE grr (" +
//         //             "id SERIAL PRIMARY KEY,"+
//         //             "text VARCHAR(40) not null," +
//         //             "complete BOOLEAN" +
//         //         ");";
//
//         const getEraIdsQuery = `SELECT * FROM public."RelicEras"`;
//
//         // client.query(getEraIdsQuery, (err, res) => {
//         //     console.log("Test: " + err + " : " + res);
//         //     client.end();
//         // });
//         addItem(db, new Relic({
//             era: 'Meso',
//             type: 'V1',
//             rating: 'Intact',
//             items: [
//                 new Item({name: 'Foo', rarity: 'Common', chance: 0.01}),
//                 new Item({name: 'Bar', rarity: 'Common', chance: 0.05})
//             ]
//         }));
//     };
//
//     export let cleanup = () => {
//
//     };
//
//     // export let addItem = (relic: Relic) => {
//     export let addItem = async (client: IDatabase<any>, relic: Relic) => {
// //    Get eraid
//         const getEraIdQuery = `SELECT * FROM public."RelicEras" WHERE name = $1`;
//         const insertEraQuery = `INSERT INTO public."RelicEras"(name) VALUES($1) RETURNING id`;
//         let eraId = insertIfNone(client, [relic.era], getEraIdQuery, insertEraQuery)['id'];
// //    Get typeid
//         const getTypeIdQuery = `SELECT * FROM public."RelicTypes" WHERE name = $1`;
//         const insertTypeQuery = `INSERT INTO public."RelicTypes"(name) VALUES($1) RETURNING id`;
//         let typeId = insertIfNone(client, [relic.type], getTypeIdQuery, insertTypeQuery)['id'];
// //    Get ratingid
//         const getRatingIdQuery = `SELECT * FROM public."RelicRatings" WHERE name = $1`;
//         const insertRatingQuery = `INSERT INTO public."RelicRatings"(name) VALUES($1) RETURNING id`;
//         let ratingId = insertIfNone(client, [relic.rating], getTypeIdQuery, insertTypeQuery)['id'];
// //    Get droptypeid
//         const getDropTypeIdQuery = `SELECT * FROM public."RelicDropTypes" WHERE name = $1`;
//         const insertDropTypeQuery = `INSERT INTO public."RelicDropTypes"(name) VALUES($1) RETURNING id`;
//         let dropTypeId = insertIfNone(client, ["Relic"], getTypeIdQuery, insertTypeQuery)['id'];
// //    Get itemid
//         const getItemIdQuery = `SELECT * FROM public."Items" WHERE name = $1`;
//         const insertItemQuery = `INSERT INTO public."Items"(name) VALUES($1) RETURNING id`;
//         let itemIds = [];
//         for (let i in relic.items) {
//              itemIds.push([insertIfNone(client, [relic.items[i].name], getTypeIdQuery, insertTypeQuery)['id'], relic.items[i].chance]);
//         }
// //    Make new relic
//         const getRelicIdQuery = `SELECT * FROM public."Relics" WHERE eraid = $1 and typeid = $2`;
//         const insertRelicQuery = `INSERT INTO public."Relics"(eraid, typeid, ratingid, droptypeid) VALUES($1, $2, $3, $4)`;
//         let relicId = await insertIfNone(client, [eraId, typeId, ratingId, dropTypeId], getRelicIdQuery, insertRelicQuery);
// //    Make new relicdropinfo
//         const insertRelicDropInfoQuery = `INSERT INTO public."RelicDropInfo"(relicId, itemid, chance) VALUES($1, $2, $3)`;
//         for (let i in itemIds) {
//             await client.none({
//                 text: insertRelicDropInfoQuery,
//                 values: [relicId, i, 0.5]
//             });
//         }
//         console.log('done');
//     };
//
//     let insertIfNone = async (client: IDatabase<any>, values: any[], selectQuery: string, insertQuery: string) : Promise<any> => {
//         return new Promise<any>(async (resolve, reject) => {
//             let result;
//             try {
//                 result = await client.one({
//                     text: selectQuery,
//                     values: values
//                 });
//             } catch(err) {
//                 try {
//                     result = await client.one({
//                         text: insertQuery,
//                         values: values
//                     });
//                 } catch (err) {
//                     console.log(err);
//                 }
//             }
//             if (result) {
//                 resolve(result);
//             } else {
//                 reject();
//             }
//         });
//     }
// }