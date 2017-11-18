let pg = require('knex')({
    client: 'pg',
    version: '10.1',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'qwer',
        database: 'public'
    }
});

let start = () => {

};

let stop = () => {

};

let addItem = (relic: Relic) => {
//    Get eraid

//    Get typeid
//    Get ratingid
//    Get droptypeid
//    Get itemid
//    Make new relicdropinfo
//    Make new relic
};