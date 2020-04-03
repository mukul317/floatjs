import { TDroopeConfig } from "./Droope/interface";
import droopeData from "./Droope/data";
import Droope from "./Droope";
import "./Suggester";

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".select-box-input");
    const lisitingElement: HTMLElement | null = document.querySelector(".select-box-listing");
    const displayElement: NodeList | null = document.querySelectorAll(".select-box-display");
    if (inputElement && lisitingElement && displayElement) {
        const options: TDroopeConfig = {
            domId: "demoDroope",
            inputElement,
            lisitingElement,
            displayElement,
            selectLimit: 2,
            displayListOnFocus: true,
            displayDecorationList: [],
            noResultErrorMessage: "Sorry no result",
            tagSelectedValues: true,
            checkboxes: true,
            listData: droopeData
        };
        const DroopeInstance = Droope(options);
        console.log(DroopeInstance);
    }
})();
