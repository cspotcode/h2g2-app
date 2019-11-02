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
            .header('X-RapidAPI-Host', 'mashape-community-urban-dictionary.p.rapidapi.com')
            .header("X-Mashape-Key", config.mashapeKey)
            .end(function (result) {
                try {
                    var parsed = result.body;
                    var definitions = _.map(parsed.list, function (v) {
                        return {
                            title: v.word,
                            definition: v.definition.replace(/\[([^\]]+)\]/g, '$1')
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
            if (e) return fn(e);
            if (!v || v.length < 1) fn('no definitions found');
            fn(null, v[0]);
        });
    }

    // var GSR = require('google-search-results-nodejs');
    // var client = new GSR.GoogleSearchResults(config.serpKey);
    var getImage = exports.getImage = function(name, fn) {
        // var parameter = {
        //     engine: "google",
        //     ijn: "0",
        //     q: name + " neon sign",
        //     google_domain: "google.com",
        //     tbm: "isch",
        // };
        var url = 'https://serpapi.com/search.json?engine=google&q=' + encodeURIComponent(name + ' neon sign') + '&google_domain=google.com&ijn=0&tbm=isch&api_key=1413c3113020f9dd9cef20a7a44b408f842415c23c8e012c1b3ca7568d26ab34&num=1';

        unirest.get(url)
            // .header('X-RapidAPI-Host', 'mashape-community-urban-dictionary.p.rapidapi.com')
            // .header("X-Mashape-Key", config.mashapeKey)
            .end(function (result) {
                try {
                    var parsed = result.body;
                    var images = _.map(parsed.images_results, function (v) {
                        return {
                            thumbnail: v.thumbnail
                        }
                    });
                    fn(null, images[0]);
                } catch (e) {
                    fn('Failed for a reason I won\'t try to figure out');
                }
            });

        // client.json(parameter, function(data) {
        //     cb(null, data);
        // });
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
