import data from "./data";

interface IData {
    id: string;
    name: string;
}

interface ISubject {
    lisitingElement: HTMLElement;
    displayElement: HTMLElement;
    noResultElement: HTMLElement;
    arrowCounter: number;
    resultSet: IState;
    registerObserver(o: IObserver): void;
    unregisterObserver(o: IObserver): void;
    notifyObservers(): void;
    deleteSelection(id: string): void;
    setData(data: IState): void;
}

interface IState {
    list: IData[];
    selection: IData[];
    hasListUpdated: boolean;
}

interface IObserver {
    update(arrayOfObjects: IState): void;
}

interface IOptions {
    inputElement: HTMLInputElement;
    lisitingElement: HTMLElement;
    displayElement: HTMLElement;
    selectLimit?: number;
    displayListOnFocus?: boolean;
    displayDecorationList?: string[];
    noResultErrorMessage?: string;
}

class SelectBoxInput implements ISubject {
    public resultSet: IState = {
        list: [],
        selection: [],
        hasListUpdated: true
    };

    public lisitingElement: HTMLElement;
    public displayElement: HTMLElement;
    public arrowCounter = -1;
    public noResultElement: HTMLElement | null = null;

    private inputElement: HTMLInputElement;
    private dataSet: IData[] = [];
    private selectLimit: number;
    private listObserverCollection: IObserver[] = [];
    private displayListOnFocus = false;

