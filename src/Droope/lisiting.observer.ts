import { TSubject, TObserver, TState } from "./interface";
class Listing implements TObserver {
    private subject: TSubject;

    constructor(subject: TSubject) {
        this.subject = subject;
        this.subject.registerObserver(this);
    }

    public generateList(newData: TState): HTMLElement {
        const list: HTMLElement = document.createElement("UL");
        const listLimit: number | undefined = this.subject.config.listLimit;
        let index: number = 1;
        for (const item of newData.list) {
            const liElement: HTMLElement = document.createElement("LI");
            liElement.textContent = item.name;
            liElement.classList.add("list-item");
            liElement.setAttribute("data-obj", JSON.stringify(item));
            list.appendChild(liElement);
            if (listLimit && index >= listLimit) {
                break;
            }
            ++index;
        }
        return list;
    }

    public appendList(list: HTMLElement): void {
        try {
            const { noResultElement } = this.subject;
            const { lisitingElement } = this.subject.config;
            if (lisitingElement) {
                lisitingElement.innerHTML = "";
                lisitingElement.appendChild(noResultElement);
                lisitingElement.appendChild(list);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }

    public update(newData: TState): void {
        try {
            if (newData.hasListUpdated) {
                const list: HTMLElement = this.generateList(newData);
                this.appendList(list);
            }
        } catch (err) {
            console.warn(err.message);
        }
    }
}

export default Listing;
