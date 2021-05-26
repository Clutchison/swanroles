const Pool = require('pg').Pool;

const pool = new Pool(
    process.env.NODE_ENV === 'production' ?
        {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        } :
        {
            user: 'postgres',
            host: 'localhost',
            database: process.env.SWANROLES_DB,
            password: process.env.SWANROLES_PW, 
            port: 5432,
        });

const query = (query, args) => new Promise((resolve, reject) =>
    pool.query(query, args)
        .then(results => resolve(results))
        .catch(error => reject(error)));

const mapper = mapping => object => {
    const newObj = {};
    if (!object) return newObj;
    for (var key of Object.keys(mapping)) {
        const newKey = mapping[key];
        newObj[newKey] = object[key];
    }
    return newObj;
};

const getOne = mapping => results => mapper(mapping)(results.rows[0]);

const getAll = mapping => results => results.rows.map(obj => mapper(mapping)(obj));

module.exports = {
    query,
    getOne,
    getAll,
};