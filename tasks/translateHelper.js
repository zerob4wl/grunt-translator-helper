/*
 * translate-helper
 * https://github.com/zerob4wl/translator-helper
 *
 * Copyright (c) 2015 zero wl
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var matchesArray = [];

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task

    grunt.registerMultiTask('translateHelper', 'Collection all text while project',
        function () {

            // Tell grunt this task is asynchronous.
            var done = this.async();

            // Merge task-specific and/or target-specific options with these defaults.
            var options = this.options({
                punctuation: '.',
                separator: ', '
            });

            var allowFiles = ['.js','.html'];
            var app_path = options.app_path || process.cwd();
            var dictionary_path = options.dictionary_path || './dic.js';
            var dictionary_object_name = options.dictionary_object_name || 'dictionary';

            var dictionary_build_path = dictionary_path;
            dictionary_path = dictionary_path.replace('.js','_source.json');


            if (!grunt.file.exists(dictionary_path)) {
                grunt.log.writeln('Create dictionary file in : ' + dictionary_path);
                grunt.file.write(dictionary_path, '{ "dictionary": {}}', {encoding: 'utf8'});
            }


            /**
             * Extract translatable text from js and html files
             *
             * @param abspath
             * @param rootdir
             * @param subdir
             * @param filename
             */
            function exportText(abspath, rootdir, subdir, filename) {
                var extname = path.extname(filename);
                allowFiles.contains(extname,function(has){
                    if (has) {
                        var content = grunt.file.read(abspath,{encoding: 'utf8'});

                        var re = /<trans>(.*?)<\/trans>|translator\(["|'](.*?)["|']\)|\<*trans-attr[A-z| |0-9]*placeholder=['|"](.*?)['|"]/igm;

                        var matches = "";
                        while (matches = re.exec(content)) {
                            for(var i = 1;i <=4; i++) {
                                var phrase = matches[i];
                                if (phrase !== (null || undefined) && phrase !== "") {
                                    pushPhrase(phrase);
                                    done();
                                }
                            }
                        }

                    }

                });
                done();
            }


            grunt.file.recurse(app_path, exportText);


            done();

            /**
             * Push extracted text to json file
             * @param input
             */
            function pushPhrase(input){

                var  dic_object =grunt.file.readJSON(dictionary_path,{encoding: 'utf8'});

                var phrases = [];

                for (var phrase in dic_object.dictionary ){
                    phrases.push(phrase);
                }


                phrase = input;
                var hasIt = false;
                for (var word_index = 0; word_index < phrases.length; word_index++){
                    if (input === phrases[word_index]){
                        hasIt = true;
                    }
                }
                if (!hasIt) {
                    dic_object.dictionary[phrase] = phrase;

                }
                grunt.file.write(dictionary_path ,JSON.stringify(dic_object)
                    .replace(/","/g,'",\n"')
                    .replace(':{',':{\n')
                    .replace('}}','}\n}') ,{encoding: 'utf8'});
                    grunt.file.write(dictionary_build_path, '// Dictionary object from your texts \n var ' +
                    dictionary_object_name + ' = ' + JSON.stringify(dic_object.dictionary) , {encoding: 'utf8'});
            }
        });


    Array.prototype.contains = function(k, callback) {
        var self = this;
        return (function check(i) {
            if (i >= self.length) {
                return callback(false);
            }

            if (self[i] === k) {
                return callback(true);
            }

            return process.nextTick(check.bind(null, i+1));
        }(0));
    };

    Array.prototype.getUnique = function(){
        var u = {}, a = [];
        for(var i = 0, l = this.length; i < l; ++i){
            if(u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };
};
