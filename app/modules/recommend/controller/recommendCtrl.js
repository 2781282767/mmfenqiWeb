/**
 * Created by sheldon on 2016/4/15.
 */

'use strict';

define(function (require, exports, module) {
    module.exports = function (app) {
        app.register.controller('RecommendCtrl', ['$scope',
            function ($scope) {
                $scope.goBack = function () {
                    window.history.go(-1);
                }
            }])
    }
});