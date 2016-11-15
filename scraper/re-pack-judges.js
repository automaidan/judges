"use strict";
let fetch = require('node-fetch');
let Promise = require('bluebird');
let _ = require("lodash");

const input = require("./input/index");
const output = require("./output/index");
const inJudgeModel = require("./input/judge.json");
const outJudgeModel = require("./output/judge.json");

module.exports = function scrapDeclarations(judges) {
    console.log('searchTheirDeclarations');
    return _.map(judges, function (judge) {
        var _judge = {};

        _judge[outJudgeModel.department] = judge[inJudgeModel.department];
        _judge[outJudgeModel.position] = judge[inJudgeModel.position];
        _judge[outJudgeModel.region] = judge[inJudgeModel.region];
        _judge[outJudgeModel.name] = judge[inJudgeModel.name];
        _judge[outJudgeModel.key] = judge[inJudgeModel.key];
        _judge[outJudgeModel.analytics] = judge[inJudgeModel.analytics];
        _judge[outJudgeModel.stigma] = judge[inJudgeModel.stigma];

        return _.pickBy(_judge, j => j !== undefined);
    });
};
