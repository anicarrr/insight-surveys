
angular.module('mwFormBuilder').component('mwFormPageBuilder', {
    bindings: {
        formPage: '=',
        formObject: '=',
        isFirst: '=',
        isLast: '=',
        possiblePageFlow: '<',
        onRemovePage: '&',
        onAddPage: '&'
    },
    templateUrl: 'mw-form-page-builder.html',
    controllerAs: 'ctrl',
    controller: function ($scope, $timeout, $interpolate, mwFormUuid, mwFormClone, mwFormBuilderOptions) {
        var ctrl = this;
        ctrl.updateElementsOrderNo = updateElementsOrderNo;

        ctrl.$onInit = function () {
            ctrl.hoverEdit = false;
            ctrl.formPage.namedPage = !!ctrl.formPage.name;
            ctrl.isFolded = false;
            ctrl.activeElement = null;
            sortElementsByOrderNo();

            ctrl.translations = {
                addPage: "Add Page",
                afterPage: "After page",
                pageWithNameCheckbox: "named",
                pageTabHeading: {
                    page: "Page",
                    of: "of"
                },
                paragraph: "Paragraph",
                image: "Image",
                question: "Question",
                pageName: "Page name",
                addElement: "Add element",
                pageElementsEmpty: "Empty page",
                removePage: "Remove page",
                buttonsMoveUp: "Move up",
                buttonsMoveDown: "Move Down",
                buttonsUnfold: "Unfold",
                buttonsFold: "Fold",
            }

            ctrl.sortableConfig = {
                disabled: false,
                ghostClass: "beingDragged",
                group: "survey",
                handle: ".inactive",
                //cancel: ".not-draggable",
                chosenClass: ".page-element-list",
                onEnd: function (e, ui) {
                    updateElementsOrderNo();
                    $scope.$emit('mwForm.questionUpdate');
                }
            };
        };

        ctrl.unfold = function () {
            ctrl.isFolded = false;
        };
        ctrl.fold = function () {
            ctrl.isFolded = true;
        };

        function updateElementsOrderNo() {
            for (var i = 0; i < ctrl.formPage.elements.length; i++) {
                ctrl.formPage.elements[i].orderNo = i + 1;
            }
        }

        function sortElementsByOrderNo() {
            ctrl.formPage.elements.sort(function (a, b) {
                return a.orderNo - b.orderNo;
            });
        }

        ctrl.addElement = function (type) {
            if (!type) {
                type = mwFormBuilderOptions.elementTypes[0];
            }
            var element = createEmptyElement(type, ctrl.formPage.elements.length + 1);
            ctrl.activeElement = element;
            ctrl.formPage.elements.push(element);
        };

        ctrl.cloneElement = function (pageElement, setActive) {
            var index = ctrl.formPage.elements.indexOf(pageElement);
            var element = mwFormClone.cloneElement(pageElement);
            if (setActive) {
                ctrl.activeElement = element;
            }
            ctrl.formPage.elements.splice(index, 0, element);
        };

        ctrl.removeElement = function (pageElement) {
            var index = ctrl.formPage.elements.indexOf(pageElement);
            ctrl.formPage.elements.splice(index, 1);
        };

        ctrl.moveDownElement = function (pageElement) {
            var fromIndex = ctrl.formPage.elements.indexOf(pageElement);
            var toIndex = fromIndex + 1;
            if (toIndex < ctrl.formPage.elements.length) {
                arrayMove(ctrl.formPage.elements, fromIndex, toIndex);
            }
            updateElementsOrderNo();
        };

        ctrl.moveUpElement = function (pageElement) {
            var fromIndex = ctrl.formPage.elements.indexOf(pageElement);
            var toIndex = fromIndex - 1;
            if (toIndex >= 0) {
                arrayMove(ctrl.formPage.elements, fromIndex, toIndex);
            }
            updateElementsOrderNo();
        };

        ctrl.isElementTypeEnabled = function (elementType) {
            return mwFormBuilderOptions.elementTypes.indexOf(elementType) !== -1;
        };

        ctrl.addQuestion = function () {
            ctrl.addElement('question');
        };

        ctrl.addImage = function () {
            ctrl.addElement('image');
        };

        ctrl.addParagraph = function () {
            ctrl.addElement('paragraph');
        };

        ctrl.isElementActive = function (element) {
            return ctrl.activeElement == element;
        };

        ctrl.selectElement = function (element) {
            ctrl.activeElement = element;
        };

        ctrl.onElementReady = function () {
            $timeout(function () {
                ctrl.activeElement = null;
            });
        };

        function createEmptyElement(type, orderNo) {
            return {
                id: mwFormUuid.get(),
                orderNo: orderNo,
                type: type
            };
        }

        function arrayMove(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }

        ctrl.removePage = function () {
            ctrl.onRemovePage({ currentPage: ctrl.formPage });
        };
        
        ctrl.addPage = function () {
            ctrl.onAddPage({ currentPage: ctrl.formPage });
            $scope.$emit('mwForm.questionUpdate');
        };

        $scope.$watch('ctrl.formPage.elements.length', function (newValue, oldValue) {
            if (newValue != oldValue) {
                ctrl.updateElementsOrderNo();
                $scope.$emit('mwForm.questionUpdate');
            }
        });

        //ctrl.onImageSelection = formBuilderCtrl.onImageSelection;
    }
});
