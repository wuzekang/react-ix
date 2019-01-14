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
var react_1 = require("react");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var filterEq = function (v) { return operators_1.filter(function (x) { return x === v; }); };
exports.component = function (displayName, fn) {
    var Cycle = (function (_super) {
        __extends(Cycle, _super);
        function Cycle(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.events$ = {};
            _this.lifecycle = new rxjs_1.Subject();
            _this.element$ = new rxjs_1.BehaviorSubject(null);
            _this.id = (Cycle.counter += 1);
            var dispatch$ = new rxjs_1.Subject();
            var completed$ = _this.lifecycle.pipe(operators_1.count());
            var mounted$ = rxjs_1.merge(_this.lifecycle.pipe(filterEq('didMount'), operators_1.mapTo(true)), _this.lifecycle.pipe(filterEq('willUnmount'), operators_1.mapTo(false))).pipe(operators_1.publishBehavior(false));
            mounted$.connect();
            var ix = {
                debug: function (name) {
                    var options = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        options[_i - 1] = arguments[_i];
                    }
                    return function (o) {
                        return o.pipe(operators_1.tap(function (value) {
                            return console.log.apply(console, ['%c(next)',
                                'color:blue',
                                displayName + "#" + _this.id + " " + name,
                                value].concat(options));
                        }, function (error) {
                            return console.log.apply(console, ['%c(error)',
                                'color:red',
                                displayName + "#" + _this.id + " " + name,
                                error].concat(options));
                        }, function () {
                            return console.log.apply(console, ['%c(complete)',
                                'color:green',
                                displayName + "#" + _this.id + " " + name].concat(options));
                        }), operators_1.share());
                    };
                },
                lifecycle: _this.lifecycle,
                connect: function (event$) { return rxjs_1.merge(event$, rxjs_1.NEVER).pipe(operators_1.takeUntil(completed$)); },
                props: new rxjs_1.BehaviorSubject(props),
                dispatch: function (type) {
                    if (type === void 0) { type = 'dispatch'; }
                    return function (payload) { return dispatch$.next({ type: type, payload: payload }); };
                },
                event: function (name) {
                    var event$ = _this.events$[name] || new rxjs_1.Subject();
                    _this.events$[name] = event$;
                    return ix.connect(event$);
                },
                handle: function (name) {
                    var event$ = _this.events$[name] || new rxjs_1.Subject();
                    _this.events$[name] = event$;
                    return function (event) { return event$.next(event); };
                }
            };
            dispatch$.pipe(operators_1.withLatestFrom(ix.props)).subscribe(function (_a) {
                var _b = _a[0], type = _b.type, payload = _b.payload, props = _a[1];
                if (typeof props[type] === 'function') {
                    props[type](payload);
                }
            });
            fn(ix).subscribe(_this.element$);
            _this.state = {
                element: _this.element$.value
            };
            mounted$.pipe(operators_1.switchMap(function (mounted) { return mounted ? _this.element$ : rxjs_1.EMPTY; })).subscribe(function (element) { return _this.setState({ element: element }); });
            _this.ix = ix;
            return _this;
        }
        Cycle.prototype.componentDidMount = function () {
            this.lifecycle.next('didMount');
        };
        Cycle.prototype.componentWillReceiveProps = function (props) {
            this.lifecycle.next('willReceiveProps');
            this.ix.props.next(props);
        };
        Cycle.prototype.componentWillUnmount = function () {
            this.lifecycle.next('willUnmount');
            this.lifecycle.complete();
        };
        Cycle.prototype.render = function () {
            return this.state.element;
        };
        Cycle.displayName = displayName;
        Cycle.counter = 0;
        return Cycle;
    }(react_1.PureComponent));
    return Cycle;
};
//# sourceMappingURL=component.js.map