"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listing {
    constructor(subject) {
        this.subject = subject;
        this.subject.registerObserver(this);
    }
    generateAndAppendList(newData) {
        const ulElement = document.createElement("UL");
        newData.list.forEach((item) => {
            const liElement = document.createElement("LI");
            liElement.textContent = item.name;
            liElement.classList.add("list-item");
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
    update(newData) {
        if (newData.hasListUpdated) {
            this.generateAndAppendList(newData);
        }
    }
}
exports.default = Listing;
//# sourceMappingURL=lisiting.observer.js.map