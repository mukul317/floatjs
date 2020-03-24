import { TObserver, TData, TState, TSubject, TSuggesterResponse, TRecentSearchResponse, TResponse, TSugOptions } from "./interface";
import { Helper } from "./helper.suggester";
import suggesterConfig from "./config.suggester";

/**
 * @Class Select Box Input that acts as a subject for the Suggester
 * Implements TSubject interface
 *
 *
 */
class SelectBoxInput implements TSubject {
    /**
     * @resultSet stores the state of the suggester
     * has following items: list[], selection[], hasListUpdated
     */
    public resultSet: TState = {
        list: [],
        selection: [],
        hasListUpdated: true
    }

    /**
     * listingElement: Showing Listing of Suggester
     */
    public listingElement: HTMLElement

    /**
     * displayListStyle: Showing listing style
     */
    public displayListStyle: string

    /**
     * heading Element: For showing the heading of suggestions
     */
    public headingElement: HTMLElement

    /**
     * Debounce timer variable used for debouncing the user input
     */
    public debounceTimer: NodeJS.Timeout | null = null;

    /**
     * DisplayElement: item where selected item is displayed
     */
    public displayElement: HTMLElement

    /**
     * arrowCounter: shows the counter of the arrow
     */
    public arrowCounter = -1

    /**
     * Display noResultElement in case of Zero Items in Listing element
     */
    public noResultElement: HTMLElement

    /**
     * inputElement: Feild input element For input feilds
     */
    private inputElement: HTMLInputElement

    /**
     * For sending a prefetch request for data
     */
    private isPrefetch: boolean

    /**
     *
     */
    private dataSet: TData[] = []

    /**
     * selectLimit: limit for number of selections
     */
    private selectLimit = 0;

    /**
     * listObserverCollection: List Of Observers for the Subject Select Box Input
     */
    private listObserverCollection: TObserver[] = []

    /**
     * displayListOnFocus:
     */
    private displayListOnFocus = false

    /**
     * whitelistBoolean: Boolean flag for whitelisting Special Characters
     */
    private sanitiseString = false;

    /**
     * specialCharactersAllowedList: List of special characters to be send and allowed to be sent into the query
     */
    private specialCharactersAllowedList: string[] = []

    /**
     * @method constructor : initiates the SelectBoxInput and set the inputElement, displayElement,listingElement,
     * selectLimit,displayListOnFocus
     * @param options
     */
    constructor(options: TSugOptions) {
        this.inputElement = options.inputElement;
        this.displayElement = options.displayElement;
        this.listingElement = options.listingElement;
        this.selectLimit = options.selectLimit || 1;
        this.displayListOnFocus = options.displayListOnFocus || false;
        this.displayListStyle = options.displayListStyle || "";
        this.sanitiseString = options.sanitiseString || false;
        this.isPrefetch = options.isPrefetch || false;
        if (this.sanitiseString) {
            if (options.specialCharactersAllowedList) {
                this.specialCharactersAllowedList = options.specialCharactersAllowedList;
            } else {
                throw new Error("Special Characters Allowed List is not passed");
            }
        }

        this.inputElement.addEventListener("keydown", (e) => this.handleBackspace(e));
        this.inputElement.addEventListener("keyup", (e) => this.onKeyUp(e));
        this.listingElement.addEventListener("click", (e: MouseEvent) => {
            const target: HTMLElement | null = e.target as HTMLElement;
            if (target) {
                this.onSelect(target);
            }
        });

        if (this.isPrefetch) {
            Helper.prefetchData(options);
        }

        if (this.displayListOnFocus === true) {
            document.addEventListener("click", (e) => this.handleDocumentBlur(e));
            this.inputElement.addEventListener("focus", (e) =>
                this.handleListingDisplayStateOn(e.type)
            );

            // Close listing on initialization
            this.handleListingDisplayStateOn("blur");
        }

        this.noResultElement = document.createElement("P");
        this.noResultElement.classList.add("no-result");
        if (options.noResultErrorMessage) {
            this.noResultElement.style.display = "none";
            this.noResultElement.textContent = options.noResultErrorMessage || "";
        }
        this.headingElement = document.createElement("P");
        this.headingElement.classList.add("no-result");

        //  this.initialiseHeadingElement();
    }

    public initialiseHeadingElement(): void {
        this.headingElement = document.createElement("P");
        try {
            this.headingElement.classList.add("no-result");
        } catch (e) {
            console.warn("Errors occurred while initialising heading element");
        }
    }