    constructor (options: IOptions) {
        this.inputElement = options.inputElement;
        this.displayElement = options.displayElement;
        this.lisitingElement = options.lisitingElement;
        this.selectLimit = options.selectLimit || 1;
        this.displayListOnFocus = options.displayListOnFocus || false;

        this.inputElement.addEventListener("keydown", e => this.handleBackspace(e));
        this.inputElement.addEventListener("keyup", e => this.onKeyUp(e));
        this.lisitingElement.addEventListener("click", e => this.handleSelect(e.target));

        if (this.displayListOnFocus === true) {
            document.addEventListener("click", e => this.handleDocumentBlur(e));
            this.inputElement.addEventListener("focus", e => this.handleListingDisplayStateOn(e.type));

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

    public handleDocumentBlur (event: any) {
        const eventPath: HTMLElement[] = event.path;
        const hasNotClickedOnListing = eventPath.indexOf(this.lisitingElement) === -1;
        const hasNotClickedOnInput = eventPath.indexOf(this.inputElement) === -1;

        if (hasNotClickedOnListing && hasNotClickedOnInput) {
            this.handleListingDisplayStateOn("blur");
        }
    }

    public handleListingDisplayStateOn (eventType: string) {
        this.lisitingElement.style.display = eventType === "focus" ? "block" : "none";
    }

    public handleSelect (target: any) {
        const selectedObj: any = JSON.parse(target.getAttribute("data-obj"));
        if (selectedObj) {
            const selectionLimitExceeded: boolean = this.selectLimit > 1 ? this.resultSet.selection.length + 1 > this.selectLimit : false;
            const isLastSelectionNow: boolean = this.resultSet.selection.length + 1 >= this.selectLimit;
            const isDuplicate: boolean = this.resultSet.selection.filter(item => item.id === selectedObj.id).length > 0;

            if (selectedObj && isDuplicate === false) {
                if (selectionLimitExceeded === false) {
                    const selection = this.selectLimit === 1 ? [selectedObj] : [...this.resultSet.selection, selectedObj];
                    const result: IState = {
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

    public handleBackspace (e: KeyboardEvent) {
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

    public onKeyUp (e: KeyboardEvent) {
        const query: string = e && e.target && (e.target as HTMLInputElement).value ? (<HTMLInputElement>e.target).value.trim() : "";
        const which: number = e.which;

        switch (which) {
        case 9: // Tab pressed
            this.handleListingDisplayStateOn("blur");
            return;

        case 13: // Enter
            // eslint-disable-next-line no-case-declarations
            const listItem = this.lisitingElement.querySelector(".active");
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
            const filteredList = this.dataSet.filter(item => {
                const lowerItem = item.name.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const includesSupported = Array.prototype.includes !== undefined;
                return includesSupported ? lowerItem.includes(lowerQuery) : lowerItem.indexOf(lowerQuery) !== -1;
            });

            // eslint-disable-next-line no-case-declarations
            const hasResults = filteredList.length !== 0;
            // eslint-disable-next-line no-case-declarations
            const result: IState = {
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

    public showNoResultMessage (hasResults: boolean) {
        this.noResultElement.style.display = hasResults ? "none" : "block";
    }

    public handleArrow (direction: string): void {
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
    }

    public setData (newData: any): void {
        // This logic executes when SelectBox is provided with the data first time
        // eslint-disable-next-line no-prototype-builtins
        const isDataForFirstTime = newData.hasOwnProperty("construct");
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

    public registerObserver (o: IObserver) {
        this.listObserverCollection.push(o);
    }

    public unregisterObserver (o: IObserver) {
        const index = this.listObserverCollection.indexOf(o);
        this.listObserverCollection.splice(index, 1);
    }

    public notifyObservers (): void {
        for (const observer of this.listObserverCollection) {
            observer.update(this.resultSet);
        }
    }

    public deleteSelection (id: string) {
        const result: IState = {
            hasListUpdated: false,
            list: [...this.resultSet.list],
            selection: [...this.resultSet.selection.filter(item => parseInt(item.id, 10) !== parseInt(id, 10))]
        };
        this.setData(result);
    }
}

class Listing implements IObserver {
    private subject: ISubject;

    constructor (subject: ISubject) {
        this.subject = subject;
        this.subject.registerObserver(this);
    }

    public generateAndAppendList (newData: IState): HTMLElement {
        const ulElement: HTMLElement = document.createElement("UL");

        newData.list.forEach(item => {
            const liElement: HTMLElement = document.createElement("LI");
            liElement.textContent = item.name;
            liElement.setAttribute("data-obj", JSON.stringify(item));
            ulElement.appendChild(liElement);
        });

        if (this.subject.lisitingElement) {
            this.subject.lisitingElement.innerHTML = "";
            this.subject.lisitingElement.appendChild(this.subject.noResultElement);
            this.subject.lisitingElement.appendChild(ulElement);
        }

        return ulElement;
    }

    public update (newData: IState) {
        if (newData.hasListUpdated) {
            this.generateAndAppendList(newData);
        }
    }
}

class SelectDisplay implements IObserver {
    public subject: ISubject;
    public decorator: any;
    public displayDecorationList: string[];

    constructor (subject: ISubject, displayDecorationList: string[] = []) {
        this.subject = subject;
        this.subject.registerObserver(this);
        this.decorator = new SelectDisplayDecorator(subject);
        this.displayDecorationList = displayDecorationList;
    }

    public buildView (newData: IData[]): HTMLElement {
        const view: HTMLElement = document.createElement("UL");

        newData.map((item: IData) => {
            const listItem: HTMLElement = document.createElement("LI");
            listItem.textContent = item.name;
            listItem.classList.add("selection-item");
            listItem.setAttribute("data-obj", JSON.stringify(item));
            view.appendChild(listItem);
        });
        return view;
    }

    public update (newData: any): void {
        const { selection } = newData;
        let view = this.buildView(selection);
        this.displayDecorationList.map(decorationName => {
            view = this.decorator.add(view, decorationName);
        });

        this.subject.displayElement.innerHTML = "";
        this.subject.displayElement.appendChild(view);
    }
}

class SelectDisplayDecorator {
    public subject: ISubject;

    constructor (subject: ISubject) {
        this.subject = subject;
    }

    public add (view: HTMLElement, type: string) {
        switch (type) {
        case "chips": return this.chips(view);
            // case "makeItGlow" : return this.makeItGlow(view);
        default: return view;
        }
    }

    // public makeItGlow(view: HTMLElement) : HTMLElement {
    //     const list = view.querySelectorAll("li");

    //     list.forEach( (li: HTMLElement) => {
    //         li.style.boxShadow = "gold 0px 0px 10px 1px";
    //     });

    //     return view;
    // }

    public chips (view: HTMLElement): HTMLElement {
        const list = view.querySelectorAll("li");

        list.forEach((li: HTMLElement) => {
            const chipJsonString = li.getAttribute("data-obj");
            const chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};

            const crossIcon: HTMLElement = document.createElement("SPAN");
            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);

            li.appendChild(crossIcon);
        });

        /** TODO */
        view.addEventListener("click", ({ target }: any) => {
            if (target) {
                const deleteId = target.getAttribute("data-id");
                if (deleteId) {
                    const result: IState = {
                        hasListUpdated: false,
                        list: [...this.subject.resultSet.list],
                        selection: [...this.subject.resultSet.selection.filter(item => parseInt(item.id, 10) !== parseInt(deleteId, 10))]
                    };
                    this.subject.setData(result);
                }
            }
        });

        return view;
    }
}

const inputElement: HTMLInputElement | null = document.querySelector(".select-box-input");
const lisitingElement: HTMLElement | null = document.querySelector(".select-box-listing");
const displayElement: HTMLElement | null = document.querySelector(".select-box-display");

if (inputElement && lisitingElement && displayElement) {
    const options: IOptions = {
        inputElement,
        lisitingElement,
        displayElement,
        selectLimit: 3,
        displayListOnFocus: true,
        displayDecorationList: ["chips"],
        noResultErrorMessage: "Sorry no result"
    };

    const SelectBox = new SelectBoxInput(options);
    new Listing(SelectBox);
    new SelectDisplay(SelectBox, options.displayDecorationList);

    SelectBox.setData({
        list: data,
        construct: true
    });
}
