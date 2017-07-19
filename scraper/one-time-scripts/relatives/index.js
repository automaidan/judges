'use strict';
require('../../helpers/detect-debug');
const remoteCSVtoJSON = require('../../helpers/remote-csv-to-json');
const Promise = require('bluebird');
const _ = require('lodash');
const json2csv = require('json2csv');
const writeFile = Promise.promisify(require('fs').writeFile);
const nazk = require('../../providers/public-api.nazk.gov.ua/crawler');
const csvGoogleSheetsLinkToFilteredJudgesNames = 'https://docs.google.com/spreadsheets/d/171hH5f8VOieYG0mr0bCMGNn_8hYPRVYZNuX1TmoODrU/pub?gid=101304854&single=true&output=csv';
const COLUMNS = [
  '№ з/п',
  'Прізвище, ім’я, по батькові кандидата',
  'Найменування суду',
  'Посада',
  'Місце роботи/останнє місце роботи',
  'Область',
  'Родичі, вказані у декларації',
  'Співвласники чи власники, вказані у декларації'
];
const j = {
  id: '№ з/п',
  name: 'Прізвище, ім’я, по батькові кандидата',
  relatives: 'Родичі, вказані у декларації',
  coowners: 'Співвласники чи власники, вказані у декларації'
};

function getRelatives(declarations) {
  return _.reduce(declarations, function (Result, declaration) {
    let relatives = _.reduce(_.values(_.get(declaration, 'step_2')), function (result, relative) {
      let integralRelative = `${relative.subjectRelation} ${relative.lastname} ${relative.firstname} ${relative.middlename}`;

      if (integralRelative !== 'undefined undefined undefined undefined') {
        result.push(integralRelative);
      }

      return result;
    }, []);

    Result = _.concat(Result, relatives);
    Result = _.uniq(Result);

    return Result;
  }, []).toString();
}

function setRelatives(judges, id, relatives) {
  _.find(judges, {
    [j.id]: id
  })[j.relatives] = relatives;
}

function getStepCoowners(declaration, step) {
  return _.reduce(_.values(_.get(declaration, step)), function (result, belonging) {

    let coownersOfOneBelonging = _.map(_.values(_.get(belonging, 'rights')), function (coowner) {
      return `${coowner.ua_lastname} ${coowner.ua_firstname} ${coowner.ua_middlename}`;
    });

    result = _.concat(result, coownersOfOneBelonging);

    return result;
  }, []);
}

function getCoowners(declarations) {
  return _.reduce(declarations, function (Result, declaration) {
    Result = _.concat(Result,
      getStepCoowners(declaration, 'step_3'),
      getStepCoowners(declaration, 'step_4'),
      getStepCoowners(declaration, 'step_5'),
      getStepCoowners(declaration, 'step_6'),
      getStepCoowners(declaration, 'step_7'),
      getStepCoowners(declaration, 'step_8'),
      getStepCoowners(declaration, 'step_9'),
      getStepCoowners(declaration, 'step_10'),
      getStepCoowners(declaration, 'step_11')
    );

    Result = _.uniq(Result);

    return Result;
  }, []).toString();
}

function setCoowners(judges, id, coowners) {
  _.find(judges, {
    [j.id]: id
  })[j.coowners] = coowners;
}

function log(i, max) {
  if (i % 100 === 0) {
    console.log(`Scraped ${parseInt(i / max * 100, 10)}% of all judges.`)
  }
}

function findTheirDeclarations(judges) {
  let i = 0;

  return [

    judges,

    Promise.map(judges, judge => {
      log(i++, judges.length);
      return nazk({Name: judge[j.name]})
        .then(result => {
          return {
            id: judge[j.id],
            declarations: _.map(result, 'document')
          }
        })
    }, {concurrency: 18})

  ]
}

function lookupNames(judges, declarationsResult) {

  _.forEach(declarationsResult, declarationsAndId => {
    setRelatives(judges, declarationsAndId.id, getRelatives(declarationsAndId.declarations));
    setCoowners(judges, declarationsAndId.id, getCoowners(declarationsAndId.declarations));
  });

  return [
    judges,
    declarationsResult
  ]
}

function saveCSV(judges, declarations) {
  let result = json2csv({data: judges, fields: COLUMNS});
  return writeFile(`./all-relatives.csv`, result);
}

Promise.resolve(csvGoogleSheetsLinkToFilteredJudgesNames)
  .then(remoteCSVtoJSON)
  .then(findTheirDeclarations)
  .spread(lookupNames)
  .spread(saveCSV)
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .error(console.log)
  .catch(console.log);
