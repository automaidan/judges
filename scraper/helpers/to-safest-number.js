"use strict";
const _ = require("lodash");
module.exports = function toSafestNumber(string) {
    return _.chain(string)
        .replace(",", ".")
        .thru(s => parseFloat(s))
        .thru(s => {
            if (!_.isNaN(s)) {
                return _.round(s, 2);
            }
        })
        .value();
};


// console.log(module.exports())
// console.log(module.exports("."))
// console.log(module.exports(","))
// console.log(module.exports("1"))
// console.log(module.exports("222.222"))
// console.log(module.exports("222,555"))
// console.log(module.exports("fds"))
// console.log(module.exports("-2"))
