"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const suggester_subject_1 = __importDefault(require("./suggester.subject"));
const lisiting_observer_1 = __importDefault(require("./lisiting.observer"));
const display_observer_1 = __importDefault(require("./display.observer"));
const Suggester = (options, data) => {
    const SelectBox = new suggester_subject_1.default(options);
    new lisiting_observer_1.default(SelectBox);
    new display_observer_1.default(SelectBox, options.displayDecorationList);
    SelectBox.setData({ list: data, construct: false });
    return SelectBox;
};
exports.default = Suggester;
//# sourceMappingURL=index.js.map