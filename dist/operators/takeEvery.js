"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
exports.takeEvery = function (project, concurrent) { return function (source) {
    var observer = source.pipe(operators_1.share());
    var completed = observer.pipe(operators_1.count());
    var result = observer.pipe(operators_1.map(function (value) { return project(value).pipe(operators_1.share()); }), operators_1.share());
    return [
        result.pipe(operators_1.mergeAll(concurrent), operators_1.takeUntil(completed), operators_1.share()),
        rxjs_1.merge(result.pipe(operators_1.mapTo(+1)), result.pipe(operators_1.map(function (o) { return o.pipe(operators_1.count(), operators_1.mapTo(-1)); }), operators_1.mergeAll(concurrent))).pipe(operators_1.scan(function (acc, value) { return (acc + value); }, 0), operators_1.startWith(0), operators_1.map(function (value) { return value > 0; }), operators_1.distinctUntilChanged(), operators_1.takeUntil(completed))
    ];
}; };
//# sourceMappingURL=takeEvery.js.map