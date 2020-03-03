import { TObserver, TData, TState, TSubject, TOptions } from "./interface";

interface TSetState extends TState {
    construct?: boolean;
}
class SelectBoxInput implements TSubject {
    public resultSet: TState = {
        list: [],
        selection: [],
        hasListUpdated: true
    };

    public lisitingElement: HTMLElement;
    public displayElement: HTMLElement;
    public arrowCounter = -1;
    public noResultElement: HTMLElement = document.createElement("p");

    private inputElement: HTMLInputElement;
    private dataSet: TData[] = [];
    private selectLimit: number;
    private listObserverCollection: TObserver[] = [];
    private displayListOnFocus = false;

    constructor (options: TOptions) {
        this.inputElement = options.inputElement;
        this.displayElement = options.displayElement;
        this.lisitingElement = options.lisitingElement;
        this.selectLimit = options.selectLimit || 1;
        this.displayListOnFocus = options.displayListOnFocus || false;

        this.inputElement.addEventListener("keydown", (e) => this.handleBackspace(e));
        this.inputElement.addEventListener("keyup", (e) => this.onKeyUp(e));
        this.lisitingElement.addEventListener("click", (e: MouseEvent) => {
            const target: HTMLElement | null = (e.target as HTMLElement);
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

    public handleDocumentBlur (e: MouseEvent): void {
        try {
            const eventPath: HTMLElement[] = (e as any).path;
            const hasNotClickedOnListing = eventPath.indexOf(this.lisitingElement) === -1;
            const hasNotClickedOnInput = eventPath.indexOf(this.inputElement) === -1;

            if (hasNotClickedOnListing && hasNotClickedOnInput) {
                this.handleListingDisplayStateOn("blur");
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public handleListingDisplayStateOn (eventType: string): void {
        this.lisitingElement.style.display = eventType === "focus" ? "block" : "none";
    }

    public handleSelect (target: HTMLElement): void {
        const selectedObjStr: string = target.getAttribute("data-obj") || "";
        const selectedObj: TData = JSON.parse(selectedObjStr);
        if (selectedObj) {
            const selectionLimitExceeded: boolean = this.selectLimit > 1 ? this.resultSet.selection.length + 1 > this.selectLimit : false;
            const isLastSelectionNow: boolean = this.resultSet.selection.length + 1 >= this.selectLimit;
            const isDuplicate: boolean = this.resultSet.selection.filter((item) => item.id === selectedObj.id).length > 0;

            if (selectedObj && isDuplicate === false) {
                if (selectionLimitExceeded === false) {
                    const selection = this.selectLimit === 1 ? [selectedObj] : [...this.resultSet.selection, selectedObj];
                    const result: TState = {
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

    public handleBackspace (e: KeyboardEvent): void {
        const which = e.which;
        const query = (e.target as HTMLInputElement).value.trim();
        const isQueryEmpty: boolean = query === "";

        if (which === 8) {
            const lastIndexOfSelection: number = this.resultSet.selection.length - 1;
            const lastId: string | null = lastIndexOfSelection >= 0 ? this.resultSet.selection[lastIndexOfSelection].id : null;
            if (isQueryEmpty === true && lastId !== null) {
                this.deleteSelection(lastId);
                this.handleListingDisplayStateOn("focus");
            }
        }
    }

    public onKeyUp (e: KeyboardEvent): void {
        const query: string = e && e.target && (e.target as HTMLInputElement).value ? (e.target as HTMLInputElement).value.trim() : "";
        const which: number = e.which;

        switch (which) {
        case 9: // Tab pressed
            this.handleListingDisplayStateOn("blur");
            return;

        case 13: // Enter
            // eslint-disable-next-line no-case-declarations
            const listItem: HTMLElement|null = this.lisitingElement.querySelector(".active");
            if (listItem) {
                this.handleSelect(listItem);
            }
            return;

        case 38: // Up arrow
            this.handleArrow("up");
            return;

        case 40: // Down arrow
            this.handleArrow("down");
            return;

        default: // Default filtering logic
            // eslint-disable-next-line no-case-declarations
            const filteredList = this.dataSet.filter((item) => {
                const lowerItem = item.name.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const includesSupported = Array.prototype.includes !== undefined;
                return includesSupported ? lowerItem.includes(lowerQuery) : lowerItem.indexOf(lowerQuery) !== -1;
            });

            // eslint-disable-next-line no-case-declarations
            const hasResults = filteredList.length !== 0;
            // eslint-disable-next-line no-case-declarations
            const result: TState = {
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

    public showNoResultMessage (hasResults: boolean): void {
        try {
            this.noResultElement.style.display = hasResults ? "none" : "block";
        } catch (err) {
            console.warn(err.message);
        }
    }

    public handleArrow (direction: string): void {
        try {
            /** get list of all li items */
            const listItems = this.lisitingElement.querySelectorAll("li");

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
            console.log(this.arrowCounter);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public setData (newData: TSetState): void {
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
        } catch (err) {
            console.warn(err.message);
        }
    }

    public registerObserver (o: TObserver): void {
        try {
            this.listObserverCollection.push(o);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public unregisterObserver (o: TObserver): void {
        try {
            const index = this.listObserverCollection.indexOf(o);
            this.listObserverCollection.splice(index, 1);
        } catch (err) {
            console.warn(err.message);
        }
    }

    public notifyObservers (): void {
        try {
            for (const observer of this.listObserverCollection) {
                observer.update(this.resultSet);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public deleteSelection (id: string): void {
        const result: TState = {
            hasListUpdated: false,
            list: [...this.resultSet.list],
            selection: [...this.resultSet.selection.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10))]
        };
        this.setData(result);
    }
}

export default SelectBoxInput;
