"use strict";


module.exports.init = function(nwGui) {

    var unirest = require('unirest');
    var nomnom = require('nomnom');
    var _ = require('lodash');
    
    var config = require('./config');
    
    try {
        var clipboard = nwGui.Clipboard.get();
    } catch(e) {throw 'could not get clipboard: ' + e.message}
    
    var getDefinitions = exports.getDefinitions = function getDefinitions(name, fn) {
    // These code snippets use an open-source library. http://unirest.io/nodejs
        unirest.get("https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + encodeURIComponent(name))
            .header("X-Mashape-Key", config.mashapeKey)
            .end(function (result) {
                try {
                    var parsed = result.body;
                    var definitions = _.map(parsed.list, function (v) {
                        return {
                            title: v.word,
                            definition: v.definition
                        }
                    });
                    fn(null, definitions);
                } catch (e) {
                    fn('Failed for a reason I won\'t try to figure out');
                }
            });
    }

    var getDefinition = exports.getDefinition = function (name, fn) {
        getDefinitions(name, function (e, v) {
            if (e) fn(e);
            if (!v || v.length < 1) fn('no definitions found');
            fn(null, v[0]);
        });
    }


    var setClipboard = exports.setClipboard = function (content) {
        clipboard.set(content, 'text');
    }

    var clearClipboard = exports.clearClipboard = function clearClipboard() {
        clipboard.clear();
    }

    // Command line API
    var cliArgs = nomnom().parse();
    if (cliArgs.word) {
        getDefinitions(cliArgs.word, function (err, definitions) {
            console.dir(definitions);
        });
    }
    if (cliArgs.clipboard) {
        setClipboard(cliArgs.clipboard);
    }
}
