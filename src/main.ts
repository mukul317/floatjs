import { TOptions } from "./Droope/interface";
import droopeData from "./Droope/data";
import Droope from "./Droope";
import Suggester from "./Suggester";
import { TOptions as SuggesToptions } from "./Suggester/interface";

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".select-box-input");
    const lisitingElement: HTMLElement | null = document.querySelector(".select-box-listing");
    const displayElement: HTMLElement | null = document.querySelector(".select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options: TOptions = {
            inputElement,
            lisitingElement,
            displayElement,
            selectLimit: 3,
            displayListOnFocus: true,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result"
        };
        Droope(options, droopeData);
    }
})();

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".suggester-select-box-input");
    const lisitingElement: HTMLElement | null = document.querySelector(".suggester-select-box-listing");
    const displayElement: HTMLElement | null = document.querySelector(".suggester-select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options: SuggesToptions = {
            inputElement,
            lisitingElement,
            displayElement,
            selectLimit: 3,
            displayListOnFocus: true,
            displayDecorationList: ["chips"],
            noResultErrorMessage: "Sorry no result",
            isPrefetch: true

        };
        Suggester(options, droopeData);
    }
})();
