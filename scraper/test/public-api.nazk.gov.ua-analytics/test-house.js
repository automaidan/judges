/**
 * Created by karinazhdanova on 6/3/17.
 */
const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const houseDeclared = require("./declarations/582ada10-1bfe-4d7b-9b59-bfd1d92f546d.json").data;

test("public-api.nazk.gov.ua analytics getHouseAmount check", function(t){
    t.equal(analytics.getHouseAmount(houseDeclared),0);
    t.end();

});

test("public-api.nazk.gov.ua analytics getHouseAmount check", function(t){
    t.equal(analytics.getHouseArea(houseDeclared),0);
    t.end();
});

test("public-api.nazk.gov.ua analytics getHouseAmount check", function(t){
    t.equal(analytics.getFamilyHouseAmount(houseDeclared),0);
    t.end();
});
