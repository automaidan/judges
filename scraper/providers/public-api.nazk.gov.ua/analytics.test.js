const test = require('tape');
const analytics = require('./analytics');

const oneFlatMultipleTimesDeclared = require('./examples/582ada10-1bfe-4d7b-9b59-bfd1d92f546d.json').data;

test('public-api.nazk.gov.ua analytics getFlatAmount check', (t) => {
  t.equal(analytics.getFlatAmount(oneFlatMultipleTimesDeclared), 0);
  t.end();
});

test('public-api.nazk.gov.ua analytics getFamilyFlatAmount check', (t) => {
  t.equal(analytics.getFamilyFlatAmount(oneFlatMultipleTimesDeclared), 1);
  t.end();
});

test('public-api.nazk.gov.ua analytics getFamilyFlatArea check', (t) => {
  t.equal(analytics.getFamilyFlatArea(oneFlatMultipleTimesDeclared), 108);
  t.end();
});

