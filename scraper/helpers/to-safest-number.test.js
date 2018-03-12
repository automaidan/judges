const test = require('tape');
const toSafestNumber = require('./to-safest-number');

test('helpers to-safest-number check', function (t) {
  t.equal(toSafestNumber(), undefined);
  t.equal(toSafestNumber(','), undefined);
  t.equal(toSafestNumber('.'), undefined);
  t.equal(toSafestNumber('fsdf'), undefined);
  t.equal(toSafestNumber('-2'), -2);
  t.equal(toSafestNumber('222.222'), 222.22);
  t.equal(toSafestNumber('222,555'), 222.56);
  t.equal(toSafestNumber('1'), 1);
  t.equal(toSafestNumber(1), 1);
  t.end();
});
