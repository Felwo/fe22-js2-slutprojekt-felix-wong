//Kolla LoginPage.ts för varför jag har gjort på detta sättet
/**
 * I(interface)Page definierar funktionen `render`, som används för att rendera en sida.
 */
export interface IPage {
    render(): void;
}

/**
 * TPageSwitcher är en typ för funktionen som används för att byta sida.
 * Den tar antingen en sträng eller en instans av IPage som argument.
 */
export type TPageSwitcher = (page: string | IPage) => void;