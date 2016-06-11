var memFs = require('mem-fs');
var editor = require('mem-fs-editor');

var store = memFs.create();
var fsPlus = editor.create(store);

module.exports = fsPlus;
