const test = require("tape");
const analytics = require("../../providers/public-api.nazk.gov.ua/analytics");

const oneFlatMultipleTimesDeclared = require("./declarations/5e500827-5ad6-4adb-a70f-d053d8832ee2.json").data;
test("public-api.nazk.gov.ua analytics getFlatAmount check", function (t) {
    t.equal(analytics.getFlatAmount(oneFlatMultipleTimesDeclared), 1);
    t.end();
});

test("public-api.nazk.gov.ua analytics getFamilyFlatAmount check", function (t) {
    t.equal(analytics.getFamilyFlatAmount(oneFlatMultipleTimesDeclared), 2);
    t.end();
});

test("public-api.nazk.gov.ua analytics getFamilyFlatArea check", function (t) {
    t.equal(analytics.getFamilyFlatArea(oneFlatMultipleTimesDeclared), 74.5);
    t.end();
});

test("public-api.nazk.gov.ua analytics getFamilyFlatArea check", function (t) {
    t.isNotEqual(analytics.getFamilyFlatArea(oneFlatMultipleTimesDeclared),analytics.getFlatArea(oneFlatMultipleTimesDeclared), "flat area should be different");
    t.end();
});
