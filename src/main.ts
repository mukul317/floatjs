import { TDroopeConfig } from "./Droope/interface";
import { TSugOptions } from "./Suggester/interface";
import droopeData from "./Droope/data";
import suggesterData from "./Suggester/data";
import Droope from "./Droope";
import Suggester from "./Suggester";

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".select-box-input");
    const lisitingElement: HTMLElement | null = document.querySelector(".select-box-listing");
    const displayElement: HTMLElement | null = document.querySelector(".select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options: TDroopeConfig = {
            inputElement,
            lisitingElement,
            displayElement,
            selectLimit: 3,
            displayListOnFocus: true,
            displayDecorationList: [],
            noResultErrorMessage: "Sorry no result",
            tagSelectedValues: true
        };
        const DroopeInstance = Droope(options, droopeData);
        console.log(DroopeInstance);
    }
})();

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".suggester-select-box-input");
    const listingElement: HTMLElement | null = document.querySelector(".suggester-select-box-listing");
    const displayElement: HTMLElement | null = document.querySelector(".suggester-select-box-display");
    if (inputElement && listingElement && displayElement) {
        const options: TSugOptions = {
            inputElement,
            listingElement,
            displayElement,
            selectLimit: 4,
            displayListOnFocus: false,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result",
            selectedDecorator: "chips",
            displayListStyle: "",
            sanitiseString: false,
            specialCharactersAllowedList: [";"]
        };
        const SuggesterInstance = Suggester(options, suggesterData);
        console.log("Suggester", SuggesterInstance);
    }
})();
