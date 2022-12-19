(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pkg1 = {}));
})(this, (function (exports) { 'use strict';

    var sum2 = function (num1, num2) {
      console.log("我是第pkg2包------", num1, num2);
      return num1 * num2;
    };

    var sum1 = function (num1, num2) {
        console.log("我是第pkg1包------", num1, num2);
        var name = "孙悟空";
        console.log("\u6211\u7684\u540D\u5B57-----".concat(name), sum2(3, 5));
        return num1 + num2;
    };

    exports.sum1 = sum1;

}));
