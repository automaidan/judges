"use strict";
const _ = require("lodash");
const personModel = require("./input/person.json");
const outJudgeModel = require("./output/judge.json");

/**
 *
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function rePackJudges(persons) {
    console.log('Repack persons according to outJudgeModel');
    return Promise.resolve(_.map(persons, function (person) {
        let _person = {};

        _person[outJudgeModel.type] = person.type;
        _person[outJudgeModel.department] = person[personModel.department];
        _person[outJudgeModel.position] = person[personModel.position];
        _person[outJudgeModel.region] = person[personModel.region];
        _person[outJudgeModel.name] = person[personModel.name];
        _person[outJudgeModel.key] = person[personModel.key];
        _person[outJudgeModel.analytics] = person[personModel.analytics];
        _person[outJudgeModel.stigma] = person[personModel.stigma];

        return _.pickBy(_person, j => j !== undefined);
    }));
};
