"use strict";
exports.__esModule = true;
var takeLeading_1 = require("../operators/takeLeading");
var useTakeWith_1 = require("../useTakeWith");
function useTakeLeading(project) {
    return useTakeWith_1.useTakeWith(takeLeading_1.takeLeading)(project);
}
exports.useTakeLeading = useTakeLeading;
//# sourceMappingURL=useTakeLeading.js.map