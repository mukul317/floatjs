import { TSubject, TObserver, TData, TState } from "./interface";

class SelectDisplay implements TObserver {
    public subject: TSubject;
    private view: HTMLElement;

    constructor(subject: TSubject) {
        this.subject = subject;
        this.subject.registerObserver(this);
        this.view = document.createElement("UL");

        if (this.subject.config.tagSelectedValues) {
            this.onCrossClick();
        }
    }

    public generateDisplayHtml(selectedValues: TData[]): HTMLElement {
        try {
            /** @todo: Object vs DOM difffing */
            this.view.innerHTML = "";
            const { tagSelectedValues } = this.subject.config;
            selectedValues.forEach((item: TData) => {
                if (tagSelectedValues) {
                    const listItem: HTMLElement = document.createElement("LI");
                    // this.config.displayEle.value = [].join(",")
                    listItem.textContent = item.name;
                    listItem.classList.add("selection-item");
                    listItem.setAttribute("data-obj", JSON.stringify(item));
                    if (tagSelectedValues) {
                        this.tagDecorator(listItem);
                    }
                    this.view.appendChild(listItem);
                }
            });
            return this.view;
        } catch (err) {
            console.warn(err);
            return this.view;
        }
    }

    public appendMarkup(selectedHtml: Element): void {
        try {
            const { displayElement } = this.subject.config;
            if (displayElement && displayElement.nodeName !== "INPUT") {
                displayElement.innerHTML = "";
                displayElement.appendChild(selectedHtml);
            } else if (displayElement && displayElement.nodeName === "INPUT") {
                console.log("selected HTml text", selectedHtml);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    public update(state: TState): void {
        try {
            const { selection, hasSelectionUpdated } = state;

            const { tagSelectedValues } = this.subject.config;
            if (hasSelectionUpdated === true) {
                if (tagSelectedValues) {
                    const selectedHtml: HTMLElement = this.generateDisplayHtml(selection);
                    this.appendMarkup(selectedHtml);
                } else {
                    this.generateDefaultDisplay(state);
                }

                console.info("[Notified]: Suggester Select Observer with UPDATE");
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public generateDefaultDisplay(state: TState): void{
        try {
            const { selection, query } = state;
            const selectionList: string[] = selection.map((item) => item.name);

            // let queryComplete: string = (this.subject.config.displayElement as HTMLInputElement).value;
            // queryComplete = queryComplete + query;
            let queryComplete: string;
            if (selectionList.length > 0) {
                queryComplete = selectionList.join(",") + "," + query;
            } else {
                queryComplete = query;
            }
            (this.subject.config.displayElement as HTMLInputElement).value = queryComplete;
        } catch (e) {
            console.warn("Error occurred while updating display : ", e);
        }
    }

    public tagDecorator(listItem: HTMLElement): HTMLElement {
        try {
            const chipJsonString = listItem.getAttribute("data-obj");
            const chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};
            const crossIcon: HTMLElement = document.createElement("SPAN");

            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);
            listItem.classList.add("tag");
            listItem.appendChild(crossIcon);

            return listItem;
        } catch (err) {
            console.warn(err.message);
            return listItem;
        }
    }

    public onCrossClick(): void {
        try {
            this.view.addEventListener("click", (e: MouseEvent) => {
                if (e.target) {
                    try {
                        const toBeDeletedId = (e.target as HTMLElement).getAttribute("data-id");
                        if (toBeDeletedId && toBeDeletedId !== "") {
                            this.subject.removeSelection(parseInt(toBeDeletedId, 10));
                        }
                    } catch (err) {
                        console.warn(err.message);
                    }
                }
            });
        } catch (err) {
            console.warn(err);
        }
    }
}

export default SelectDisplay;
