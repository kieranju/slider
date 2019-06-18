abstract class SlideOptions {
    debug: boolean = false
    tickTime: number = 300
    tockTime: number = 1000
    activeClassName: string = 'active'
    loadedClassName: string = 'loaded'
    afterPageLoad: boolean = true
}

class SlideHandler {
    private options: SlideOptions
    private slides: Slide[] = []
    private deckSelector: string = 'data-slider-deck'
    private cardSelector: string = 'data-slider-card'

    constructor(options: SlideOptions) {
        this.options = options
        this.init()
    }

    private init() {
        const decks = Array.from(document.querySelectorAll(`[${this.deckSelector}]`) as NodeListOf<HTMLElement>)
        const cards = Array.from(document.querySelectorAll(`[${this.cardSelector}]`) as NodeListOf<HTMLElement>)
        const cardGroups = this.groupBy(cards, receiver => receiver.getAttribute(this.cardSelector) as string)

        decks.forEach((deck) => {
            const key = deck.getAttribute(this.deckSelector) as string
            const cardGroup = cardGroups.get(key) as HTMLElement[]
            this.slides.push(new Slide(deck, cardGroup, this.options))
        })
    }

    private groupBy(items: HTMLElement[], callback: (item: HTMLElement) => string): Map<string, HTMLElement[]> {
        const itemGroups: Map<string, HTMLElement[]> = new Map()
        items.map((item) => {
            const key = callback(item)
            const itemGroup = itemGroups.get(key)
            if (!itemGroup) {
                itemGroups.set(key, [item])
            } else {
                itemGroup.push(item)
                itemGroups.set(key, itemGroup)
            }
        })

        return itemGroups
    }
}

class Slide {
    private options: SlideOptions
    private deck: HTMLElement
    private cards: HTMLElement[]
    private clock: any
    private active: number = 0

    constructor(deck: HTMLElement, cards: HTMLElement[], options: SlideOptions) {
        this.deck = deck
        this.cards = cards
        this.options = options

        if (this.options.afterPageLoad && window) {
            window.addEventListener('load', () => {
                this.init()
            })
        } else {
            this.init()
        }
    }

    private init() {
        if (this.options.debug && !this.validate()) {
            return
        }

        this.start()
    }

    public start() {
        if (this.clock) {
            return
        }

        this.deck.classList.add(this.options.loadedClassName)
        this.activate(this.active)
        this.tick()
    }

    public pause() {
        if (!this.clock) {
            return
        }

        this.clock = clearInterval(this.clock)
    }

    private tick() {
        this.clock = setInterval(() => this.tock(), this.options.tockTime)
    }

    private tock() {
        let currentActive = this.active
        let nextActive = (currentActive + 1)

        if (nextActive === this.cards.length) {
            // Cycle back to the first element, fade out the last element
            this.active = 0
            this.deactivate(currentActive)
            setTimeout(() => this.activate(this.active), this.options.tickTime)
            return
        }

        // Cycle to the next element, fade it in
        this.active = nextActive
        this.activate(nextActive)
        setTimeout(() => this.deactivate(currentActive), this.options.tickTime)
    }

    private activate(index: number) {
        this.cards[index].classList.add(this.options.activeClassName)
    }

    private deactivate(index: number) {
        this.cards[index].classList.remove(this.options.activeClassName)
    }

    private validate(): boolean {
        if (!this.deck) {
            console.error('Unable to target deck element.')
            return false
        }

        if (this.cards.length < 2) {
            console.error('Not enough cards in the deck.')
            return false
        }

        let invalidCard = false
        this.cards.forEach((card, index) => {
            if (!card) {
                invalidCard = true
                console.error(`Unable to target card ${index + 1} of ${this.cards.length}.`, this.cards)
                return
            }
        })

        return !invalidCard
    }
}