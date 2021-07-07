/**
 * Created by karinazhdanova on 6/5/17.
 */
const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const incomeDeclared = require("./declarations/582ada10-1bfe-4d7b-9b59-bfd1d92f546d.json").data;

test("public-api.nazk.gov.ua analytics getIncome check", function(t){
    t.equal(analytics.getIncome(incomeDeclared),253431);
    t.end();
});

test("public-api.nazk.gov.ua analytics getFamilyIncome check", function(t){
    t.equal(analytics.getFamilyIncome(incomeDeclared),328247);
    t.end();
});

