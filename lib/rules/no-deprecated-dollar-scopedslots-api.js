/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `$scopedSlots` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-dollar-scopedslots-api.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      deprecated: 'The `$scopedSlots` is deprecated.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(
      context,
      {
        VExpressionContainer(node) {
          for (const reference of node.references) {
            if (reference.variable != null) {
              // Not vm reference
              continue
            }
            if (reference.id.name === '$scopedSlots') {
              context.report({
                node: reference.id,
                messageId: 'deprecated',
                fix(fixer) {
                  return fixer.replaceText(reference.id, '$slots')
                }
              })
            }
          }
        }
      },
      utils.defineVueVisitor(context, {
        MemberExpression(node) {
          if (
            node.property.type !== 'Identifier' ||
            node.property.name !== '$scopedSlots'
          ) {
            return
          }
          if (!utils.isThis(node.object, context)) {
            return
          }

          context.report({
            node: node.property,
            messageId: 'deprecated',
            fix(fixer) {
              return fixer.replaceText(node.property, '$slots')
            }
          })
        }
      })
    )
  }
}
