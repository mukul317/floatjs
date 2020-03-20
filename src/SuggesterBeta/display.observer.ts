import { TSubject, TObserver, TData } from "./interface";

class SelectDisplay implements TObserver {
    public subject: TSubject
    public decorator: any;
    public displayDecorationList: string[]
    public displayListStyle: string;

    constructor(subject: TSubject, displayDecorationList: any[] = []) {
        this.subject = subject;
        this.subject.registerObserver(this);
        // this.decorator = new SelectDisplayDecorator(subject);
        this.displayDecorationList = displayDecorationList;
        this.displayListStyle = this.subject.displayListStyle;
    }

    public buildView(newData: TData[]): HTMLElement {
        const view: HTMLElement = document.createElement("UL");
        view.style.display = "flex";

        newData.map((item: TData) => {
            const listItem: HTMLElement | null = this.createListingDisplayElement(this.displayListStyle, item);
            if (listItem) { view.appendChild(listItem); }
        });
        return view;
    }

    /***
     * CreatelistingDisplayElement creates custom display element based on the config being passed
     * to the Subject. Basically it provides custom styling to the display Element.
     * @access {public}
     * @param displayListStyle: {string} :display list styles to be added to display element
     * @param item: {TData} : item that is being selected
     * @returns {HTMLElement | null}
     */
    public createListingDisplayElement(displayListStyle: string, item: TData): HTMLElement | null {
        let listItem: HTMLElement | null = null;
        try {
            switch (displayListStyle) {
            case "tags":
                listItem = this.createTagElement(item);
                break;
            default:
                listItem = document.createElement("LI");
                listItem.textContent = item.name + ",";
                listItem.setAttribute("data-obj", JSON.stringify(item));
            }
        } catch (e) {
            console.warn("Error occurred while Creating the listing element", e);
        }
        return listItem;
    }

    /***
     * createTagElement creates a tag containing the item details.
     * Basically it provides a tag for the display Element being selected.
     * @access {public}
     * @param item: {TData} : item that is being selected
     * @returns {HTMLElement}
     */
    public createTagElement(item: TData): HTMLElement {
        const listItem: HTMLElement = document.createElement("LI");
        listItem.textContent = item.name;
        listItem.classList.add("selection-item");
        listItem.setAttribute("data-obj", JSON.stringify(item));
        return listItem;
    }

    public update(newData: any): void {
        const { selection } = newData;

        const view = this.buildView(selection);
        // this.displayDecorationList.map(decorationName => {
        //     view = this.decorator.add(view, decorationName);
        // });
        this.subject.displayElement.innerHTML = "";
        this.subject.displayElement.appendChild(view);
    }
}

export default SelectDisplay;
