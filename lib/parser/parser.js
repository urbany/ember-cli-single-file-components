/* eslint-env node */
'use strict';

/*!
 * SFC Parser By VUEJS
 * https://github.com/vuejs/vue/blob/2dc177ffb3fa0ede18841806533ba034e71195d5/src/sfc/parser.js
 */


var deindent = require('de-indent');
var parseHTML = require('./html-parser');

const splitRE = /\r?\n/g
const replaceRE = /./g
const isSpecialTag = function(v) {
  return ['script', 'style', 'template'].indexOf(v) >= 0;
}

/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
var parseComponent = function (
  content,
  options = {}
 ) {
  const sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  }
  let depth = 0
  let currentBlock = null

  function start (
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce((cumulated, { name, value }) => {
          cumulated[name] = value || true
          return cumulated
        }, Object.create(null))
      }
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs)
        if (tag === 'style') {
          sfc.styles.push(currentBlock)
        } else {
          sfc[tag] = currentBlock
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock)
      }
    }
    if (!unary) {
      depth++
    }
  }

  function checkAttrs (block, attrs) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i]
      if (attr.name === 'lang') {
        block.lang = attr.value
      }
      if (attr.name === 'scoped') {
        block.scoped = true
      }
      if (attr.name === 'module') {
        block.module = attr.value || true
      }
      if (attr.name === 'src') {
        block.src = attr.value
      }
    }
  }

  function end (tag, start/*, end*/) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start
      let text = deindent(content.slice(currentBlock.start, currentBlock.end))
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text
      }
      currentBlock.content = text
      currentBlock = null
    }
    depth--
  }

  function padContent (block, pad) {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      const offset = content.slice(0, block.start).split(splitRE).length
      const padChar = block.type === 'script' && !block.lang
        ? '//\n'
        : '\n'
      return Array(offset).join(padChar)
    }
  }

  parseHTML(content, {
    start,
    end
  })

  return sfc
}

module.exports = parseComponent;
