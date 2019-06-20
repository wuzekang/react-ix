"use strict";
exports.__esModule = true;
var react_1 = require("react");
var rxjs_1 = require("rxjs");
var rxjs_hooks_1 = require("rxjs-hooks");
var operators_1 = require("rxjs/operators");
var takeLatest_1 = require("../operators/takeLatest");
function useTakeLatest(project) {
    return function (initialSource, initialResult) {
        var _a = react_1.useState([initialSource, undefined]), source = _a[0], setSource = _a[1];
        var invoke = react_1.useMemo(function () {
            return function (source) {
                var notifier = new rxjs_1.Subject();
                setSource([source, notifier]);
                return notifier;
            };
        }, []);
        var _b = rxjs_hooks_1.useObservable(function (query$) { return query$.pipe(operators_1.filter(function (_a) {
            var source = _a[0];
            return source !== undefined;
        }), takeLatest_1.takeLatest(function (_a) {
            var source = _a[0], notifier = _a[1];
            return notifier
                ? project(source)
                    .pipe(operators_1.tap(notifier))
                : project(source);
        })); }, [initialResult, initialSource !== undefined], source), result = _b[0], taking = _b[1];
        return [
            result,
            invoke,
            taking,
        ];
    };
}
exports.useTakeLatest = useTakeLatest;
//# sourceMappingURL=useTakeLatest.js.map