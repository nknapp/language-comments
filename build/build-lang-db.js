#!/usr/bin/env node

var _ = require("lodash");
var groc = require("groc");

var fs = require("fs");
var path = require("path");

var databaseDir = path.resolve(__dirname, "..", "lang-db")
/**
 * At first, we create a simple array of specs (from the `groc`-languages file).
 * The array can be transformed later to improved performance.
 * @type {Array}
 */
var baseSpec = _.map(groc.LANGUAGES, function (spec, key) {
    var result = {
        name: key,
        nameMatchers: spec.nameMatchers,
        commentsOnly: spec.commentsOnly,
        multiLineComment: spec.multiLineComment,
        singleLineComment: spec.singleLineComment
    };
    Object.keys(result).forEach(function (resultKey) {
        if (_.isUndefined(result[resultKey])) {
            delete result[resultKey]
        }
    });
    return result;
});

/**
 * Use `json-literal` to write the modified JS into a file.
 * @type {stringify}
 */
var stringify = require("json-literal").stringify;
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir);
}
var license = fs.readFileSync(require.resolve("groc/MIT-LICENSE.txt"),"utf-8");
license = "/**\n * "+license.split("\n").join("\n * ")+"\n */\n";

var dbFile = path.join(databaseDir, "lang.js");
fs.writeFileSync(dbFile,license + "module.exports = " + stringify(baseSpec) + ";\n");
