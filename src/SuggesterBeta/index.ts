import { TData, TSubject, TSugConfig } from "./interface";
import SuggesterSubject from "./suggester.subject";
import ListObserver from "./lisiting.observer";
import DisplayObserver from "./display.observer";

const Suggester = (options: TSugConfig, data: TData[]): TSubject => {
    const SelectBox = new SuggesterSubject(options);
    new ListObserver(SelectBox);
    new DisplayObserver(SelectBox, options.displayDecorationList);
    SelectBox.setData({ list: data, construct: false, selection: [], hasListUpdated: false });
    return SelectBox;
};

export default Suggester;