"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectDisplay {
    constructor(subject, displayDecorationList = []) {
        this.subject = subject;
        this.subject.registerObserver(this);
        // this.decorator = new SelectDisplayDecorator(subject);
        this.displayDecorationList = displayDecorationList;
    }
    buildView(newData) {
        const view = document.createElement("UL");
        newData.map((item) => {
            const listItem = document.createElement("LI");
            listItem.textContent = item.name;
            listItem.classList.add("selection-item");
            listItem.setAttribute("data-obj", JSON.stringify(item));
            view.appendChild(listItem);
        });
        return view;
    }
    update(newData) {
        const { selection } = newData;
        const view = this.buildView(selection);
        // this.displayDecorationList.map(decorationName => {
        //     view = this.decorator.add(view, decorationName);
        // });
        this.subject.displayElement.innerHTML = "";
        this.subject.displayElement.appendChild(view);
    }
}
exports.default = SelectDisplay;
//# sourceMappingURL=display.observer.js.map