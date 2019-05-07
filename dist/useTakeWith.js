"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_hooks_1 = require("rxjs-hooks");
var react_1 = require("react");
exports.useTakeWith = function (strategy) {
    return function (project, initialSource, initialResult) {
        var _a = react_1.useState([initialSource, undefined]), source = _a[0], setSource = _a[1];
        var _b = rxjs_hooks_1.useObservable(function (query$) { return query$.pipe(strategy(function (_a) {
            var source = _a[0], notifier = _a[1];
            return notifier
                ? project(source)
                    .pipe(operators_1.tap(notifier))
                : project(source);
        })); }, [initialResult, true], source), result = _b[0], taking = _b[1];
        return [
            function (source) {
                var notifier = new rxjs_1.Subject();
                setSource([source, notifier]);
                return notifier;
            },
            result,
            taking,
        ];
    };
};
//# sourceMappingURL=useTakeWith.js.map