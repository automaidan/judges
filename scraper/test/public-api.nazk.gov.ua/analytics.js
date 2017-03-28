const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const oneFlatMultipleTimesDeclared = require("../../../public-api.nazk.gov.ua/582ada10-1bfe-4d7b-9b59-bfd1d92f546d.json");
test("public-api.nazk.gov.ua analytics getFlatAmount check", function (t) {
    t.equal(analytics.getFlatAmount(oneFlatMultipleTimesDeclared), 1);
    t.end();
});

test("public-api.nazk.gov.ua analytics getFamilyFlatAmount check", function (t) {
    t.equal(analytics.getFamilyFlatAmount(oneFlatMultipleTimesDeclared), 1);
    t.end();
});

test("public-api.nazk.gov.ua analytics getFamilyFlatArea check", function (t) {
    t.equal(analytics.getFamilyFlatArea(oneFlatMultipleTimesDeclared), 108);
    t.end();
});

