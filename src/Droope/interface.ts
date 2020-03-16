interface TData {
    id: string;
    name: string;
}
interface TSubject {
    config: TDroopeConfig;
    arrowCounter: number;
    state: TState;
    noResultElement: HTMLElement;
    registerObserver(o: TObserver): void;
    unregisterObserver(o: TObserver): void;
    notifyObservers(): void;
    deleteSelection(id: string): void;
    setData(data: TState): void;
}

interface TState {
    list: TData[];
    selection: TData[];
    hasListUpdated: boolean;
}

interface TObserver {
    update(arrayOfObjects: TState): void;
}
interface TDroopeConfig {
    inputElement: HTMLInputElement | null;
    lisitingElement: HTMLElement | null;
    displayElement: HTMLElement | null;
    selectLimit?: number;
    displayListOnFocus?: boolean;
    displayDecorationList?: string[];
    noResultErrorMessage?: string;
    tagSelectedValues: boolean;
}

export {
    TData,
    TSubject,
    TState,
    TObserver,
    TDroopeConfig
};
