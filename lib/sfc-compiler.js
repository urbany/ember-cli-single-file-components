/* eslint-env node */
'use strict';

var parseComponent = require('./parser/parser');
var MultiFilter = require('broccoli-multi-filter');
var path = require('path');


var EXTENSIONS = ['ember'];


function getTemplatePath(relativePath) {
  var pathName = 'templates';
  var componentsPath = path.dirname(relativePath);
  var templatesDir = componentsPath.split(path.sep);
  templatesDir.splice(1, 0, pathName);
  var filename = path.basename(relativePath);
  var extname = path.extname(relativePath);
  var templateName = filename.replace(new RegExp(`${extname}$`), '.hbs')
  templatesDir.push(templateName)
  var templatePath = path.join.apply(null, templatesDir);

  return templatePath;
}

function getSetylePath(relativePath) {
  var pathSegementToRemove = /^components\//;

  var pathName = 'styles/sfc-styles';
  var componentsPath = path.dirname(relativePath.replace(pathSegementToRemove, ''));
  var templatesDir = componentsPath.split(path.sep);
  templatesDir.splice(1, 0, pathName);
  var filename = path.basename(relativePath);
  var extname = path.extname(relativePath);
  var templateName = filename.replace(new RegExp(`${extname}$`), '.css')
  templatesDir.push(templateName)
  var templatePath = path.join.apply(null, templatesDir);
  return templatePath;
}


function MyCompiler (inputTree, options) {
  if (!(this instanceof MyCompiler)) {
    return new MyCompiler(inputTree, options);
  }
  MultiFilter.call(this, inputTree, options);
}


MyCompiler.prototype = Object.create(MultiFilter.prototype);
MyCompiler.prototype.constructor = MyCompiler;
MyCompiler.prototype.extensions = EXTENSIONS;
MyCompiler.prototype.targetExtension = 'js';


MyCompiler.prototype.processString = function (content, relativePath, addOutputFile) {
  var res = parseComponent(content);

  if (res.template && res.template.content) {
    var templatePath = getTemplatePath(relativePath);
    addOutputFile(res.template.content, templatePath);
  }

  if (res.styles.length && res.styles[0].content) {
    var stylePath = getSetylePath(relativePath);
    addOutputFile(res.styles[0].content, stylePath);
  }

  return res.script.content;
}


module.exports = MyCompiler;
