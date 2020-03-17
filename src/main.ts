import { TDroopeConfig } from "./Droope/interface";
import droopeData from "./Droope/data";
import Droope from "./Droope";
import "./Suggester";

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".select-box-input");
    const lisitingElement: HTMLElement | null = document.querySelector(".select-box-listing");
    const displayElement: HTMLElement | null = document.querySelector(".select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options: TDroopeConfig = {
            domId: "demoDroope",
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
