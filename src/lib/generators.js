define([], function () {
    'use strict';

    function koIf(expression, markup, elseMarkup) {
        if (!elseMarkup) {
            return  [
                '<!-- ko if: ' + expression + ' -->',
                markup,
                '<!-- /ko -->'
            ];
        }
        return  [
            '<!-- ko if: ' + expression + ' -->',
            markup,
            '<!-- /ko -->',
            '<!-- ko ifnot: ' + expression + ' -->',
            elseMarkup,
            '<!-- /ko -->'
        ];
    }

    function koIfnot(expression, markup, elseMarkup) {
        if (!elseMarkup) {
            return  [
                '<!-- ko ifnot: ' + expression + ' -->',
                markup,
                '<!-- /ko -->'
            ];
        }
        return  [
            '<!-- ko ifnot: ' + expression + ' -->',
            markup,
            '<!-- /ko -->',
            '<!-- ko if: ' + expression + ' -->',
            elseMarkup,
            '<!-- /ko -->'
        ];
    }

    function koPlural(expression, singular, plural) {
        return koIf(expression + ' === 1', singular,  plural);
    }

    function koForeach(expression, markup) {
        return [
            '<!-- ko foreach: ' + expression + ' -->',
            markup,
            '<!-- /ko -->'
        ];
    }

    function koForeachAs(expression, as, markup) {
        return [
            '<!-- ko foreach: {data: ' + expression + ', as: "' + as +  '"} -->',
            markup,
            '<!-- /ko -->'
        ];
    }

    function koLet(lets, markup) {
        let letExpression = '{' + Object.keys(lets).map((key) => {
            // use " for keys to be as generic as possible
            // the value is raw, though, since it may be a 
            // vm reference or a literal.
            return  '"' + key + '":' + lets[key];
        })
            .join(', ') + '}';
        let result = [
            '<!-- ko let: ' + letExpression + '-->',
            markup,
            '<!-- /ko -->'
        ];
        // console.log('result', result);
        // return markup;
        return result;
    }

    function koIfLet(lets, markup) {
        let valueExpressions = [];
        let letExpression = '{' + Object.keys(lets).map((key) => {
            // use " for keys to be as generic as possible
            // the value is raw, though, since it may be a 
            // vm reference or a literal.
            valueExpressions.push(lets[key]);
            return  '"' + key + '":' + lets[key];
        })
            .join(', ') + '}';
        let ifExpression = '( ' + valueExpressions.map((expr) => {
            return '(' + expr + ')';
        }).join(' && ') + ' )';

        let result = [

            '<!-- ko if: ' + ifExpression + ' -->',
            '<!-- ko let: ' + letExpression + '-->',
            markup,
            '<!-- /ko -->',
            '<!-- /ko -->'
        ];
        // console.log('result', result);
        // return markup;
        return result;
    }

    function koWith(identifier, markup) {
        return [
            '<!-- ko with: ' + identifier + '-->',
            markup,
            '<!-- /ko -->'
        ];
    }

    function koSwitch(condition, cases) {
        return [
            '<!-- ko switch: ' + condition + ' -->',
            cases.map((clause) => {
                return [
                    '<!-- ko case: ',
                    clause[0],
                    ' -->',
                    clause[1],
                    '<!-- /ko -->'
                ];
            }),
            '<!-- /ko -->'
        ];
    }

    function koText(binding) {
        return [
            '<!-- ko text: ' + binding + ' -->',
            '<!-- /ko -->'
        ];
    }

    return {
        koIf,
        if: koIf,
        koIfnot,
        ifnot: koIfnot,
        koPlural,
        plural: koPlural,
        koForeach,
        foreach: koForeach,
        koForeachAs,
        foreachAs: koForeachAs,
        koLet,
        let: koLet,
        koWith,
        with: koWith,
        koSwitch,
        switch: koSwitch,
        koIfLet,
        ifLet: koIfLet,
        koText,
        text: koText
    };
});