"use strict";
let Promise = require('bluebird');
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);

/**
 *
 * @param filePath
 * @param content
 * @returns {JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function updateTimestampFile (filePath, content) {
    return readFile(filePath, 'utf8')
        .then(oldContent => {
            if (content !== oldContent) {
                return writeFile(filePath + ".timestamp", ""+ (new Date().getTime()));
            }
        });
};
