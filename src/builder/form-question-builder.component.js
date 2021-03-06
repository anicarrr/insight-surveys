angular.module('mwFormBuilder')
    .factory("FormQuestionBuilderId", function () {
        var id = 0;
        return {
            next: function () {
                return ++id;
            }
        }
    })

    .component('mwFormQuestionBuilder', {
        bindings: {
            question: '=',
            formObject: '=',
            onReady: '&',
            isPreview: '=?',
            possiblePageFlow: '<'
        },
        templateUrl: 'mw-form-question-builder.html',
        controllerAs: 'ctrl',
        controller: function ($timeout, FormQuestionBuilderId, mwFormBuilderOptions) {
            var ctrl = this;
            
            ctrl.$onInit = function () {
                ctrl.id = FormQuestionBuilderId.next();
                ctrl.questionTypes = mwFormBuilderOptions.questionTypes;
                ctrl.formSubmitted = false;

                sortAnswersByOrderNo();

                ctrl.translations = {
                    question: {
                        text: "Question text",
                        type: "Question type",
                        preview: {
                            text: "Short answer text",
                            textarea: "Long answer text",
                            otherAnswer: "Other"
                        },
                        priority: {
                            sorted: "Sorted",
                            available: "Available",
                            clickToAddItem: "Click to add item"
                        },
                        division: {
                            quantity: "Quantity",
                            unit: "Unit label",
                            assignedSumLabel: "Assigned",
                            fromRequiredLabel: "from required"
                        },
                        number: {
                            min: "Min",
                            max: "Max"
                        },
                        range: {
                            from: "Range from",
                            to: "to"
                        },
                        ready: "Ready",
                        required: "Required"
                    },
                    pageFlow: {
                        afterPage: "After page {{page}}:",
                        afterQuestionAnswer: "Go to page based on answer",
                        goToPage: "Go to page {{page.number}}",
                        goToNextPage: "Continue to next page",
                        submitForm: "Submit form"
                    }
                }

                ctrl.offeredAnswersSortableConfig = {
                    disabled: false,
                    ghostClass: "beingDragged",
                    handle: ".drag-handle",
                    onEnd: function (e, ui) {
                        updateAnswersOrderNo();
                    }
                };
            };

            function updateAnswersOrderNo() {
                if (ctrl.question.offeredAnswers) {
                    for (var i = 0; i < ctrl.question.offeredAnswers.length; i++) {
                        ctrl.question.offeredAnswers[i].orderNo = i + 1;
                    }
                }
            }

            function sortAnswersByOrderNo() {
                if (ctrl.question.offeredAnswers) {
                    ctrl.question.offeredAnswers.sort(function (a, b) {
                        return a.orderNo - b.orderNo;
                    });
                }
            }

            ctrl.save = function () {
                ctrl.formSubmitted = true;
                if (ctrl.form.$valid) {
                    ctrl.onReady();
                }
            };

            var questionTypesWithOfferedAnswers = ['radio', 'checkbox', 'select'];

            ctrl.questionTypeChanged = function () {
                if (questionTypesWithOfferedAnswers.indexOf(ctrl.question.type) !== -1) {
                    if (!ctrl.question.offeredAnswers) {
                        ctrl.question.offeredAnswers = [];
                    }
                }

                if (ctrl.question.type != 'radio') {
                    clearCustomPageFlow();
                    $timeout(function () {
                        ctrl.question.pageFlowModifier = false;
                    });

                }

                if (questionTypesWithOfferedAnswers.indexOf(ctrl.question.type) === -1) {
                    delete ctrl.question.offeredAnswers;
                }

                if (ctrl.question.type != 'grid') {
                    delete ctrl.question.grid;
                }

                if (ctrl.question.type != 'priority') {
                    delete ctrl.question.priorityList;
                }
            };

            function clearCustomPageFlow() {

                if (!ctrl.question.offeredAnswers) {
                    return;
                }

                ctrl.question.offeredAnswers.forEach(function (answer) {
                    if (ctrl.question.pageFlowModifier) {
                        answer.pageFlow = ctrl.possiblePageFlow[0];
                    } else {
                        delete answer.pageFlow;
                    }
                });
            }

            ctrl.pageFlowModifierChanged = function () {
                clearCustomPageFlow();
            };

            ctrl.controllerType = function (type) {

                var types = {
                    "text": "Short text",
                    "textarea": "Long text",
                    "radio": "Radio",
                    "select": "Select",
                    "checkbox": "Checkboxes",
                    "grid": "Grid",
                    "priority": "Priority",
                    "division": "Division",
                    "number": "Number",
                    "date": "Date",
                    "datetime": "Datetime",
                    "time": "Time",
                    "email": "Email",
                    "range": "Range",
                    "url": "URL",
                    "star": "Star Rating"
                }

                return types[type]
            };
        }
    });
