/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
// const xnv = require('xml-name-validator')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disable attribute name: ref',
      categories: ['vue3-essential', 'essential'],
      url: 'none'
    },
    fixable: null,
    schema: [],
    messages: {
      attribute: 'Attribute name `ref` is not valid.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @param {string | VIdentifier} key
     * @return {string}
     */
    const getName = (key) => (typeof key === 'string' ? key : key.name)

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective | VAttribute} node */
      VAttribute(node) {
        if (utils.isCustomComponent(node.parent.parent)) {
          return
        }

        const name = getName(node.key.name)
        if (name === 'ref') {
          context.report({
            node,
            messageId: 'attribute'
          })
        }
        if (
          node.directive &&
          name === 'bind' &&
          node.key.argument &&
          node.key.argument.type === 'VIdentifier' &&
          'ref' === node.key.argument.name
        ) {
          context.report({
            node,
            messageId: 'attribute',
            data: {
              name: node.key.argument.name
            }
          })
        }

        if (!node.directive && name === 'ref') {
          context.report({
            node,
            messageId: 'attribute',
            data: {
              name
            }
          })
        }
      }
    })
  }
}
