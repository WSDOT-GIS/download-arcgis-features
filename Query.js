(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var StatisticDefinition = (function () {
        function StatisticDefinition() {
        }
        return StatisticDefinition;
    }());
    exports.StatisticDefinition = StatisticDefinition;
    var QuantizationParameter = (function () {
        function QuantizationParameter() {
        }
        return QuantizationParameter;
    }());
    exports.QuantizationParameter = QuantizationParameter;
    var Query = (function () {
        function Query() {
        }
        return Query;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Query;
    ;
});
