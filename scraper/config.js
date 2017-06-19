const nconf = require("nconf");
const config = nconf
    .use('memory')
    .argv()
    .env()
    .defaults(require("./config.default.json"));

config.set("LOCAL_JUDGES_JSON", config.get("LOCAL_JUDGES_JSON") === true || config.get("LOCAL_JUDGES_JSON") === "true");
config.set("SCRAPPER_SPEED", parseInt(config.get("SCRAPPER_SPEED"), 10));
config.set("PERSONS_LIMIT", parseInt(config.get("PERSONS_LIMIT"), 10));

module.exports = config;
