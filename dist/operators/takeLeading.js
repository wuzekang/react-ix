"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
exports.takeLeading = function (project) { return function (source) {
    var observer = source.pipe(operators_1.share());
    var completed = observer.pipe(operators_1.count());
    var leading = new rxjs_1.Subject();
    var result = leading.pipe(operators_1.map(function (value) { return project(value).pipe(operators_1.share()); }), operators_1.share());
    var loading = rxjs_1.combineLatest(result.pipe(operators_1.map(function (_, i) { return i + 1; })), result.pipe(operators_1.switchMap(function (o, i) {
        return o.pipe(operators_1.count(), operators_1.mapTo(i + 1));
    }), operators_1.startWith(0))).pipe(operators_1.map(function (_a) {
        var start = _a[0], end = _a[1];
        return end < start;
    }), operators_1.startWith(false), operators_1.distinctUntilChanged(), operators_1.takeUntil(completed));
    observer.pipe(operators_1.withLatestFrom(loading), operators_1.filter(function (_a) {
        var loading = _a[1];
        return !loading;
    }), operators_1.map(function (_a) {
        var value = _a[0];
        return value;
    })).subscribe(leading);
    return [
        result.pipe(operators_1.switchAll(), operators_1.takeUntil(completed), operators_1.share()),
        loading,
    ];
}; };
//# sourceMappingURL=takeLeading.js.map