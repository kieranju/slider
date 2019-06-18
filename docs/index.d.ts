declare abstract class SlideOptions {
    debug: boolean;
    waitForImages: boolean;
    tickTime: number;
    tockTime: number;
    activeClassName: string;
    loadedClassName: string;
}
declare class SlideHandler {
    private options;
    private slides;
    private deckSelector;
    private cardSelector;
    constructor(options: SlideOptions);
    private init;
    private groupBy;
}
declare class Slide {
    private options;
    private deck;
    private cards;
    private clock;
    private active;
    constructor(deck: HTMLElement, cards: HTMLElement[], options: SlideOptions);
    private init;
    start(): void;
    pause(): void;
    private tick;
    private tock;
    private activate;
    private deactivate;
    private validate;
}
