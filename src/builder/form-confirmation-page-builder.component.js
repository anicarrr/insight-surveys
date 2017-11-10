angular.module('mwFormBuilder').component('mwFormConfirmationPageBuilder', {
    bindings: {
        formObject: '=',
        defaultMessage: '=?'
    },
    templateUrl: 'mw-form-confirmation-page-builder.html',
    controllerAs: 'ctrl',
    controller: function($timeout){
        var ctrl = this;
        ctrl.translations = { 
            confirmationPage: "Confirmation page",
            customMessage: "Custom confirmation message"
        };
    }
});
