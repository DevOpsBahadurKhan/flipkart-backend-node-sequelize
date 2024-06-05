const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';

let dbConfig;

switch (env) {
    case 'production':
        dbConfig = config.production;
        break;
    case 'test':
        dbConfig = config.test;
        break;
    case 'dev':
    default:
        dbConfig = config.development;
}

module.exports = dbConfig;
