const nconf = require("nconf");
const config = nconf
    .use('memory')
    .argv()
    .env()
    .defaults(require("./config.default.json"));

config.set("READ_CACHE", config.get("READ_CACHE") === true || config.get("READ_CACHE") === "true");
config.set("SCRAPPER_SPEED", parseInt(config.get("SCRAPPER_SPEED"), 10));
config.set("PERSONS_LIMIT", parseInt(config.get("PERSONS_LIMIT"), 10));

module.exports = config;
