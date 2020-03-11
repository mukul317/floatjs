"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var SelectDisplayDecorator = /** @class */ (function () {
    function SelectDisplayDecorator(subject) {
        this.subject = subject;
    }
    SelectDisplayDecorator.prototype.add = function (view, type) {
        switch (type) {
            case "chips":
                return this.chips(view);
            // case "makeItGlow" : return this.makeItGlow(view);
            default:
                return view;
        }
    };
    // public makeItGlow(view: HTMLElement) : HTMLElement {
    //     const list = view.querySelectorAll("li");
    //     list.forEach( (li: HTMLElement) => {
    //         li.style.boxShadow = "gold 0px 0px 10px 1px";
    //     });
    //     return view;
    // }
    SelectDisplayDecorator.prototype.chips = function (view) {
        var _this = this;
        var list = view.querySelectorAll("li");
        list.forEach(function (li) {
            var chipJsonString = li.getAttribute("data-obj");
            var chipJSON = chipJsonString ? JSON.parse(chipJsonString) : {};
            var crossIcon = document.createElement("SPAN");
            crossIcon.textContent = "clear";
            crossIcon.classList.add("material-icons");
            crossIcon.classList.add("list-cross");
            crossIcon.setAttribute("data-id", chipJSON.id);
            li.appendChild(crossIcon);
        });
        /** TODO */
        view.addEventListener("click", function (e) {
            if (e.target) {
                var deleteId_1 = e.target.getAttribute("data-id");
                if (deleteId_1) {
                    var result = {
                        hasListUpdated: false,
                        list: __spread(_this.subject.resultSet.list),
                        selection: __spread(_this.subject.resultSet.selection.filter(function (item) { return parseInt(item.id, 10) !== parseInt(deleteId_1, 10); }))
                    };
                    _this.subject.setData(result);
                }
            }
        });
        return view;
    };
    return SelectDisplayDecorator;
}());
exports.SelectDisplayDecorator = SelectDisplayDecorator;
//# sourceMappingURL=decorator.js.map