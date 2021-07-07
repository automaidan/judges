/**
 * Created by karinazhdanova on 6/3/17.
 */
const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const landDeclared = require("./declarations/582ada10-1bfe-4d7b-9b59-bfd1d92f546d.json").data;

test("public-api.nazk.gov.ua analytics getLandAmount check", function(t){
    t.equal(analytics.getLandAmount(landDeclared),1);
    t.end();
});

test("public-api.nazk.gov.ua analytics getLandArea check", function(t){
    t.equal(analytics.getLandArea(landDeclared),1000);
    t.end();
});

