"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var droope_subject_1 = __importDefault(require("./droope.subject"));
var lisiting_observer_1 = __importDefault(require("./lisiting.observer"));
var display_observer_1 = __importDefault(require("./display.observer"));
var Droope = function (options, data) {
    var SelectBox = new droope_subject_1.default(options);
    new lisiting_observer_1.default(SelectBox);
    new display_observer_1.default(SelectBox, options.displayDecorationList);
    SelectBox.setData({ list: data, construct: true });
    return SelectBox;
};
exports.default = Droope;
//# sourceMappingURL=index.js.map