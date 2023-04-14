export interface IPage {
    render(): void;
}

export type TPageSwitcher = (page: string | IPage) => void;