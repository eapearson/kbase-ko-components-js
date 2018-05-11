/*eslint no-console: ["error", {allow: ["error", "warn", "log"]}]*/
define([
    'knockout',
    'numeral',
    'moment',
    'uuid',
    'marked',
    'kb_common/utils',
    'kb_common/html',

    'knockout-mapping',
    'knockout-arraytransforms',
    './lib/knockout-es6-collections',
    'knockout-validation',
    'knockout-switch-case'
], function (
    ko,
    numeral,
    moment,
    Uuid,
    marked,
    Utils,
    html
) {
    // Knockout Defaults
    ko.options.deferUpdates = true;


    // pure functions stuck onto ko

    var t = html.tag,
        div = t('div');

    function komponent(componentDef) {
        return '<!-- ko component: {name: "' + componentDef.name +
            '", params: {' +
            Object.keys(componentDef.params).map(function (key) {
                return key + ':' + componentDef.params[key];
            }).join(',') + '}}--><!-- /ko -->';
    }

    function createRootComponent(runtime, name, params) {
        var vm = {
            runtime: runtime,
            running: ko.observable(false)
        };
        var temp = document.createElement('div');
        temp.innerHTML = div({
            style: {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'column'
            }
        }, [
            '<!-- ko if: running -->',
            komponent({
                name: name,
                params: {
                    runtime: 'runtime',
                    initialParams: params
                }
            }),
            '<!-- /ko -->'
        ]);
        var node = temp.firstChild;
        ko.applyBindings(vm, node, function (context) {
            context.runtime = runtime;
        });

        function start() {
            vm.running(true);
        }

        function stop() {
            vm.running(false);
        }
       
        return {
            vm: vm,
            node: node,
            start: start,
            stop: stop
        };
    }

    var installedStylesheets = {};
    function installStylesheet(id, stylesheet) {
        if (installedStylesheets[id]) {
            return;
        }
        var temp = document.createElement('div');
        temp.innerHTML = stylesheet;
        var style = temp.querySelector('style');
        style.id = 'componentStyle_' + id;
        if (!style) {
            // This means an invalid stylesheet was passed here.
            console.warn('Invalid component stylesheet, no style tag: ', stylesheet);
            return;
        }
        document.head.appendChild(style);
        installedStylesheets[id] = stylesheet;
    }


    function registerComponent(componentFactory) {
        var name = new Uuid(4).format();
        var component = componentFactory();

        // wrap the view modei in a view model factory so we can always
        // pass the context with no fuss...
        // Note implies the view model is a class, not factory.

        let componentToRegister;
        if (component.viewModelWithContext) {
            let viewModelFactory = function(params, componentInfo) {
                let context = ko.contextFor(componentInfo.element);
                return new component.viewModelWithContext(params, context);
            };
            componentToRegister = {
                viewModel: {
                    createViewModel: viewModelFactory
                },
                template: component.template
            };
        } else {
            componentToRegister = component;
        }

        ko.components.register(name, componentToRegister);

        if (component.stylesheet) {
            installStylesheet(name, component.stylesheet);
        }

        return {
            name: function () {
                return name;
            },
            quotedName: function () {
                return '"' + name + '"';
            }
        };
    }


    function pluralize(expression, singular, plural) {
        return [
            '<!-- ko if: ' + expression + ' === 1 -->',
            singular,
            '<!-- /ko -->',
            '<!-- ko ifnot: ' + expression + ' === 1 -->',
            plural,
            '<!-- /ko -->'
        ];
    }
   
    return {
        komponent,
        createRootComponent,
        registerComponent,
        pluralize,
        ko
    };
});
