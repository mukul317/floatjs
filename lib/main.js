"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = __importDefault(require("./Droope/data"));
var Droope_1 = __importDefault(require("./Droope"));
var Suggester_1 = __importDefault(require("./Suggester"));
(function () {
    var inputElement = document.querySelector(".select-box-input");
    var lisitingElement = document.querySelector(".select-box-listing");
    var displayElement = document.querySelector(".select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        var options = {
            inputElement: inputElement,
            lisitingElement: lisitingElement,
            displayElement: displayElement,
            selectLimit: 3,
            displayListOnFocus: true,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result"
        };
        var DroopeInstance = Droope_1.default(options, data_1.default);
        console.log(DroopeInstance);
    }
})();
(function () {
    var inputElement = document.querySelector(".suggester-select-box-input");
    var lisitingElement = document.querySelector(".suggester-select-box-listing");
    var displayElement = document.querySelector(".suggester-select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        var options = {
            inputElement: inputElement,
            lisitingElement: lisitingElement,
            displayElement: displayElement,
            selectLimit: 3,
            displayListOnFocus: true,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result"
        };
        var SuggesterInstance = Suggester_1.default(options, data_1.default);
        console.log(SuggesterInstance);
    }
})();
//# sourceMappingURL=main.js.map