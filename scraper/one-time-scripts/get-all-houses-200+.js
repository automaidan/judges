/**
 * Created by max on 9/23/16.
 */
let _ = require('../../snapstyle_app/node_modules/lodash'),
  __ = require('../../snapstyle_app/node_modules/lodash-contrib'),
  moment = require('../../snapstyle_app/node_modules/moment'),
  Promise = require('../../snapstyle_app/node_modules/bluebird'),
  Declarations = require('../../snapstyle_app/lib/models/db').extend({
    tableName: 'declarations',
  }),
  fs = require('fs');

function toSquereMeters(space, space_units) {
  if (space === '') {
    return 0;
  }
  space = parseFloat(space.replace(',', '.'));

  if (space_units === 'м²' || space_units === '') {
    return space;
  } else if (space_units === 'га') {
    return space * 10000;
  } else if (space_units === 'соток') {
    return space * 100;
  }
}

const a = {
  houseArea: function houseArea(declaration) {
    return +_.reduce(__.getPath(declaration, 'estate.24'), (sum, house) => sum + toSquereMeters(house.space, house.space_units), 0).toFixed(2);
  },
  familyHouseArea: function familyHouseArea(declaration) {
    return +_.reduce(__.getPath(declaration, 'estate.30'), (sum, house) => sum + toSquereMeters(house.space, house.space_units), 0).toFixed(2);
  },
};


new Declarations().find()
  .then((declarations) => {
    console.log(declarations.length);
    declarations = _.filter(declarations, d => a.houseArea(d) >= 200 || a.familyHouseArea(d) >= 200);
    console.log(declarations.length);
    const judges = _.groupBy(declarations, d => __.getPath(d, 'general.full_name'));
    console.log(judges.length);
    const judgesLess = _.map(judges, (judgeDeclarations, judgeName) => {
      const result = {};

      result[judgeName] = _.map(judgeDeclarations, (d) => {
        const r = {};
        r[__.getPath(d, 'intro.declaration_year')] = a.houseArea(d) >= a.familyHouseArea(d) ? a.houseArea(d) : a.familyHouseArea(d);

        return r;
      });
      return result;
    });

    console.log(judgesLess);
    fs.writeFile('_JUDGES.txt', JSON.stringify(judgesLess), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('_JUDGES.json saved');
      process.exit(0);
    });
  });
