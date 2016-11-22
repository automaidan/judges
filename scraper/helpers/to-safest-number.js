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


// console.log(toSafestNumber())
// console.log(toSafestNumber("."))
// console.log(toSafestNumber(","))
// console.log(toSafestNumber("1"))
// console.log(toSafestNumber("222.222"))
// console.log(toSafestNumber("222,555"))
// console.log(toSafestNumber("fds"))
// console.log(toSafestNumber("-2"))
