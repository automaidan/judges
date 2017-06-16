const nconf = require("nconf");
const config = nconf
    .argv()
    .defaults(require("./config.default.json"));

config.set(config.get("LOCAL_JUDGES_JSON") === true || config.get("LOCAL_JUDGES_JSON") === "true");
config.set(parseInt(config.get("SCRAPPER_SPEED"), 10));
config.set(parseInt(config.get("PERSONS_LIMIT"), 10));

module.exports = config;
