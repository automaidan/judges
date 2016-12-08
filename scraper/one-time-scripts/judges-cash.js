const judges = require("../../source/judges.json");
const _ = require("lodash");

console.log(
        _.reduce(judges, (result, judge) => {
            const d2015 = _.first(_.filter(judge.a, {y: 2015}));
            const cash = _.get(d2015, "m") ? _.get(d2015, "m") : 0;
            return result + cash;
        }, 0)
);
