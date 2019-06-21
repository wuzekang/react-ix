"use strict";
exports.__esModule = true;
var takeLatest_1 = require("../operators/takeLatest");
var useTakeWith_1 = require("../useTakeWith");
function useTakeLatest(project) {
    return useTakeWith_1.useTakeWith(takeLatest_1.takeLatest)(project);
}
exports.useTakeLatest = useTakeLatest;
//# sourceMappingURL=useTakeLatest.js.map