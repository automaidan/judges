"use strict";
const _ = require("lodash");
const inJudgeModel = require("./input/judge.json");
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

        _judge[outJudgeModel.department] = judge[inJudgeModel.department];
        _judge[outJudgeModel.position] = judge[inJudgeModel.position];
        _judge[outJudgeModel.region] = judge[inJudgeModel.region];
        _judge[outJudgeModel.name] = judge[inJudgeModel.name];
        _judge[outJudgeModel.key] = judge[inJudgeModel.key];
        _judge[outJudgeModel.analytics] = judge[inJudgeModel.analytics];
        _judge[outJudgeModel.stigma] = judge[inJudgeModel.stigma];

        return _.pickBy(_judge, j => j !== undefined);
    }));
};