    /**
     * event handleDocumentBlur handling event for document blur on the blur of the document
     * @param event
     * @returns {void}
     */
    public handleDocumentBlur(event: MouseEvent): void {
        try {
            const target: HTMLElement = (event.target as HTMLElement);
            if (target) {
                const hasClickedOnInput: boolean = this.inputElement === target;
                const hasClickedOnListItem: boolean = target.classList ? target.classList.contains("list-item") : false;

                if (hasClickedOnListItem === false && hasClickedOnInput === false) {
                    this.handleListingDisplayStateOn("blur");
                }
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    /**
     * @method handleListingDisplayStateOn : controls listing display
     * @param eventType
     */
    public handleListingDisplayStateOn(eventType: string): void {
        this.listingElement.style.display =
            eventType === "focus" ? "block" : "none";
    }

    /**
     * Handle Select set the selected object by picking the item from the data-obj attribute of the selected
     * listing element.
     * @param target
     * @returns { void }
     */
    public onSelect(target: HTMLElement): void {
        try {
            const selectedObjStr: string = target.getAttribute("data-obj") || "";
            const selectedObj: TData = JSON.parse(selectedObjStr);
            this.setSelectedValues(selectedObj);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * This sets the selected object values into the result set
     * @access public
     * @param selectedObj
     * @returns void
     */
    public setSelectedValues(selectedObj: TData): void {
        try {
            if (selectedObj) {
                // rishabh changes here
                this.sendRelatedSearchRequest(selectedObj);
                // rishabh changes here

                const selectionLimitExceeded: boolean =
                    this.selectLimit > 1
                        ? this.resultSet.selection.length >= this.selectLimit
                        : false;
                const isLastSelectionNow: boolean =
                    this.resultSet.selection.length + 1 >= this.selectLimit;
                const isDuplicate: boolean =
                    this.resultSet.selection.filter((item) => item.name === selectedObj.name)
                        .length > 0;
                if (selectedObj && isDuplicate === false) {
                    if (selectionLimitExceeded === false) {
                        const selection =
                            this.selectLimit === 1
                                ? [selectedObj]
                                : [...this.resultSet.selection, selectedObj];
                        const result: TState = {
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
        } catch (e) {
            throw new Error("Error in selecting target in here" + e);
        }
    }

    /**
     * This empties the input feilds values
     * @returns{void}
     */
    public emptyInputFeilds(): void {
        try {
            this.inputElement.value = "";
        } catch (e) {
            console.error("Emptying input feilds");
        }
    }

    /**
     * Deletes the query on backspace and updates the query in the input feilds and also deletes the selected values
     * and updates the lsiting element based on that.
     * @access public
     * @param e : keyboardEvent
     * @returns void
     */
    public handleBackspace(e: KeyboardEvent): void {
        const which = e.which;
        const query = (e.target as HTMLInputElement).value.trim();
        const isQueryEmpty: boolean = query === "";

        if (which === 8 && this.resultSet.selection) {
            const lastIndexOfSelection: number = this.resultSet.selection.length - 1;
            const lastName: string | null = lastIndexOfSelection >= 0 ? this.resultSet.selection[lastIndexOfSelection].name : null;
            if (isQueryEmpty === true && lastName !== null) {
                this.deleteSelection(lastName);
                this.handleListingDisplayStateOn("focus");
            }
        }
    }

    /*
     * Debouncing Request for avoiding multiple requests being hit repetitively as user types quickly.
     * When user types quickly then at the same instant multiple requests are being fired. To avoid those
     * multiple requests we have added debouncing so that once user is done typing the query then only hit
     * for the suggestions will go for the suggestions. This avoid multiple hits on the server on the same
     * time. Here we define timeout of debouncing i.e. if in this time user types again then the previous
     * request will not be fired and it will be fired only when user does not type during that interval.
     * @param requestFunction : Function on which debouncing is to be done
     * @param debounceInterval : Interval of debouncing after which request should be done
     * @access public
     * @returns Promise<void>
     */

    public debounceRequest(debounceInterval: number): Promise<void> {
        if (this.debounceTimer) { clearTimeout(this.debounceTimer); }
        return new Promise((resolve: Function): void => {
            this.debounceTimer = setTimeout(
                (): void => resolve(),
                debounceInterval
            );
        });
    }

    /**
     * Handles the Enter key Press on the list item
     * @param e : { keyboardEvent }: Event passed
     * @access public
     * @returns void
     */
    public handleEnter(event: KeyboardEvent): void {
        try {
            if (event) {
                const listItem: HTMLElement | null = this.listingElement.querySelector(".active");
                if (listItem) {
                    this.onSelect(listItem);
                }
            } else {
                throw new Error("Event not happened or passed into function :" + event);
            }
        } catch (e) {
            console.log("Exception occurred while Pressing Enter:" + e);
        }
    }

    /**
     * Sanitises the String By removing Special Characters by matching with regex that is passed for
     * whitelisting the special characters as well. This custom characters whitelisting is being provided
     * by passing a specialcharacterallowedlist into the config.
     * @param query : {String}
     * @access public
     * @returns string
     */
    public sanitiseQuery(query: string): string {
        try {
            if (query) {
                const patr = new RegExp("[^a-zA-Z0-9,\\s" + this.specialCharactersAllowedList + "]", "g");
                return query.replace(patr, "");
            } else {
                throw new Error("Query not found that is to be sanitised");
            }
        } catch (e) {
            console.log("Exception Occurred while Sanitising Query");
        }
        return "";
    }

    /**
     * Handles the comma being entered by the user in the query . This also sanitises the Query String.
     * @param query : {String}: Query being entered by the User in the Suggester Input feild
     * @param selectedObj : {TData}:Selected Object being Selected by clicking on the Listing element
     */

    public initialiseRelatedSearch(query: string): void {
        try {
            const selectedObj: TData = { id: 0, name: "", displayTextEn: "" };
            if (query.length > 1) {
                selectedObj.id = 0;
                selectedObj.name = query.split(",")[0];
                selectedObj.displayTextEn = selectedObj.name;

                this.setSelectedValues(selectedObj);
            } else {
                throw new Error("Query not passed in the function");
            }
        } catch (e) {
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
    public onKeyUp(e: KeyboardEvent): void {
        try {
            if (e) {
                const query: string =
                    e && e.target && (e.target as HTMLInputElement).value
                        ? this.sanitiseQuery((e.target as HTMLInputElement).value.trim())
                        : "";
                const which: number = e.which;
                const category = "top";
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
                        this.initialiseRelatedSearch(query);
                        return;

                    default:
                        this.debounceRequest(500).then(() => { this.sendSuggesterRequest(query, category); });
                }
            } else {
                throw new Error("Event not happened Event Object Missing");
            }
        } catch (e) {
            console.error("Error found: " + e);
        }
    }

    /**
     * Sets the heading element based on the current listing that is being shown.
     * @param listingType : type of listing that is being shown if its suggester or related searches
     */
    public setHeadingElement(listingType: string): void {
        try {
            if (listingType) {
                switch (listingType) {
                    case "rc":
                        this.headingElement.style.display = "block";
                        this.headingElement.textContent = "Related Searches";
                        break;
                    case "sug":
                        this.headingElement.style.display = "block";
                        this.headingElement.textContent = "Suggestions";
                        break;
                }
            } else {
                throw new Error("Listing type is not available");
            }
        } catch (e) {
            console.warn("Error occurred while setting heading element");
        }
    }

    public sendSuggesterRequest(query: string, category: string): void {
        try {
            console.log("query in here", query);
            if (query) {
                this.handleApiResponse(
                    Helper.sendXhr(suggesterConfig.urls.autoComplete, {
                        query,
                        category
                    }),
                    category,
                    query,
                    "sug"
                );
            } else {
                throw new Error("Query is not passed into the function");
            }
        } catch (e) {
            console.warn("Suggester Request function resulted in an issue", e);
        }
    }

    /**
        * Initiates related search functionality that takes selectedObject selected by clicking on the listing
        * element . The resposibility of this function is to fetch the selectedObject query and then send the
        * ajax request to get more related  searches .
        * @param selectedObject: TData : Selected Object from the Listing element being clicked
        * @returns {return}
        * @throws {null}
        *
        */
    public sendRelatedSearchRequest(selectedObject: TData): void {
        try {
            if (selectedObject && selectedObject.displayTextEn) {
                const query = selectedObject.displayTextEn.toLowerCase();
                const category = "top";

                this.handleApiResponse(
                    Helper.sendXhr(suggesterConfig.urls.relatedConcept, {
                        query,
                        category
                    }),
                    category,
                    query,
                    "rc"
                );
            } else {
                throw Error("Error in the selectedObject");
            }
        } catch (e) {
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
    public handleRelatedSearchResponseData(resp: TRecentSearchResponse, category: string): void {
        try {
            if (resp && category) {
                this.dataSet = resp.resultConcepts[category];
                const emptyQuery = ""; // to disable filtering in case of rc selected
                this.filterAndFillDataIntoListing(emptyQuery, category, "rc");
            } else {
                throw new Error("resp and category not found - param not found");
            }
        } catch (e) {
            console.error("Error occurred while handling RCData:" + e);
        }
    }

    /**
     * Fills the lisitng element by filtering the result set based on the query of the input feild. The result
     * list is filtered first on the basis of the query and then the data is being set into the listing element.
     * @param query: {string} : Query of the input feild being entered in the suggester input
     * @returns {void}
     */
    public filterAndFillDataIntoListing(query: string, category: string, listingType: string): void {
        try {
            if (query || category) {
                const filteredList = this.dataSet.filter((item: TData): boolean | void => {
                    if (item && item.displayTextEn) {
                        item.name = item.displayTextEn;
                        const lowerItem = item.displayTextEn.toLowerCase();
                        const lowerQuery = query.toLowerCase();
                        const includesSupported = (Array.prototype as any).includes !== undefined;
                        return includesSupported
                            ? lowerItem.includes(lowerQuery)
                            : lowerItem.indexOf(lowerQuery) !== -1;
                    }
                });

                const hasResults = filteredList.length !== 0;
                const result: TState = {
                    hasListUpdated: true,
                    list: hasResults ? filteredList : this.dataSet,
                    selection: [...this.resultSet.selection]
                };
                this.setHeadingElement(listingType);
                this.setData(result);

                this.arrowCounter = -1;
                this.showNoResultMessage(hasResults);
            } else {
                throw new Error("param not found: query");
            }
        } catch (e) {
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
    public handleSuggesterResponseData(resp: TSuggesterResponse, category: string, query: string): void {
        try {
            if (resp && category && query) {
                this.dataSet = resp.resultList[category];
                this.filterAndFillDataIntoListing(query, category, "sug");
            } else {
                throw new Error("param not found: resp , category, query");
            }
        } catch (e) {
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
    public handleApiResponse(
        promise: Promise<TResponse>,
        category: string,
        query: string,
        listingType: string
    ): void {
        try {
            if (promise) {
                promise.then((resp: TRecentSearchResponse | TSuggesterResponse) => {
                    if (resp) {
                        if (listingType) {
                            switch (listingType) {
                                case "rc":
                                    this.handleRelatedSearchResponseData(resp, category);
                                    break;
                                case "sug":
                                    this.handleSuggesterResponseData(resp, category, query);
                                    break;
                            }
                        } else {
                            throw new Error("listingType not passed as a param");
                        }
                    } else {
                        throw new Error("Promise resulted in Error - sendXHR-helper.ts");
                    }
                });
            } else {
                throw new Error("Promise expected as parameter - Not Found");
            }
        } catch (e) {
            console.error("Error occured in handle Response" + e);
        }
    }

    /**
     * Hides the no result message present on the listing element
     * when no results are there in the listing element
     * @param {hasResults} : {boolean} : Boolean flag that checks whether results are there or not
     * @returns: {void}
     */
    public hidesNoResultMessage(hasResults: boolean): void {
        this.noResultElement.style.display = hasResults ? "block" : "none";
    }

    /**
     * Shows the no result message present on the listing element
     * when there are results in the listing element
     * @param {hasResults} : {boolean}
     * @returns: {void}
     */
    public showNoResultMessage(hasResults: boolean): void {
        this.noResultElement.style.display = hasResults ? "none" : "block";
    }

    /***
     *
     */
    public handleArrow(direction: string): void {
        /** get list of all li items */
        const listItems = this.listingElement.querySelectorAll("li");

        /** determine the direction */
        const isGoingUp = direction === "up";
        const isGoingDown = direction === "down";

        if (isGoingDown === true) {
            /** counter is by default at -1 for first selection i.e. index 0 */
            const currentElement: HTMLElement = listItems[this.arrowCounter + 1];

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
    }

    public setData(newData: TState): void {
        // This logic executes when SelectBox is provided with the data first time
        const isDataForFirstTime = newData.construct;
        if (isDataForFirstTime) {
            this.dataSet = newData.list ? newData.list : [];
            newData.hasListUpdated = true;
        }

        this.resultSet = {
            list: newData.list || [],
            selection: newData.selection || [],
            hasListUpdated: newData.hasListUpdated
        };

        this.notifyObservers();
    }

    public registerObserver(o: TObserver): void {
        this.listObserverCollection.push(o);
    }

    public unregisterObserver(o: TObserver): void {
        const index = this.listObserverCollection.indexOf(o);
        this.listObserverCollection.splice(index, 1);
    }

    public notifyObservers(): void {
        console.log(this.resultSet);
        for (const observer of this.listObserverCollection) {
            observer.update(this.resultSet);
        }
    }

    public deleteSelection(name: string): void {
        try {
            if (this.resultSet.selection) {
                const result: TState = {
                    hasListUpdated: false,
                    list: [...this.resultSet.list],
                    selection: [
                        ...this.resultSet.selection.filter(
                            (item) => item.name !== name
                        )
                    ]
                };

                this.setInputElement(name);
                this.setData(result);
            }
        } catch (e) {
            console.warn("Error occurred while deletion of selected String", e);
        }
    }

    public setInputElement(name: string): void {
        try {
            this.inputElement.value = name;
        } catch (e) {
            throw new Error("Error occurred while prefilling data");
        }
    }
}

export default SelectBoxInput;
