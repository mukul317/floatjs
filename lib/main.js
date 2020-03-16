"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = __importDefault(require("./Droope/data"));
const data_2 = __importDefault(require("./Suggester/data"));
const Droope_1 = __importDefault(require("./Droope"));
const Suggester_1 = __importDefault(require("./Suggester"));
(() => {
    const inputElement = document.querySelector(".select-box-input");
    const lisitingElement = document.querySelector(".select-box-listing");
    const displayElement = document.querySelector(".select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options = {
            inputElement,
            lisitingElement,
            displayElement,
            selectLimit: 3,
            displayListOnFocus: true,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result",
            selectedDecorator: "chips"
        };
        const DroopeInstance = Droope_1.default(options, data_1.default);
        console.log(DroopeInstance);
    }
})();
(() => {
    const inputElement = document.querySelector(".suggester-select-box-input");
    const lisitingElement = document.querySelector(".suggester-select-box-listing");
    const displayElement = document.querySelector(".suggester-select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options = {
            inputElement,
            lisitingElement,
            displayElement,
            selectLimit: 4,
            displayListOnFocus: true,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result",
            selectedDecorator: "chips",
            sanitiseString: false,
            specialCharactersAllowedList: []
        };
        const SuggesterInstance = Suggester_1.default(options, data_2.default);
        console.log("Suggester", SuggesterInstance);
    }
})();
//# sourceMappingURL=main.js.map