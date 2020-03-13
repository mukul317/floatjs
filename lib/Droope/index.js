"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const droope_subject_1 = __importDefault(require("./droope.subject"));
const lisiting_observer_1 = __importDefault(require("./lisiting.observer"));
const display_observer_1 = __importDefault(require("./display.observer"));
const Droope = (options, data) => {
    const SelectBox = new droope_subject_1.default(options);
    new lisiting_observer_1.default(SelectBox);
    new display_observer_1.default(SelectBox, options.displayDecorationList);
    SelectBox.setData({ list: data, construct: true, hasListUpdated: false, selection: [] });
    return SelectBox;
};
exports.default = Droope;
//# sourceMappingURL=index.js.map