/**
 * Created by karinazhdanova on 6/1/17.
 */
const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const vehicleDeclared = require("./declarations/582ada10-1bfe-4d7b-9b59-bfd1d92f546d.json").data;
test("public-api.nazk.gov.ua analytics getCarAmount check", function(t){
    t.equal(analytics.getCarAmount(vehicleDeclared),1);
    t.end();

});

test("public-api.nazk.gov.ua analytics getFamilyCarAmount check", function(t){
   t.equal(analytics.getFamilyCarAmount(vehicleDeclared),1);
   t.end();
});



