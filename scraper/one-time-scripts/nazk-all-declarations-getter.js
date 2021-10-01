
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require('lodash');
const writeFile = Promise.promisify(require('fs').writeFile);

const link = 'https://public-api.nazk.gov.ua/v1/declaration/?page=';
const get = function get(page) {
  if (page === undefined) {
    page = 1;
  }

  return fetch(link + page)
    .then(response => response.text())
    .then(data => JSON.parse(data))
    .then((json) => {
      if (json.error) {
        return;
      }
      return json;
    });
};

const run = function run() {
  return get()
    .then((json) => {
      if (json.error) {
        return;
      }
      return {
        items: json.items,
        pages: _.range(2, Math.ceil(json.page.totalItems / json.page.batchSize) + 1),
      };
    })
    .then((data) => {
      const items = data.items;
      const arrPages = data.pages;

      return Promise.reduce(arrPages, (result, page) => {
        console.log(`public-api.nazk.gov.ua page ${page}`);

        return get(page)
          .then((json) => {
            if (json.error) {
              return result;
            }

            return _.union(result, json.items);
          });
      }, items);
    })
    .then(edeclarations => _.map(edeclarations, declaration => ({
      id: declaration.id,
      name: _.toLower(`${declaration.lastname} ${declaration.firstname}`),
    })))
    .then(edeclarations => writeFile('../output/edeclarations.json', JSON.stringify(edeclarations)))
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
    .catch((e) => {
      throw new Error(e.message);
    });
};

run();
