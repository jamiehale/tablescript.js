// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const moo = require("moo");

  const lexer = moo.compile({
    space: {match: /\s+/, lineBreaks: true},
    true: 'true',
    false: 'false',
    fn: 'fn',
    choice: 'choice',
    table: 'table',
    dice: /(?:[1-9][0-9]*)?[dD][1-9][0-9]*/,
    identifierName: /[_a-zA-Z][_a-zA-Z0-9]*/,
    decimal: /[0|[1-9][0-9]*]?\.[0-9]+/,
    decimalInteger: /0|[1-9][0-9]*/,
    nonZeroDecimalInteger: /[1-9][0-9]*/,
    undefined: 'undefined',
    '=': '=',
    '(': '(',
    ')': ')',
    '{': '{',
    '}': '}',
    ',': ',',
    ':': ':',
  });

  const R = require('ramda');
  /*
  const { createBlockExpression } = require('../expressions/block');
  const { createCompoundExpression } = require('../expressions/compound');
  const { createAssignmentExpression } = require('../expressions/assignment');
  const { createConditionalExpression } = require('../expressions/conditional');
  const { createBinaryExpression } = require('../expressions/binary');
  const { createUnaryExpression } = require('../expressions/unary');
  const { createCallExpression } = require('../expressions/call');
  const { createObjectPropertyExpression } = require('../expressions/object-property');
  const { createFunctionExpression } = require('../expressions/function');
  const { createTableExpression } = require('../expressions/table');
  const {
    createTableEntryExpression,
    createSimpleTableEntryExpression,
    createSpreadTableEntryExpression,
  } = require('../expressions/table-entry');
  const {
    createRangeTableSelector,
    createExactTableSelector,
  } = require('../expressions/table-selector');
  const { createVariableExpression } = require('../expressions/variable');
  const { createBooleanLiteral } = require('../expressions/boolean-literal');
  const { createArrayLiteral } = require('../expressions/array-literal');
  const {
    createObjectLiteral,
    createObjectLiteralPropertyExpression
  } = require('../expressions/object-literal');
  const {
    createDiceLiteral,
    createDiceLiteralSuffix
  } = require('../expressions/dice-literal');
  const { createNumberLiteral } = require('../expressions/number-literal');
  const { createStringLiteral } = require('../expressions/string-literal');
  const { createTemplateStringLiteral } = require('../expressions/template-string-literal');
  const { createUndefinedLiteral } = require('../expressions/undefined-literal');
  const { createIfExpression } = require('../expressions/if');
  const { createWhileExpression } = require('../expressions/while');
  const { createUntilExpression } = require('../expressions/until');
  const { createSpreadExpression } = require('../expressions/spread');

  const composeBinaryExpression = (context, head, tail) => {
    return tail.reduce((result, element) => createBinaryExpression(context, result, element[1], element[3]), head);
  };

  const optionalList = (list) => list ? list : [];
  const extractOptional = (optional, index) => optional ? optional[index] : null;
  const extractList = (list, index) => list.map(e => e[index]);
  const composeList = (head, tail) => [head, ...tail];
  const buildList = (head, tail, index) => [head, ...extractList(tail, index)];

  const createLocation = (location, options) => ({
    path: options.path,
    line: location.start.line,
    column: location.start.column,
  });
  */

  const reservedWords = [
    'true',
    'false',
  ];
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Start", "symbols": ["_", "ExpressionList", "_"], "postprocess": R.nth(1)},
    {"name": "ExpressionList", "symbols": ["Expression"]},
    {"name": "ExpressionList", "symbols": ["ExpressionList", "__", "Expression"], "postprocess": ([list, , e]) => ([...list, e])},
    {"name": "Expression", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "Expression", "symbols": [{"literal":"{"}, "_", "ExpressionList", "_", {"literal":"}"}], "postprocess": R.nth(2)},
    {"name": "AssignmentExpression", "symbols": ["ConditionalExpression"], "postprocess": id},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", {"literal":"="}, "_", "ConditionalExpression"], "postprocess": ([left, , , , right]) => ({ type: 'assign', op: '=', left, right })},
    {"name": "AssignmentExpression", "symbols": ["LeftHandSideExpression", "_", "AssignmentOperator", "_", "ConditionalExpression"], "postprocess": ([left, , op, , right]) => ({ type: 'assign', op, left, right })},
    {"name": "AssignmentOperator", "symbols": [{"literal":"+="}], "postprocess": id},
    {"name": "AssignmentOperator", "symbols": [{"literal":"-="}], "postprocess": id},
    {"name": "AssignmentOperator", "symbols": [{"literal":"*="}], "postprocess": id},
    {"name": "AssignmentOperator", "symbols": [{"literal":"/="}], "postprocess": id},
    {"name": "AssignmentOperator", "symbols": [{"literal":"%="}], "postprocess": id},
    {"name": "LeftHandSideExpression", "symbols": ["MemberExpression"], "postprocess": id},
    {"name": "LeftHandSideExpression", "symbols": ["CallExpression"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}]},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"."}, "_", "IdentifierName"]},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", "Arguments"], "postprocess": ([target, , args]) => ({ type: 'call', target, args })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"["}, "_", "Expression", "_", {"literal":"]"}], "postprocess": ([target, , , , e]) => ({ type: 'index', target, e })},
    {"name": "CallExpression", "symbols": ["CallExpression", "_", {"literal":"."}, "_", "IdentifierName"], "postprocess": ([target, , , , property]) => ({ type: 'property', target, property })},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": R.always([])},
    {"name": "Arguments", "symbols": [{"literal":"("}, "_", "ArgumentList", "_", {"literal":")"}], "postprocess": R.nth(2)},
    {"name": "ArgumentList", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "ArgumentList", "symbols": ["ArgumentList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "PrimaryExpression", "symbols": ["IdentifierReference"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["Literal"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ArrayLiteral"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ObjectLiteral"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["FunctionExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["ChoiceExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["TableExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["IfExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["WhileExpression"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["UntilExpression"], "postprocess": id},
    {"name": "IdentifierReference", "symbols": ["Identifier"], "postprocess": id},
    {"name": "Identifier", "symbols": ["IdentifierName"], "postprocess": 
        (data, _, reject) => {
          if (R.includes(data.join(''), reservedWords)) {
            return reject;
          }
          return {
            type: 'identifier',
            name: data.join(''),
          };
        }
        },
    {"name": "Literal", "symbols": ["UndefinedLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["BooleanLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["NumericLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "Literal", "symbols": ["DiceLiteral"], "postprocess": id},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression"], "postprocess": id},
    {"name": "ConditionalExpression", "symbols": ["LogicalOrExpression", "_", {"literal":"?"}, "_", "AssignmentExpression", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "LogicalOrExpression", "symbols": ["LogicalAndExpression"], "postprocess": id},
    {"name": "LogicalOrExpression", "symbols": ["LogicalOrExpression", "_", {"literal":"or"}, "_", "LogicalAndExpression"]},
    {"name": "LogicalAndExpression", "symbols": ["EqualityExpression"], "postprocess": id},
    {"name": "LogicalAndExpression", "symbols": ["LogicalAndExpression", "_", {"literal":"and"}, "_", "EqualityExpression"]},
    {"name": "EqualityExpression", "symbols": ["RelationalExpression"], "postprocess": id},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", {"literal":"=="}, "_", "RelationalExpression"]},
    {"name": "EqualityExpression", "symbols": ["EqualityExpression", "_", {"literal":"!="}, "_", "RelationalExpression"]},
    {"name": "RelationalExpression", "symbols": ["AdditiveExpression"], "postprocess": id},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":"<="}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":">="}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":"<"}, "_", "AdditiveExpression"]},
    {"name": "RelationalExpression", "symbols": ["RelationalExpression", "_", {"literal":">"}, "_", "AdditiveExpression"]},
    {"name": "AdditiveExpression", "symbols": ["MultiplicativeExpression"], "postprocess": id},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"+"}, "_", "MultiplicativeExpression"], "postprocess": ([left, , , , right]) => ({ type: 'add', left, right })},
    {"name": "AdditiveExpression", "symbols": ["AdditiveExpression", "_", {"literal":"-"}, "_", "MultiplicativeExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["UnaryExpression"], "postprocess": id},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"*"}, "_", "UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"/"}, "_", "UnaryExpression"]},
    {"name": "MultiplicativeExpression", "symbols": ["MultiplicativeExpression", "_", {"literal":"%"}, "_", "UnaryExpression"]},
    {"name": "UnaryExpression", "symbols": ["LeftHandSideExpression"], "postprocess": id},
    {"name": "UnaryExpression", "symbols": [{"literal":"not"}, "__", "UnaryExpression"]},
    {"name": "UnaryExpression", "symbols": [{"literal":"-"}, "_", "UnaryExpression"]},
    {"name": "SpreadExpression", "symbols": [{"literal":"..."}, "Expression"]},
    {"name": "IfExpression", "symbols": [{"literal":"if"}, "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression", "_", {"literal":"else"}, "_", "Expression"]},
    {"name": "IfExpression", "symbols": [{"literal":"if"}, "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "WhileExpression", "symbols": [{"literal":"while"}, "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "UntilExpression", "symbols": [{"literal":"until"}, "_", {"literal":"("}, "_", "Expression", "_", {"literal":")"}, "_", "Expression"]},
    {"name": "FunctionExpression", "symbols": [(lexer.has("fn") ? {type: "fn"} : fn), "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "FunctionBody", "_", {"literal":"}"}], "postprocess": ([ , , , , formalParams, , , , , , body]) => ({ type: 'function', formalParams, body })},
    {"name": "FormalParameters", "symbols": [], "postprocess": R.always([])},
    {"name": "FormalParameters", "symbols": ["FormalParameterList"], "postprocess": id},
    {"name": "FormalParameterList", "symbols": ["FormalParameter"]},
    {"name": "FormalParameterList", "symbols": ["FormalParameterList", "_", {"literal":","}, "_", "FormalParameter"], "postprocess": ([list, , , , p]) => ([...list, p])},
    {"name": "FormalParameter", "symbols": ["BindingElement"], "postprocess": id},
    {"name": "BindingElement", "symbols": ["SingleNameBinding"], "postprocess": id},
    {"name": "BindingElement", "symbols": ["BindingPattern"], "postprocess": id},
    {"name": "SingleNameBinding", "symbols": ["BindingIdentifier"], "postprocess": id},
    {"name": "BindingIdentifier", "symbols": ["Identifier"], "postprocess": id},
    {"name": "BindingPattern", "symbols": ["ObjectBindingPattern"], "postprocess": id},
    {"name": "BindingPattern", "symbols": ["ArrayBindingPattern"], "postprocess": id},
    {"name": "ObjectBindingPattern", "symbols": [{"literal":"{"}, "_", {"literal":"}"}]},
    {"name": "ObjectBindingPattern", "symbols": [{"literal":"{"}, "_", "BindingPropertyList", "_", {"literal":"}"}]},
    {"name": "BindingPropertyList", "symbols": ["BindingProperty"]},
    {"name": "BindingPropertyList", "symbols": ["BindingPropertyList", "_", {"literal":","}, "_", "BindingProperty"]},
    {"name": "BindingProperty", "symbols": ["SingleNameBinding"]},
    {"name": "BindingProperty", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "BindingElement"]},
    {"name": "ArrayBindingPattern", "symbols": [{"literal":"["}, "_", "BindingElementList", "_", {"literal":"]"}]},
    {"name": "BindingElementList", "symbols": ["BindingElement"]},
    {"name": "BindingElementList", "symbols": ["BindingElementList", "_", {"literal":","}, "_", "BindingElement"]},
    {"name": "FunctionBody", "symbols": ["FunctionExpressionList"], "postprocess": id},
    {"name": "FunctionExpressionList", "symbols": ["ExpressionList"], "postprocess": id},
    {"name": "ChoiceExpression", "symbols": [(lexer.has("choice") ? {type: "choice"} : choice), "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "ChoiceEntryList", "_", {"literal":"}"}], "postprocess": ([ , , , , formalParams, , , , , , entries]) => ({ type: 'choice', formalParams, entries })},
    {"name": "ChoiceExpression", "symbols": [(lexer.has("choice") ? {type: "choice"} : choice), "_", {"literal":"{"}, "_", "ChoiceEntryList", "_", {"literal":"}"}], "postprocess": ([ , , , , entries]) => ({ type: 'choice', entries })},
    {"name": "ChoiceEntryList", "symbols": ["ChoiceEntry"]},
    {"name": "ChoiceEntryList", "symbols": ["ChoiceEntryList", "__", "ChoiceEntry"], "postprocess": ([list, , e]) => ([...list, e])},
    {"name": "ChoiceEntry", "symbols": ["SpreadExpression"], "postprocess": id},
    {"name": "ChoiceEntry", "symbols": ["TableEntryBody"], "postprocess": id},
    {"name": "TableExpression", "symbols": [(lexer.has("table") ? {type: "table"} : table), "_", {"literal":"("}, "_", "FormalParameters", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "TableEntryList", "_", {"literal":"}"}], "postprocess": ([ , , , , formalParams, , , , , , entries]) => ({ type: 'table', formalParams, entries })},
    {"name": "TableExpression", "symbols": [(lexer.has("table") ? {type: "table"} : table), "_", {"literal":"{"}, "_", "TableEntryList", "_", {"literal":"}"}], "postprocess": ([ , , , , entries]) => ({ type: 'table', entries })},
    {"name": "TableEntryList", "symbols": ["TableEntry"]},
    {"name": "TableEntryList", "symbols": ["TableEntryList", "__", "TableEntry"], "postprocess": ([list, , e]) => ([...list, e])},
    {"name": "TableEntry", "symbols": ["TableEntrySelector", "_", {"literal":":"}, "_", "TableEntryBody"], "postprocess": ([selector, , , body]) => ({ type: 'tableEntry', selector, body })},
    {"name": "TableEntrySelector", "symbols": ["NonZeroDecimalInteger", {"literal":"-"}, "NonZeroDecimalInteger"], "postprocess": ([from, , to]) => ({ type: 'tableEntrySelector', from, to })},
    {"name": "TableEntrySelector", "symbols": ["NonZeroDecimalInteger"], "postprocess": ([n]) => ({ type: 'tableEntrySelector', n })},
    {"name": "TableEntryBody", "symbols": ["Expression"], "postprocess": id},
    {"name": "TableEntryBody", "symbols": [{"literal":"{"}, "_", "ExpressionList", "_", {"literal":"}"}], "postprocess": R.nth(2)},
    {"name": "UndefinedLiteral", "symbols": [{"literal":"undefined"}], "postprocess": () => createUndefinedLiteral()},
    {"name": "BooleanLiteral", "symbols": [(lexer.has("true") ? {type: "true"} : true)], "postprocess": () => ({ type: 'boolean', value: true })},
    {"name": "BooleanLiteral", "symbols": [(lexer.has("false") ? {type: "false"} : false)], "postprocess": () => ({ type: 'boolean', value: false })},
    {"name": "ArrayLiteral", "symbols": [{"literal":"["}, "_", "ElementList", "_", {"literal":"]"}]},
    {"name": "ElementList", "symbols": ["AssignmentExpression"], "postprocess": id},
    {"name": "ElementList", "symbols": ["ElementList", "_", {"literal":","}, "_", "AssignmentExpression"], "postprocess": ([list, , , , e]) => ([...list, e])},
    {"name": "ObjectLiteral", "symbols": [{"literal":"{"}, "_", "PropertyDefinitionList", "_", {"literal":"}"}]},
    {"name": "PropertyDefinitionList", "symbols": ["PropertyDefinition"]},
    {"name": "PropertyDefinitionList", "symbols": ["PropertyDefinitionList", "_", {"literal":","}, "_", "PropertyDefinition"]},
    {"name": "PropertyDefinition", "symbols": ["IdentifierReference"]},
    {"name": "PropertyDefinition", "symbols": ["PropertyName", "_", {"literal":":"}, "_", "AssignmentExpression"]},
    {"name": "PropertyDefinition", "symbols": [{"literal":"..."}, "_", "AssignmentExpression"]},
    {"name": "PropertyName", "symbols": ["LiteralPropertyName"]},
    {"name": "PropertyName", "symbols": ["ComputedPropertyName"]},
    {"name": "LiteralPropertyName", "symbols": ["IdentifierName"]},
    {"name": "LiteralPropertyName", "symbols": ["StringLiteral"]},
    {"name": "LiteralPropertyName", "symbols": ["NumericLiteral"]},
    {"name": "ComputedPropertyName", "symbols": [{"literal":"["}, "_", "AssignmentExpression", "_", {"literal":"]"}]},
    {"name": "DiceLiteral", "symbols": [(lexer.has("dice") ? {type: "dice"} : dice)], "postprocess": ([dice]) => ({ type: 'diceLiteral', dice: dice.value })},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": ["NonZeroDecimalInteger"], "postprocess": id},
    {"name": "DiceLiteralSuffix$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DiceLiteralSuffix", "symbols": [/[+-]/, /[lLhH]/, "DiceLiteralSuffix$ebnf$1"]},
    {"name": "LineTerminator", "symbols": [{"literal":"\n"}]},
    {"name": "LineTerminator", "symbols": [{"literal":"\r\n"}]},
    {"name": "LineTerminator", "symbols": [{"literal":"\r"}]},
    {"name": "Comment$ebnf$1", "symbols": []},
    {"name": "Comment$ebnf$1", "symbols": ["Comment$ebnf$1", /[^\n(\r\n)\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Comment", "symbols": [{"literal":"#"}, "Comment$ebnf$1"]},
    {"name": "NumericLiteral", "symbols": [(lexer.has("decimal") ? {type: "decimal"} : decimal)], "postprocess": ([n]) => ({ type: 'numericLiteral', value: parseFloat(n) })},
    {"name": "NumericLiteral", "symbols": [(lexer.has("decimalInteger") ? {type: "decimalInteger"} : decimalInteger)], "postprocess": ([n]) => ({ type: 'numericLiteral', value: parseInt(n, 10) })},
    {"name": "NonZeroDecimalInteger", "symbols": [(lexer.has("nonZeroDecimalInteger") ? {type: "nonZeroDecimalInteger"} : nonZeroDecimalInteger)], "postprocess": ([n]) => parseInt(n, 10)},
    {"name": "IdentifierName", "symbols": [(lexer.has("identifierName") ? {type: "identifierName"} : identifierName)], "postprocess": id},
    {"name": "StringLiteral$ebnf$1", "symbols": []},
    {"name": "StringLiteral$ebnf$1", "symbols": ["StringLiteral$ebnf$1", "SingleQuoteStringCharacter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringLiteral", "symbols": [{"literal":"'"}, "StringLiteral$ebnf$1", {"literal":"'"}], "postprocess": ([_, cs]) => cs.join('')},
    {"name": "StringLiteral$ebnf$2", "symbols": []},
    {"name": "StringLiteral$ebnf$2", "symbols": ["StringLiteral$ebnf$2", "DoubleQuoteStringCharacter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringLiteral", "symbols": [{"literal":"\""}, "StringLiteral$ebnf$2", {"literal":"\""}], "postprocess": ([_, cs]) => cs.join('')},
    {"name": "DoubleQuoteStringCharacter", "symbols": [{"literal":"\\\""}], "postprocess": id},
    {"name": "DoubleQuoteStringCharacter", "symbols": [/[^"]/], "postprocess": id},
    {"name": "SingleQuoteStringCharacter", "symbols": [{"literal":"\\'"}], "postprocess": id},
    {"name": "SingleQuoteStringCharacter", "symbols": [/[^']/], "postprocess": id},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": R.always(null)},
    {"name": "__", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": R.always(null)}
]
  , ParserStart: "Start"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
