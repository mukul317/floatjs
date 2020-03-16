interface TData {
    id: string;
    name: string;
}

interface TSubject {
    lisitingElement: HTMLElement | null;
    displayElement: HTMLElement | null;
    noResultElement: HTMLElement | null;
    arrowCounter: number;
    resultSet: TState;
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

interface TOptions {
    inputElement: HTMLInputElement;
    lisitingElement: HTMLElement;
    displayElement: HTMLElement;
    selectLimit?: number;
    displayListOnFocus?: boolean;
    displayDecorationList?: string[];
    noResultErrorMessage?: string;
}

export {
    TData,
    TSubject,
    TState,
    TObserver,
    TOptions
};
