"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SelectDisplay = /** @class */ (function () {
    function SelectDisplay(subject, displayDecorationList) {
        if (displayDecorationList === void 0) { displayDecorationList = []; }
        this.subject = subject;
        this.subject.registerObserver(this);
        // this.decorator = new SelectDisplayDecorator(subject);
        this.displayDecorationList = displayDecorationList;
    }
    SelectDisplay.prototype.buildView = function (newData) {
        var view = document.createElement("UL");
        newData.map(function (item) {
            var listItem = document.createElement("LI");
            listItem.textContent = item.name;
            listItem.classList.add("selection-item");
            listItem.setAttribute("data-obj", JSON.stringify(item));
            view.appendChild(listItem);
        });
        return view;
    };
    SelectDisplay.prototype.update = function (newData) {
        var selection = newData.selection;
        var view = this.buildView(selection);
        // this.displayDecorationList.map(decorationName => {
        //     view = this.decorator.add(view, decorationName);
        // });
        this.subject.displayElement.innerHTML = "";
        this.subject.displayElement.appendChild(view);
    };
    return SelectDisplay;
}());
exports.default = SelectDisplay;
//# sourceMappingURL=display.observer.js.map