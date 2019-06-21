"use strict";
exports.__esModule = true;
var useTakeWith_1 = require("../useTakeWith");
var takeEvery_1 = require("../operators/takeEvery");
function useTakeEvery(project, concurrent) {
    return useTakeWith_1.useTakeWith(function (project) { return takeEvery_1.takeEvery(project, concurrent); })(project);
}
exports.useTakeEvery = useTakeEvery;
//# sourceMappingURL=useTakeEvery.js.map