"use strict";
const _ = require("lodash");
const personModel = require("./input/person.json");
const outJudgeModel = require("./output/judge.json");

/**
 *
 * @param {Array} judges
 * @returns {Promise<Array>}
 */
module.exports = function rePackJudges(judges) {
    console.log('Repack judges according to outJudgeModel');
    return Promise.resolve(_.map(judges, function (judge) {
        let _judge = {};

        _judge[outJudgeModel.type] = judge.type;
        _judge[outJudgeModel.department] = judge[personModel.department];
        _judge[outJudgeModel.position] = judge[personModel.position];
        _judge[outJudgeModel.region] = judge[personModel.region];
        _judge[outJudgeModel.name] = judge[personModel.name];
        _judge[outJudgeModel.key] = judge[personModel.key];
        _judge[outJudgeModel.analytics] = judge[personModel.analytics];
        _judge[outJudgeModel.stigma] = judge[personModel.stigma];

        return _.pickBy(_judge, j => j !== undefined);
    }));
};
