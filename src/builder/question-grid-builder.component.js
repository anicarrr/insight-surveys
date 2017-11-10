
angular.module('mwFormBuilder').component('mwQuestionGridBuilder',  {
    bindings: {
        question: '=',
    },
    templateUrl: 'mw-question-grid-builder.html',
    controllerAs: 'ctrl',
    controller: function (mwFormUuid, MW_GRID_CELL_INPUT_TYPES) {
        var ctrl = this;
        ctrl.cellInputTypes = MW_GRID_CELL_INPUT_TYPES;
        ctrl.isNewInput = {};

        this.$onInit = function () {
            ctrl.translations = {
                question: {
                    grid: {
                        cellInputType: "Cell input type",
                        rowLabel: "Row",
                        columnLabel: "Column"
                    }
                },
                buttonsRemove: "Remove",
                grid: {
                    rowLabel: "Row ",
                    clickToAddRow: "Click to add row",
                    clickToAddColumn: "Click to add column",
                    columnLabel: "Column "
                }
            }

            if (!ctrl.question.grid) {

                ctrl.question.grid = {
                    rows: [],
                    cols: []
                };
                ctrl.addNewRow();
                ctrl.addNewCol(true);
            }

            if (!ctrl.question.grid.cellInputType) {
                ctrl.question.grid.cellInputType = ctrl.cellInputTypes[0];
            }

            sortByOrderNo(ctrl.question.grid.rows);
            sortByOrderNo(ctrl.question.grid.cols);

            ctrl.rowsSortableConfig = {
                disabled: false,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function (e, ui) {
                    updateOrderNo(ctrl.question.grid.rows);
                }
            };

            ctrl.colsSortableConfig = {
                disabled: false,
                ghostClass: "beingDragged",
                handle: ".drag-handle",
                onEnd: function (e, ui) {
                    updateOrderNo(ctrl.question.grid.cols);
                }
            };
        };

        ctrl.addNewRow = function (noFocus) {
            var row = {
                id: mwFormUuid.get(),
                orderNo: ctrl.question.grid.rows.length + 1,
                label: null
            };

            if (!noFocus) {
                ctrl.isNewInput[row.id] = true;
            }

            ctrl.question.grid.rows.push(row);
        };

        ctrl.addNewCol = function (noFocus) {
            var col = {
                id: mwFormUuid.get(),
                orderNo: ctrl.question.grid.cols.length + 1,
                label: null
            };

            if (!noFocus) {
                ctrl.isNewInput[col.id] = true;
            }

            ctrl.question.grid.cols.push(col);
        };

        function updateOrderNo(array) {
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    var item = array[i];
                    item.orderNo = i + 1;
                }
            }
        }

        function sortByOrderNo(array) {
            array.sort(function (a, b) {
                return a.orderNo - b.orderNo;
            });
        }

        ctrl.removeRow = function (row) {
            var index = ctrl.question.grid.rows.indexOf(row);
            if (index != -1) {
                ctrl.question.grid.rows.splice(index, 1);
            }
        };

        ctrl.removeCol = function (col) {
            var index = ctrl.question.grid.cols.indexOf(col);

            if (index != -1) {
                ctrl.question.grid.cols.splice(index, 1);
            }
        };

        ctrl.keyPressedOnInput = function (keyEvent, input, type) {
            delete ctrl.isNewInput[input.id];
            if (keyEvent.which === 13) {
                keyEvent.preventDefault();
                if (type == 'row') {
                    ctrl.addNewRow();
                } else {
                    ctrl.addNewCol();
                }
            }
        };

        ctrl.controllerType = function (type) {
            var types = {
                "text": "Short text",
                "radio": "Radio",
                "checkbox": "Checkboxes",
                "number": "Number",
                "date": "Date",
                "time": "Time"
            }

            return types[type]
        };
    }
});
