"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
            _this.id = (Cycle.counter += 1);
            _this.events$ = {};
            _this.lifecycle = new rxjs_1.Subject();
            var dispatch$ = new rxjs_1.Subject();
            var mounted$ = rxjs_1.merge(_this.lifecycle.pipe(filterEq('didMount'), operators_1.mapTo(true)), _this.lifecycle.pipe(filterEq('willUnmount'), operators_1.mapTo(false))).pipe(operators_1.startWith(false));
            var ix = {
                loading: function (params$, loader) {
                    return loading(params$, loader)
                        .map(ix.connect);
                },
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
                event: function (name) {
                    var event$ = _this.events$[name] || new rxjs_1.Subject();
                    _this.events$[name] = event$;
                    return event$;
                },
                lifecycle: _this.lifecycle,
                connect: function (event$) { return mounted$.pipe(operators_1.switchMap(function (mounted) { return (mounted ? event$ : rxjs_1.empty()); })); },
                props: new rxjs_1.BehaviorSubject(props),
                dispatch: function (type) {
                    if (type === void 0) { type = 'dispatch'; }
                    return function (payload) { return dispatch$.next({ type: type, payload: payload }); };
                },
                handle: function (name) { return function (event) { return _this.ix.event(name).next(event); }; }
            };
            _this.ix = ix;
            dispatch$.pipe(operators_1.withLatestFrom(_this.ix.props)).subscribe(function (_a) {
                var _b = _a[0], type = _b.type, payload = _b.payload, props = _a[1];
                if (typeof props[type] === 'function') {
                    props[type](payload);
                }
            });
            _this.element$ = new rxjs_1.BehaviorSubject(null);
            fn(_this.ix).subscribe(_this.element$);
            _this.state = {
                element: _this.element$.value
            };
            _this.ix.connect(_this.element$).subscribe(function (element) { return _this.setState({ element: element }); });
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
var loading = function (params$, loader) {
    var loader$ = params$.pipe(operators_1.map(function (params) { return loader(params).pipe(operators_1.share()); }), operators_1.share());
    return [
        loader$.pipe(operators_1.switchAll(), operators_1.share()),
        rxjs_1.combineLatest(loader$.pipe(operators_1.map(function (_, i) { return i + 1; })), loader$.pipe(operators_1.switchMap(function (o, i) {
            return o.pipe(operators_1.count(), operators_1.mapTo(i + 1));
        }), operators_1.startWith(0))).pipe(operators_1.map(function (_a) {
            var start = _a[0], end = _a[1];
            return end < start;
        }), operators_1.startWith(false)),
    ];
};
//# sourceMappingURL=index.js.map