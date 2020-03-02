import { TOptions, TData, TSubject } from "./interface";
import DroopeSubject from "./droope.subject";
import ListObserver from "./lisiting.observer";
import DisplayObserver from "./display.observer";

const Droope = (options: TOptions, data: TData[]): TSubject => {
    const SelectBox = new DroopeSubject(options);
    new ListObserver(SelectBox);
    new DisplayObserver(SelectBox, options.displayDecorationList);
    SelectBox.setData({ list: data, construct: true });
    return SelectBox;
};

export default Droope;
