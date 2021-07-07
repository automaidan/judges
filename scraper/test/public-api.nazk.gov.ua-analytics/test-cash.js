/**
 * Created by karinazhdanova on 6/8/17.
 */
const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const cashDeclared = require("./declarations/5e500827-5ad6-4adb-a70f-d053d8832ee2.json").data;

test("public-api.nazk.gov.ua analytics getCash amount check", function(t){
    t.equal(analytics.getCash(cashDeclared),209920);
    t.end();
});


