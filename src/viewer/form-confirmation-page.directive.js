
angular.module('mwFormViewer')
    .directive('mwFormConfirmationPage', function () {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormViewer',
        scope: {
            submitStatus: '=',
            confirmationMessage: '='
        },
        templateUrl: 'mw-form-confirmation-page.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function(){
            var ctrl = this;

            ctrl.translations = {
                defaultMessage: "Your response has been recorded",
                errorMessage: "Error! Your response has not been recorded",
                pendingMessage: "Your response is being saved."
            }

        },
        link: function (scope, ele, attrs, mwFormViewer){
            var ctrl = scope.ctrl;
            ctrl.print =  mwFormViewer.print;
        }
    };
});
