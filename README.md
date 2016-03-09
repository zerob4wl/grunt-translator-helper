# translate-helper

> Collection all text while project

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-translate-helper --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-translate-helper');
```

## The "translate_helper" task

### Overview
In your project's Gruntfile, add a section named `translateHelper` to the data object passed into `grunt.initConfig()`.

```js

grunt.loadNpmTasks('grunt-translate-helper');

grunt.initConfig({
  translate_helper: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Usage Examples
In Javascript code you must use `translator('Hello')`.

#### Default Options

```js
grunt.initConfig({
  translate_helper: {
    options: {
      dictionary_path: './dic.js', // path of dic file
      dictionary_object_name: 'dic' // javascript object for use code
    }
  },
});
```

after run grunt task, dic_source.json create in $dictionary_path and you can translate this file. After run grunt task again
  `dic.js` update with translated text and you can add this file in index.html and use this file in you project.

### Use In Javascript
for use translated object file use this function in js library:

```js
var translator = function(word){
    var translate  =  dic[word];
    if (translate !== undefined )
        return translate;
    else
    {
        return word;
    }
};
```

### Use In AngularJs
This task can extract text from AngularJs directive.
```html
    <trans>Hello</trans>
```

and add this directive in your project
```js

// Handle global translate function
// <trans>Word Or Phrase </trans>
ModuleName.directive('trans', function () {
    return {
        restrict: 'E',
        compile: function(elem) {
            elem.replaceWith(translator(elem.html().trim()));
        }
    }

});


// Handle global translate function
// <trans>Word Or Phrase </trans>
ModuleName.directive('transAttr', function () {
    return {
        restrict: 'A',
        compile: function(elem) {
            if ($(elem).attr("placeholder"))
                $(elem).attr("placeholder",translator($(elem).attr("placeholder").trim()));
        }
    }
});
```

###Lisense
MIT 2016