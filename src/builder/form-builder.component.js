
angular.module('mwFormBuilder').component('mwFormBuilder', {
    bindings: {
        formData: '=',
        options: '=?',
        api: '=?'
    },
    templateUrl: 'mw-form-builder.html',
    controllerAs: 'ctrl',
    controller: function ($scope, mwFormUuid, MW_QUESTION_TYPES, mwFormBuilderOptions) {
        var ctrl = this;
        ctrl.possiblePageFlow = [];
        var defaultPageFlow = {
            nextPage: true,
            label: 'mwForm.pageFlow.goToNextPage'
        };

        ctrl.$onInit = function () {
            ctrl.possiblePageFlow.push(defaultPageFlow);
            ctrl.currentPage = 0;
            ctrl.translations = {
                addPage: "Add Page",
                formName: "Form name",
                description: "Description"
            };

            if (!ctrl.formData.pages || !ctrl.formData.pages.length) {
                ctrl.formData.pages = [];
                ctrl.formData.pages.push(createEmptyPage(1));
            }

            ctrl.options = mwFormBuilderOptions.$init(ctrl.options);

            if (ctrl.api) {
                ctrl.api.reset = function () {
                    for (var prop in ctrl.formData) {
                        if (ctrl.formData.hasOwnProperty(prop) && prop != 'pages') {
                            delete ctrl.formData[prop];
                        }
                    }

                    ctrl.formData.pages.length = 0;
                    ctrl.formData.pages.push(createEmptyPage(1));

                }
            }
            setTimeout(function () {
                updateQuestionNumbers();
            }, 0);

            $scope.$watch('ctrl.formData', function (newVal, oldVal) {
                updateQuestionNumbers();
            });
        };

        ctrl.lastPage = function () {
            ctrl.currentPage = ctrl.formData.pages.length - 1;
        };

        ctrl.addPage = function () {
            ctrl.formData.pages.push(createEmptyPage(ctrl.formData.pages.length + 1));
            ctrl.lastPage();
        };

        function createEmptyPage(number) {
            var defaultPageFlow = null;
            if (ctrl.possiblePageFlow) {
                defaultPageFlow = ctrl.possiblePageFlow[0];
            }

            return {
                id: mwFormUuid.get(),
                number: number,
                name: null,
                description: null,
                pageFlow: defaultPageFlow,
                elements: []
            };
        }

        $scope.$on('mwForm.questionUpdate', function () {
            setTimeout(function () {
                updateQuestionNumbers();
            }, 0);
        });

        function updateQuestionNumbers() {
            var questionNumber = 1;
            if (typeof ctrl.formData.pages !== 'undefined') {
                ctrl.formData.pages.forEach(function (page) {
                    if (typeof page.elements !== 'undefined') {
                        page.elements.forEach(function (element) {
                            if (element.type == 'question' && typeof element.question !== 'undefined') {
                                element.question.number = questionNumber++;
                            }
                        });
                    }
                });
            }
        }

        function updatePageNumbers() {
            for (var i = 0; i < ctrl.formData.pages.length; i++) {
                ctrl.formData.pages[i].number = i + 1;
            }
            ctrl.updatePageFlow();
        }

        ctrl.removePage = function (page) {
            var index = ctrl.formData.pages.indexOf(page);
            ctrl.formData.pages.splice(index, 1);
            updatePageNumbers();
            updateQuestionNumbers();
        };

        function arrayMove(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }

        ctrl.isSamePageFlow = function (p1, p2) {
            return (p1.page && p2.page && p1.page.id == p2.page.id) || p1.formSubmit && p2.formSubmit || p1.nextPage && p2.nextPage;
        };

        ctrl.updatePageFlow = function () {
            ctrl.possiblePageFlow.length = 1;

            ctrl.formData.pages.forEach(function (page) {

                ctrl.possiblePageFlow.push({
                    page: {
                        id: page.id,
                        number: page.number
                    },
                    label: 'mwForm.pageFlow.goToPage'
                });
            });

            ctrl.possiblePageFlow.push({
                formSubmit: true,
                label: 'mwForm.pageFlow.submitForm'
            });

            ctrl.formData.pages.forEach(function (page) {
                ctrl.possiblePageFlow.forEach(function (pageFlow) {
                    if (page.pageFlow) {
                        if (ctrl.isSamePageFlow(pageFlow, page.pageFlow)) {
                            page.pageFlow = pageFlow;
                        }
                    } else {
                        page.pageFlow = defaultPageFlow;
                    }

                    page.elements.forEach(function (element) {
                        var question = element.question;
                        if (question && question.pageFlowModifier) {
                            question.offeredAnswers.forEach(function (answer) {
                                if (answer.pageFlow) {
                                    if (ctrl.isSamePageFlow(pageFlow, answer.pageFlow)) {
                                        answer.pageFlow = pageFlow;
                                    }
                                }
                            });
                        }
                    });
                });
            });
        };

        $scope.$watch('ctrl.formData.pages.length', function (newVal, oldVal) {
            ctrl.updatePageFlow();
        });
    }
});


angular.module('mwFormBuilder').filter('mwStartFrom', function () {
    return function (input, start) {
        start = Number(start);
        return input.slice(start);
    };
});