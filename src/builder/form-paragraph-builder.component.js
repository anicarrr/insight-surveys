
angular.module('mwFormBuilder')
    .factory("FormParagraphBuilderId", function () {
        var id = 0;
        return {
            next: function () {
                return ++id;
            }
        }
    })

    .component('mwFormParagraphBuilder', {
        bindings: {
            paragraph: '=',
            formObject: '=',
            onReady: '&',
            isPreview: '=?'
        },
        templateUrl: 'mw-form-paragraph-builder.html',
        controllerAs: 'ctrl',
        controller: function ($timeout, FormParagraphBuilderId) {
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.id = FormParagraphBuilderId.next();
                ctrl.formSubmitted = false;
                ctrl.translations = {
                    questionReady: "Ready",
                    paragraphPlaceholder: "Enter paragraph text"
                };
            };

            ctrl.save = function () {
                ctrl.formSubmitted = true;
                if (ctrl.form.$valid) {
                    ctrl.onReady();
                }
            };
        }
});
