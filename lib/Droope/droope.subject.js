"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectBoxInput {
    constructor(options) {
        this.resultSet = {
            list: [],
            selection: [],
            hasListUpdated: true
        };
        this.arrowCounter = -1;
        this.noResultElement = document.createElement("p");
        this.dataSet = [];
        this.listObserverCollection = [];
        this.displayListOnFocus = false;
        this.inputElement = options.inputElement;
        this.displayElement = options.displayElement;
        this.lisitingElement = options.lisitingElement;
        this.selectLimit = options.selectLimit || 1;
        this.displayListOnFocus = options.displayListOnFocus || false;
        this.inputElement.addEventListener("keydown", (e) => this.handleBackspace(e));
        this.inputElement.addEventListener("keyup", (e) => this.onKeyUp(e));
        this.lisitingElement.addEventListener("click", (e) => {
            const target = e.target;
            if (target) {
                this.handleSelect(target);
            }
        });
        if (this.displayListOnFocus === true) {
            document.addEventListener("click", (e) => this.handleDocumentBlur(e));
            this.inputElement.addEventListener("focus", (e) => this.handleListingDisplayStateOn(e.type));
            // Close listing on initialization
            this.handleListingDisplayStateOn("blur");
        }
        if (options.noResultErrorMessage) {
            this.noResultElement.classList.add("no-result");
            this.noResultElement.style.display = "none";
            this.noResultElement.textContent = options.noResultErrorMessage || "";
        }
    }
    handleDocumentBlur(e) {
        try {
            const target = e.target;
            if (target) {
                const hasClickedOnInput = this.inputElement === target;
                const hasClickedOnListItem = target.classList ? target.classList.contains("list-item") : false;
                if (hasClickedOnListItem === false && hasClickedOnInput === false) {
                    this.handleListingDisplayStateOn("blur");
                }
            }
        }
        catch (err) {
            console.warn(err.message);
        }
    }
    handleListingDisplayStateOn(eventType) {
        this.lisitingElement.style.display = eventType === "focus" ? "block" : "none";
    }
    handleSelect(target) {
        const selectedObjStr = target.getAttribute("data-obj") || "";
        const selectedObj = JSON.parse(selectedObjStr);
        if (selectedObj) {
            const selectionLimitExceeded = this.selectLimit > 1 ? this.resultSet.selection.length + 1 > this.selectLimit : false;
            const isLastSelectionNow = this.resultSet.selection.length + 1 >= this.selectLimit;
            const isDuplicate = this.resultSet.selection.filter((item) => item.id === selectedObj.id).length > 0;
            if (selectedObj && isDuplicate === false) {
                if (selectionLimitExceeded === false) {
                    const selection = this.selectLimit === 1 ? [selectedObj] : [...this.resultSet.selection, selectedObj];
                    const result = {
                        hasListUpdated: false,
                        list: [...this.resultSet.list],
                        selection
                    };
                    this.setData(result);
                }
                if (isLastSelectionNow) {
                    this.handleListingDisplayStateOn("blur");
                }
            }
        }
    }
    handleBackspace(e) {
        const which = e.which;
        const query = e.target.value.trim();
        const isQueryEmpty = query === "";
        if (which === 8) {
            const lastIndexOfSelection = this.resultSet.selection.length - 1;
            const lastId = lastIndexOfSelection >= 0 ? this.resultSet.selection[lastIndexOfSelection].id : null;
            if (isQueryEmpty === true && lastId !== null) {
                this.deleteSelection(lastId);
                this.handleListingDisplayStateOn("focus");
            }
        }
    }
    onKeyUp(e) {
        const query = e && e.target && e.target.value ? e.target.value.trim() : "";
        const which = e.which;
        switch (which) {
            case 9: { // Tab pressed
                this.handleListingDisplayStateOn("blur");
                return;
            }
            // ENter
            case 13: {
                const listItem = this.lisitingElement.querySelector(".active");
                if (listItem) {
                    this.handleSelect(listItem);
                }
                return;
            }
            case 38: // Up arrow
                this.handleArrow("up");
                return;
            case 40: {
                // Down arrow
                this.handleArrow("down");
                return;
            }
            default: {
                // Default filtering logic
                const filteredList = this.dataSet.filter((item) => {
                    const lowerItem = item.name.toLowerCase();
                    const lowerQuery = query.toLowerCase();
                    const includesSupported = Array.prototype.includes !== undefined;
                    return includesSupported ? lowerItem.includes(lowerQuery) : lowerItem.indexOf(lowerQuery) !== -1;
                });
                const hasResults = filteredList.length !== 0;
                const result = {
                    hasListUpdated: true,
                    list: hasResults ? filteredList : this.dataSet,
                    selection: [...this.resultSet.selection]
                };
                this.setData(result);
                // Reset counter for arrow keys
                this.arrowCounter = -1;
                this.showNoResultMessage(hasResults);
            }
        }
    }
    showNoResultMessage(hasResults) {
        try {
            this.noResultElement.style.display = hasResults ? "none" : "block";
        }
        catch (err) {
            console.warn(err.message);
        }
    }
    handleArrow(direction) {
        try {
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
        catch (err) {
            console.warn(err.message);
        }
    }
    setData(newData) {
        try {
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
        catch (err) {
            console.warn(err.message);
        }
    }
    registerObserver(o) {
        try {
            this.listObserverCollection.push(o);
        }
        catch (err) {
            console.warn(err.message);
        }
    }
    unregisterObserver(o) {
        try {
            const index = this.listObserverCollection.indexOf(o);
            this.listObserverCollection.splice(index, 1);
        }
        catch (err) {
            console.warn(err.message);
        }
    }
    notifyObservers() {
        try {
            for (const observer of this.listObserverCollection) {
                observer.update(this.resultSet);
            }
        }
        catch (err) {
            console.warn(err.message);
        }
    }
    deleteSelection(id) {
        const result = {
            hasListUpdated: false,
            list: [...this.resultSet.list],
            selection: [...this.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10))]
        };
        this.setData(result);
    }
}
exports.default = SelectBoxInput;
//# sourceMappingURL=droope.subject.js.map