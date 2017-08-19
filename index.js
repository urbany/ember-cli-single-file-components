/* eslint-env node */
'use strict';

var SFCCompiler = require('./lib/sfc-compiler');
var Stew = require('broccoli-stew');
var Funnel = require('broccoli-funnel');
var Merge = require('broccoli-merge-trees');
var StyleManifest = require('broccoli-style-manifest');


module.exports = {
  name: 'ember-cli-single-file-components',

  preprocessTree(type, tree) {
    if(type === 'template') {
      var componentsFunnel = this._getEmberFunnel();
      return new Merge([tree, SFCCompiler(componentsFunnel, {})], { overwrite: true });
    }
    return tree;
  },

  _getEmberFunnel() {
    const app = this.app;
    const componentsFunnel = new Funnel(app.trees.app, {
      include: ['components/**/*.ember'],
      destDir: app.name,
    });

    return componentsFunnel;
  },



  // STYLES

  _isAddon() {
    return Boolean(this.parent.parent);
  },

  _getStyleFunnel() {
    var componentsFunnel = SFCCompiler(this._getEmberFunnel(), {});

    // var styleFunnel = new Funnel(this.projectRoot, {
    // componentsFunnel = Stew.debug(componentsFunnel, { name: 'components-funnel' });
    var styleFunnel = new Funnel(componentsFunnel, {
      include: [this.app.name + '/styles/sfc-styles/**/*.{css,sass,scss}'],
      allowEmpty: true,
      annotation: 'Funnel (ember-cli-single-file-components grab classic files)'
    });

    // styleFunnel = Stew.debug(styleFunnel, { name: 'style-funnel' });
    return styleFunnel;
  },

  _projectRoot(trees) {
    var projectRoot;
    if (this._isAddon()) {
      projectRoot = this.parent.root + '/addon';
    } else if (trees && trees.app) {
      projectRoot = trees.app;
    } else {
      projectRoot = this.parent.root + '/app';
    }

    return projectRoot;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    this.projectRoot = this._projectRoot(app.trees);

    if (this._isAddon()) {
      this.parent.treeForMethods['addon-styles'] = 'treeForParentAddonStyles';
      this.parent.treeForParentAddonStyles = this.treeForParentAddonStyles.bind(this);
    }
  },

  treeForParentAddonStyles(tree) {
    return this.processComponentStyles(tree);
  },

  treeForStyles(tree) {
    if (!this._isAddon()) {
      tree = this.processComponentStyles(tree);
    }
    return this._super.treeForStyles.call(this, tree);
  },

  processComponentStyles(tree) {
    var podStyles = this._getStyleFunnel();

    var styleManifest = new StyleManifest(podStyles, {
      outputFileNameWithoutExtension: 'sfc-styles',
      annotation: 'StyleManifest (ember-cli-single-file-components combining all style files that there are extensions for)'
    });

    tree = new Merge([podStyles, styleManifest, tree].filter(Boolean), {
      annotation: 'Merge (ember-cli-single-file-components merge namespacedStyles with style manafest)'
    });

    return tree;
  },
};