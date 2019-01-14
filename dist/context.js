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
var operators_1 = require("rxjs/operators");
var ValueSubject_1 = require("./ValueSubject");
var ProvideSubscriber = (function (_super) {
    __extends(ProvideSubscriber, _super);
    function ProvideSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProvideSubscriber.prototype._complete = function () {
        this.destination.clear();
        this.unsubscribe();
    };
    return ProvideSubscriber;
}(rxjs_1.Subscriber));
var Context = (function () {
    function Context() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this._value = new ValueSubject_1.ValueSubject();
        rxjs_1.merge(rxjs_1.NEVER, rxjs_1.of.apply(void 0, values)).subscribe(this._value);
    }
    Context.prototype.consume = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        rxjs_1.merge(rxjs_1.NEVER, rxjs_1.of.apply(void 0, values)).subscribe(this._value);
        return this._value.pipe(operators_1.share());
    };
    Context.prototype.provide = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        rxjs_1.merge(rxjs_1.NEVER, rxjs_1.of.apply(void 0, values)).subscribe(this._value);
        return new ProvideSubscriber(this._value);
    };
    return Context;
}());
function context(value) {
    return new Context(value);
}
exports.context = context;
//# sourceMappingURL=context.js.map