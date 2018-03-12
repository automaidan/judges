// This is workaround for making git happy.
// The problem is – git "highlight" changes, where they don't,
// just because declarations.com.ua time to time change object_list keys order without making any changes to data.
module.exports = function makeObjectKeysBeSorted(o) {
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}
