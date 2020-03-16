import { TSubject, TObserver, TData } from "./interface";

class SelectDisplay implements TObserver {
    public subject: TSubject;
    public decorator: any;
    public displayDecorationList: string[];

    constructor (subject: TSubject, displayDecorationList: any[] = []) {
        this.subject = subject;
        this.subject.registerObserver(this);
        // this.decorator = new SelectDisplayDecorator(subject);
        this.displayDecorationList = displayDecorationList;
    }

    public buildView (newData: TData[]): HTMLElement {
        const view: HTMLElement = document.createElement("UL");

        newData.map((item: TData) => {
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
        const view = this.buildView(selection);
        // this.displayDecorationList.map(decorationName => {
        //     view = this.decorator.add(view, decorationName);
        // });
        const { displayElement } = this.subject.config;
        if (displayElement) {
            displayElement.innerHTML = "";
            displayElement.appendChild(view);
        }
    }
}

export default SelectDisplay;
