"use strict";
let _ = require("lodash");

module.exports = function howManyPhoto(judges) {
    const stat = _.countBy(judges, function (judge) {
        return !!judge['Фото'];
    });

    console.log(`${stat[true]} judges has photo and ${stat[false]} judges doesn't.`)

    return judges;
};
