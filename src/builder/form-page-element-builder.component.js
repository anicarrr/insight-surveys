/**
 * should be used as directive attribute because it breaks the css material chain
 */
 
angular.module('mwFormBuilder').directive('mwFormPageElementBuilder', function () {
    return {
        restrict: 'A',
        scope: {
            pageElement: '=',
            formObject: '=',
            isActive: '=',
            isFirst: '=',
            isLast: '=',
            onReady: '&',
            possiblePageFlow: '<',
            onClone: '&',
            onMoveUp: '&',
            onMoveDown: '&',
            onRemove: '&'
        },
        templateUrl: 'mw-form-page-element-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function ($scope, mwFormUuid, mwFormClone) {
            var ctrl = this;

            ctrl.$onInit = function () {
                ctrl.translations = {
                    buttons: {
                        moveDown: "Move down",
                        moveUp: "Move up",
                        remove: "Remove",
                        clone: "Clone",
                        edit: "Edit",
                        view: "View"
                    }
                };

                if (ctrl.pageElement.type == 'question') {
                    if (!ctrl.pageElement.question) {
                        ctrl.pageElement.question = {
                            id: mwFormUuid.get(),
                            text: null,
                            type: null,
                            required: true
                        };
                    }
                } else if (ctrl.pageElement.type == 'image') {
                    if (!ctrl.pageElement.image) {
                        ctrl.pageElement.image = {
                            id: mwFormUuid.get(),
                            align: 'left'
                        };
                    }

                } else if (ctrl.pageElement.type == 'paragraph') {
                    if (!ctrl.pageElement.paragraph) {
                        ctrl.pageElement.paragraph = {
                            id: mwFormUuid.get(),
                            html: ''
                        };
                    }
                }
            };

            ctrl.callback = function ($event, element) {
                $event.preventDefault();
                $event.stopPropagation();
                if (element.callback && typeof element.callback === "function") {
                    element.callback(ctrl.pageElement);
                }
            };

            ctrl.filter = function (button) {
                if (!button.showInOpen && ctrl.isActive) {
                    return false;
                }
                if (!button.showInPreview && !ctrl.isActive) {
                    return false;
                }

                if (button.filter && typeof button.filter === "function") {
                    return button.filter(ctrl.pageElement);
                }
                return true;
            };

            ctrl.cloneElement = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                ctrl.onClone({ elementPicked: ctrl.pageElement });
            };

            ctrl.removeElement = function () {
                ctrl.onRemove({ elementPicked: ctrl.pageElement });
            };

            ctrl.moveDown = function () {
                ctrl.onMoveDown({ elementPicked: ctrl.pageElement });
                $scope.$emit('mwForm.questionUpdate');
            };

            ctrl.moveUp = function () {
                ctrl.onMoveUp({ elementPicked: ctrl.pageElement });
                $scope.$emit('mwForm.questionUpdate');
            };

            //ctrl.onImageSelection = pageBuilderCtrl.onImageSelection;
        }
    }
});
