import { TDroopeConfig } from "./Droope/interface";
import { TSugConfig } from "./SuggesterStable/interface";
import droopeData from "./Droope/data";
import suggesterData from "./SuggesterStable/data";
import Droope from "./Droope";
import Suggester from "./SuggesterStable";

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
            noResultErrorMessage: "Sorry no result",
            tagSelectedValues: true,
            checkboxes: true,
            listData: droopeData
        };
        const DroopeInstance = Droope(options);
        console.log(DroopeInstance);
    }
})();

((): void => {
    const inputElement: HTMLInputElement | null = document.querySelector(".suggester-select-box-input");
    const listingElement: HTMLElement | null = document.querySelector(".suggester-select-box-listing");
    const displayElement: HTMLElement | null = inputElement;
    if (inputElement && listingElement && displayElement) {
        const options: TSugConfig = {
            domId: "demoSuggester",
            inputElement,
            listingElement,
            displayElement,
            charLimit: 500,
            displayListOnFocus: false,
            displayDecorationList: [],
            startSearchAfter: 2,
            // displayBehaviour: "tag",
            noResultErrorMessage: "Sorry no result",
            checkboxes: false,
            sanitiseString: false,
            specialCharactersAllowedList: [";"],
            relatedConceptDataLayer: true,
            source: "server",
            category: "top",
            maxSuggestions: 15,
            edge: 0,
            placeholder: false,
            trackUserInteraction: false, // to track user Interaction
            grouping: true,
            isPrefetch: true,
            relatedConceptsLimit: 5,
            debounceTimeout: 500,
            defaultPrefetchLookup: true
        };
        const SuggesterInstance = Suggester(options, suggesterData);
        console.log("Suggester", SuggesterInstance);
        const btn: HTMLElement | null = document.querySelector("#suggester button");
        if (btn) {
            btn.addEventListener("click", () => {
                if (SuggesterInstance.getCompleteState) { console.log(SuggesterInstance.getCompleteState()); }
            });
        }
    }
})();
