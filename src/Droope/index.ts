import { TDroopeConfig, TSubject } from "./interface";
import DroopeSubject from "./droope.subject";
import ListObserver from "./lisiting.observer";
import DisplayObserver from "./display.observer";

const Droope = (options: TDroopeConfig): TSubject => {
    const SelectBox = new DroopeSubject(options);
    new ListObserver(SelectBox);
    new DisplayObserver(SelectBox);
    SelectBox.init();
    return SelectBox;
};

export default Droope;
