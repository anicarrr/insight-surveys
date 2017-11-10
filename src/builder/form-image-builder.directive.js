
angular.module('mwFormBuilder').factory("FormImageBuilderId", function(){
    var id = 0;
        return {
            next: function(){
                return ++id;
            }
        }
    })

    .directive('mwFormImageBuilder', function ($q) {

    return {
        replace: true,
        restrict: 'AE',
        require: '^mwFormPageElementBuilder',
        scope: {
            image: '=',
            formObject: '=',
            onReady: '&',
            isPreview: '=?',
            onImageSelection: '&'
        },
        templateUrl: 'mw-form-image-builder.html',
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function($timeout,FormImageBuilderId, mwFormUuid){
            var ctrl = this;
            ctrl.id = FormImageBuilderId.next();
            ctrl.formSubmitted=false;
            ctrl.translations = { 
                questionReady: "Ready",
                imageCaption: "Image caption",
                selectImageButton: "Select image"
            };

            ctrl.save=function(){
                ctrl.formSubmitted=true;
                if(ctrl.form.$valid){
                    ctrl.onReady();
                }
            };

            ctrl.selectImageButtonClicked = function(){
                var resultPromise = onImageSelection();
                resultPromise.then(function(imageSrc){
                   ctrl.image.src = imageSrc;

                }).catch(function(){

                });
            };

            function onImageSelection() {

                var d = $q.defer();
                var src = prompt("Please enter image src");
                if (src != null) {
                    d.resolve(src);
                } else {
                    d.reject();
                }

                return d.promise;
            };

            ctrl.setAlign = function(align){
                ctrl.image.align = align;
            }


        },
        link: function (scope, ele, attrs, formPageElementBuilder){
            var ctrl = scope.ctrl;
        }
    };
});
