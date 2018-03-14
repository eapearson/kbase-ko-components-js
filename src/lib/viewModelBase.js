define([
    'knockout',
    './subscriptionManager'
], function (
    ko,
    SubscriptionManager
) {

    class ViewModelBase {
        constructor() {
            this.subscriptions = new SubscriptionManager();
            // is this kosher? Maybe a better way of tying in 
            // functionality to the current knockout system?
            // E.g. passing in a ko in the constructor?
            this.observable = ko.observable;
            this.observableArray = ko.observableArray;
        }

        subscribe(observable, fun) {
            this.subscriptions.add(observable.subscribe(fun));
        }

        dispose() {
            this.subscriptions.dispose();
        }
    }

    return ViewModelBase;
});