"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_suggester_1 = require("./helper.suggester");
const config_suggester_1 = __importDefault(require("./config.suggester"));
/**
 * @Class Select Box Input that acts as a subject for the Suggester
 * Implements TSubject interface
 *
 *
 */
class SelectBoxInput {
    /**
     * @method constructor : initiates the SelectBoxInput and set the inputElement, displayElement,listingElement,
     * selectLimit,displayListOnFocus
     * @param options
     */
    constructor(options) {
        /**
         * @resultSet stores the state of the suggester
         * has following items: list[], selection[], hasListUpdated
         */
        this.resultSet = {
            list: [],
            selection: [],
            hasListUpdated: true
        };
        /**
         * arrowCounter: shows the counter of the arrow
         */
        this.arrowCounter = -1;
        /**
         *
         */
        this.dataSet = [];
        /**
         * listObserverCollection: List Of Observers for the Subject Select Box Input
         */
        this.listObserverCollection = [];
        /**
         * displayListOnFocus:
         */
        this.displayListOnFocus = false;
        /**
         * whitelistBoolean: Boolean flag for whitelisting Special Characters
         */
        this.sanitiseString = false;
        /**
         * specialCharactersAllowedList: List of special characters to be send and allowed to be sent into the query
         */
        this.specialCharactersAllowedList = [];
        try {
            if (options) {
                this.inputElement = options.inputElement;
                this.displayElement = options.displayElement;
                this.lisitingElement = options.lisitingElement;
                this.selectLimit = options.selectLimit || 1;
                this.displayListOnFocus = options.displayListOnFocus || false;
                this.sanitiseString = options.sanitiseString || false;
                if (this.sanitiseString) {
                    if (options.specialCharactersAllowedList) {
                        this.specialCharactersAllowedList = options.specialCharactersAllowedList;
                    }
                    else {
                        throw new Error("Special Characters Allowed List is not passed");
                    }
                }
                this.inputElement.addEventListener("keydown", (e) => this.handleBackspace(e));
                this.inputElement.addEventListener("keyup", (e) => this.onKeyUp(e));
                this.lisitingElement.addEventListener("click", (e) => this.handleSelect(e.target));
                if (options.isPrefetch) {
                    helper_suggester_1.Helper.prefetchData();
                }
                if (this.displayListOnFocus === true) {
                    document.addEventListener("click", (e) => this.handleDocumentBlur(e));
                    this.inputElement.addEventListener("focus", (e) => this.handleListingDisplayStateOn(e.type));
                    // Close listing on initialization
                    this.handleListingDisplayStateOn("blur");
                }
                if (options.noResultErrorMessage) {
                    this.noResultElement = document.createElement("P");
                    this.noResultElement.classList.add("no-result");
                    this.noResultElement.style.display = "none";
                    this.noResultElement.textContent = options.noResultErrorMessage || "";
                }
            }
            else {
                throw new Error("Config not passed in Suggester");
            }
        }
        catch (e) {
            console.log("Error while Subject initialisation", e);
        }
    }
    /**
     * event handleDocumentBlur handling event for document blur on the blur of the document
     * @param event
     * @returns {void}
     */
    handleDocumentBlur(event) {
        const eventPath = event.path;
        const hasNotClickedOnListing = eventPath.indexOf(this.lisitingElement) === -1;
        const hasNotClickedOnInput = eventPath.indexOf(this.inputElement) === -1;
        if (hasNotClickedOnListing && hasNotClickedOnInput) {
            this.handleListingDisplayStateOn("blur");
        }
    }
    /**
     * @method handleListingDisplayStateOn : controls listing display
     * @param eventType
     */
    handleListingDisplayStateOn(eventType) {
        this.lisitingElement.style.display =
            eventType === "focus" ? "block" : "none";
    }
    /**
     * Handle Select set the selected object by picking the item from the data-obj attribute of the selected
     * listing element.
     * @param target
     * @returns { void }
     */
    handleSelect(target) {
        try {
            const selectedObj = JSON.parse(target.getAttribute("data-obj"));
            this.setSelectedValues(selectedObj);
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * setSelectedValues:set the selected values from the resultset on the click of the listing element
     * and sets the result set state for the Subject and the observer and updates the whole view
     * @param selectedObj
     * @returns void
     */
    setSelectedValues(selectedObj) {
        try {
            if (selectedObj) {
                // rishabh changes here
                this.initialisesRelatedSearch(selectedObj);
                // rishabh changes here
                const selectionLimitExceeded = this.selectLimit > 1
                    ? this.resultSet.selection.length >= this.selectLimit
                    : false;
                const isLastSelectionNow = this.resultSet.selection.length + 1 >= this.selectLimit;
                const isDuplicate = this.resultSet.selection.filter((item) => item.name === selectedObj.name)
                    .length > 0;
                if (selectedObj && isDuplicate === false) {
                    if (selectionLimitExceeded === false) {
                        const selection = this.selectLimit === 1
                            ? [selectedObj]
                            : [...this.resultSet.selection, selectedObj];
                        const result = {
                            hasListUpdated: false,
                            list: [...this.resultSet.list],
                            selection
                        };
                        this.emptyInputFeilds();
                        this.setData(result);
                    }
                    if (isLastSelectionNow) {
                        this.handleListingDisplayStateOn("blur");
                    }
                }
            }
        }
        catch (e) {
            throw new Error("Error in selecting target in here" + e);
        }
    }
    /**
     * This empties the input feilds values
     * @returns{void}
     */
    emptyInputFeilds() {
        try {
            this.inputElement.value = "";
        }
        catch (e) {
            console.error("Emptying input feilds");
        }
    }
    /**
     * Deletes the query on backspace and updates the query in the input feilds and also deletes the selected values
     * and updates the lsiting element based on that.
     * @param e : keyboardEvent
     */
    handleBackspace(e) {
        const which = e.which;
        const query = e.target.value.trim();
        const isQueryEmpty = query === "";
        if (which === 8) {
            const lastIndexOfSelection = this.resultSet.selection.length - 1;
            const lastName = lastIndexOfSelection >= 0 ? this.resultSet.selection[lastIndexOfSelection].name : null;
            if (isQueryEmpty === true && lastName !== null) {
                this.deleteSelection(lastName);
                this.handleListingDisplayStateOn("focus");
            }
        }
    }
    /**
     * Handles the Enter key Press on the list item
     * @param e : { keyboardEvent }: Event passed
     */
    handleEnter(e) {
        try {
            const listItem = this.lisitingElement.querySelector(".active");
            if (listItem) {
                this.handleSelect(listItem);
            }
        }
        catch (e) {
            console.log("Exception occurred while Pressing Enter:" + e);
        }
    }
    /**
     * Sanitises the String By removing Special Characters by matching with regex
     * @param query : {String}
     */
    sanitiseQuery(query) {
        try {
            if (query) {
                const patr = new RegExp("[^a-zA-Z0-9,\\s" + this.specialCharactersAllowedList + "]", "g");
                return query.replace(patr, "");
            }
            else {
                throw new Error("Query not found that is to be sanitised");
            }
        }
        catch (e) {
            console.log("Exception Occurred while Sanitising Query");
        }
    }
    /**
     * Handles the comma being entered by the user in the query . This also sanitises the Query String.
     * @param query : {String}: Query being entered by the User in the Suggester Input feild
     * @param selectedObj : {TData}:Selected Object being Selected by clicking on the Listing element
     */
    handleComma(query, selectedObj) {
        try {
            if (query.length > 1) {
                selectedObj.id = 0;
                selectedObj.name = query.split(",")[0];
                this.setSelectedValues(selectedObj);
            }
            else {
                throw new Error("Query not passed in the function");
            }
        }
        catch (e) {
            console.log("Exception Occurred :" + e);
        }
    }
    /**
     * Handles the keyUp event attached to the suggester input field.It does different functionalities
     * when the event is being  done. Covers a lot of cases for different keys presses that are as follows:
     * case 9: Tabs Pressed
     * Handles the Listing Display State and sets to blur
     * case 13: Enter pressed
     * finds the current active listing element and then Selects that listing element into the display and
     * pass the state on
     * case 38: Up Arrow
     * handles the UpArrow case by making the listing element above current active listing element as active
     * case 40: Down Arrow
     * handles the Down Arrow cases by the listing element below the current active listing element as active
     * @param e : KeyBoardEvent
     * @returns {void}
     */
    onKeyUp(e) {
        try {
            if (e) {
                const query = e && e.target && e.target.value
                    ? e.target.value.trim()
                    : "";
                const which = e.which;
                const category = "top";
                const selectedObj = {};
                switch (which) {
                    case 9: // Tab pressed
                        this.handleListingDisplayStateOn("blur");
                        return;
                    case 13: // Enter
                        // eslint-disable-next-line no-case-declarations
                        this.handleEnter(e);
                        return;
                    case 38: // Up arrow
                        this.handleArrow("up");
                        return;
                    case 40: // Down arrow
                        this.handleArrow("down");
                        return;
                    case 188:
                        this.handleComma(query, selectedObj);
                        return;
                    default:
                        this.handlesApiResponse(helper_suggester_1.Helper.sendXhr(config_suggester_1.default.urls.autoComplete, {
                            query,
                            category
                        }), category, query, "sug");
                }
            }
            else {
                throw new Error("Event not happened Event Object Missing");
            }
        }
        catch (e) {
            console.error("Error found: " + e);
        }
    }
    /**
        * Initiates related search functionality that takes selectedObject selected by clicking on the listing
        * element . The resposibility of this function is to fetch the selectedObject query and then send the
        * ajax hit to get more related  searches .
        * @param selectedObject: TData : Selected Object from the Listing element being clicked
        * @returns {return}
        * @throws {null}
        *
        */
    initialisesRelatedSearch(selectedObject) {
        try {
            if (selectedObject && selectedObject.displayTextEn) {
                const query = selectedObject.displayTextEn.toLowerCase();
                const category = "top";
                this.handlesApiResponse(helper_suggester_1.Helper.sendXhr(config_suggester_1.default.urls.relatedConcept, {
                    query,
                    category
                }), category, query, "rc");
            }
            else {
                throw Error("Error in the selectedObject");
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * Handles the related Search results returned from the api .This function initiates the filtering and fill data
     * into listing by calling the function filterAndFillDataIntoListing
     * @param resp: TRecentSearchResponse : Related Search results returned from the related search api
     * @param category: String : category of results for which suggester is visible
     * @returns {void}
     */
    handlesRelatedSearchResponseData(resp, category) {
        try {
            if (resp && category) {
                this.dataSet = resp.resultConcepts[category];
                const emptyQuery = ""; // to disable filtering in case of rc selected
                this.filterAndFillDataIntoListing(emptyQuery, category);
            }
            else {
                throw new Error("resp and category not found - param not found");
            }
        }
        catch (e) {
            console.error("Error occurred while handling RCData:" + e);
        }
    }
    /**
     * Fills the lisitng element by filtering the result set based on the query of the input feild. The result
     * list is filtered first on the basis of the query and then the data is being set into the listing element.
     * @param query: {string} : Query of the input feild being entered in the suggester input
     * @returns {void}
     */
    filterAndFillDataIntoListing(query, category) {
        try {
            if (query || category) {
                const filteredList = this.dataSet.filter((item) => {
                    if (item && item.displayTextEn) {
                        item.name = item.displayTextEn;
                        const lowerItem = item.displayTextEn.toLowerCase();
                        const lowerQuery = query.toLowerCase();
                        const includesSupported = Array.prototype.includes !== undefined;
                        return includesSupported
                            ? lowerItem.includes(lowerQuery)
                            : lowerItem.indexOf(lowerQuery) !== -1;
                    }
                });
                const hasResults = filteredList.length !== 0;
                const result = {
                    hasListUpdated: true,
                    list: hasResults ? filteredList : this.dataSet,
                    selection: [...this.resultSet.selection]
                };
                console.log("result in here", result);
                this.setData(result);
                this.arrowCounter = -1;
                this.showNoResultMessage(hasResults);
            }
            else {
                throw new Error("param not found: query");
            }
        }
        catch (e) {
            console.log("Error occurred while entering data into Listing:", e.message);
        }
    }
    /**
     * Handles the Suggester Search results returned from the api.This function initiates the filtering and fill data
     * into listing by calling the function filterAndFillDataIntoListing
     * @param resp: {TSuggesterResponse} : Response of Suggester Search api
     * @param category: {String} : category of results for which the suggester is visible
     * @param query: {String} : Query that is put inside the input feild
     * @returns{void}
     */
    handlesSuggesterResponseData(resp, category, query) {
        try {
            if (resp && category && query) {
                this.dataSet = resp.resultList[category];
                this.filterAndFillDataIntoListing(query);
            }
            else {
                throw new Error("param not found: resp , category, query");
            }
        }
        catch (e) {
            console.error("Error while handling Suggester respone data:" + e);
        }
    }
    /**
     * Handles API response returned from Suggester API and inititate the intended functionality for the suggester
     * as well as related searches taken both together based on the listing type.
     * @param promise :{TResponse} : promise returned from the suggester api hit function
     * @param category :{String} : category of results for which the suggester is visible
     * @param query : {String} : Query of the input feild
     * @param listingType :{String} : Listing  type that can be recent search and suggester suggestions
     * @returns {void}
     */
    handlesApiResponse(promise, category, query, listingType) {
        try {
            if (promise) {
                promise.then((resp) => {
                    if (resp) {
                        if (listingType) {
                            switch (listingType) {
                                case "rc":
                                    this.handlesRelatedSearchResponseData(resp, category);
                                    break;
                                case "sug":
                                    this.handlesSuggesterResponseData(resp, category, query);
                                    break;
                            }
                        }
                        else {
                            throw new Error("listingType not passed as a param");
                        }
                    }
                    else {
                        throw new Error("Promise resulted in Error - sendXHR-helper.ts");
                    }
                });
            }
            else {
                throw new Error("Promise expected as parameter - Not Found");
            }
        }
        catch (e) {
            console.error("Error occured in handle Response" + e);
        }
    }
    /**
     * Hides the no result message present on the listing element
     * when no results are there in the listing element
     * @param {hasResults} : {boolean} : Boolean flag that checks whether results are there or not
     * @returns: {void}
     */
    hidesNoResultMessage(hasResults) {
        this.noResultElement.style.display = hasResults ? "block" : "none";
    }
    /**
     * Shows the no result message present on the listing element
     * when there are results in the listing element
     * @param {hasResults} : {boolean}
     * @returns: {void}
     */
    showNoResultMessage(hasResults) {
        this.noResultElement.style.display = hasResults ? "none" : "block";
    }
    /***
     *
     */
    handleArrow(direction) {
        /** get list of all li items */
        const listItems = this.lisitingElement.querySelectorAll("li");
        /** determine the direction */
        const isGoingUp = direction === "up";
        const isGoingDown = direction === "down";
        if (isGoingDown === true) {
            /** counter is by default at -1 for first selection i.e. index 0 */
            const currentElement = listItems[this.arrowCounter + 1];
            if (currentElement) {
                // add active class to
                currentElement.classList.add("active");
                const prevElement = currentElement.previousElementSibling;
                if (prevElement) {
                    prevElement.classList.remove("active");
                }
            }
            if (this.arrowCounter < listItems.length - 1) {
                this.arrowCounter++;
            }
        }
        if (isGoingUp === true) {
            const currentElement = listItems[this.arrowCounter];
            if (currentElement) {
                currentElement.classList.remove("active");
                const prevElement = currentElement.previousElementSibling;
                if (prevElement) {
                    prevElement.classList.add("active");
                }
            }
            if (this.arrowCounter > -1) {
                this.arrowCounter--;
            }
        }
        console.log(this.arrowCounter);
    }
    setData(newData) {
        // This logic executes when SelectBox is provided with the data first time
        const isDataForFirstTime = newData.construct;
        if (isDataForFirstTime) {
            this.dataSet = newData.list;
            newData.hasListUpdated = true;
        }
        this.resultSet = {
            list: newData.list || [],
            selection: newData.selection || [],
            hasListUpdated: newData.hasListUpdated
        };
        this.notifyObservers();
    }
    registerObserver(o) {
        this.listObserverCollection.push(o);
    }
    unregisterObserver(o) {
        const index = this.listObserverCollection.indexOf(o);
        this.listObserverCollection.splice(index, 1);
    }
    notifyObservers() {
        for (const observer of this.listObserverCollection) {
            observer.update(this.resultSet);
        }
    }
    deleteSelection(name) {
        const result = {
            hasListUpdated: false,
            list: [...this.resultSet.list],
            selection: [
                ...this.resultSet.selection.filter((item) => item.name !== name)
            ]
        };
        this.setInputElement(name);
        this.setData(result);
    }
    setInputElement(name) {
        try {
            this.inputElement.value = name;
        }
        catch (e) {
            throw new Error("Error occurred while prefilling data");
        }
    }
}
exports.default = SelectBoxInput;
//# sourceMappingURL=suggester.subject.js.map