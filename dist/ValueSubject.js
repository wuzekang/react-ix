"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var ValueSubject = (function (_super) {
    __extends(ValueSubject, _super);
    function ValueSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasValue = false;
        return _this;
    }
    ValueSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (this.hasValue && subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    ValueSubject.prototype.next = function (value) {
        this.hasValue = true;
        _super.prototype.next.call(this, this._value = value);
    };
    ValueSubject.prototype.clear = function () {
        this.hasValue = false;
    };
    return ValueSubject;
}(rxjs_1.Subject));
exports.ValueSubject = ValueSubject;
//# sourceMappingURL=ValueSubject.js.map