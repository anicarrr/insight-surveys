
angular.module('mwFormBuilder').component('mwLabel', {
        bindings: {
            labelFor: "@",
            labelValue: "<",
            labelClass: "@"
        },
        templateUrl: 'mw-label.html',
        controllerAs: 'ctrl'
});
