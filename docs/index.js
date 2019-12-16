var SlideOptions = (function () {
    function SlideOptions() {
        this.debug = false;
        this.tickTime = 300;
        this.tockTime = 1000;
        this.activeClassName = 'active';
        this.loadedClassName = 'loaded';
        this.afterPageLoad = true;
    }
    return SlideOptions;
}());
var SlideHandler = (function () {
    function SlideHandler(options) {
        this.slides = [];
        this.deckSelector = 'data-slider-deck';
        this.cardSelector = 'data-slider-card';
        this.options = options;
        this.init();
    }
    SlideHandler.prototype.init = function () {
        var _this = this;
        var decks = Array.from(document.querySelectorAll("[" + this.deckSelector + "]"));
        var cards = Array.from(document.querySelectorAll("[" + this.cardSelector + "]"));
        var cardGroups = this.groupBy(cards, function (receiver) { return receiver.getAttribute(_this.cardSelector); });
        decks.forEach(function (deck) {
            var key = deck.getAttribute(_this.deckSelector);
            var cardGroup = cardGroups.get(key);
            _this.slides.push(new Slide(deck, cardGroup, _this.options));
        });
    };
    SlideHandler.prototype.groupBy = function (items, callback) {
        var itemGroups = new Map();
        items.map(function (item) {
            var key = callback(item);
            var itemGroup = itemGroups.get(key);
            if (!itemGroup) {
                itemGroups.set(key, [item]);
            }
            else {
                itemGroup.push(item);
                itemGroups.set(key, itemGroup);
            }
        });
        return itemGroups;
    };
    return SlideHandler;
}());
var Slide = (function () {
    function Slide(deck, cards, options) {
        var _this = this;
        this.active = 0;
        this.deck = deck;
        this.cards = cards;
        this.options = options;
        if (this.options.afterPageLoad && window) {
            window.addEventListener('load', function () {
                _this.init();
            }, false);
        }
        else {
            this.init();
        }
    }
    Slide.prototype.init = function () {
        if (this.options.debug && !this.validate()) {
            return;
        }
        this.start();
    };
    Slide.prototype.start = function () {
        if (this.clock) {
            return;
        }
        this.deck.classList.add(this.options.loadedClassName);
        this.activate(this.active);
        this.tick();
    };
    Slide.prototype.pause = function () {
        if (!this.clock) {
            return;
        }
        this.clock = clearInterval(this.clock);
    };
    Slide.prototype.tick = function () {
        var _this = this;
        this.clock = setInterval(function () { return _this.tock(); }, this.options.tockTime);
    };
    Slide.prototype.tock = function () {
        var _this = this;
        var currentActive = this.active;
        var nextActive = (currentActive + 1);
        if (nextActive === this.cards.length) {
            this.active = 0;
            this.deactivate(currentActive);
            setTimeout(function () { return _this.activate(_this.active); }, this.options.tickTime);
            return;
        }
        this.active = nextActive;
        this.activate(nextActive);
        setTimeout(function () { return _this.deactivate(currentActive); }, this.options.tickTime);
    };
    Slide.prototype.activate = function (index) {
        this.cards[index].classList.add(this.options.activeClassName);
    };
    Slide.prototype.deactivate = function (index) {
        this.cards[index].classList.remove(this.options.activeClassName);
    };
    Slide.prototype.validate = function () {
        var _this = this;
        if (!this.deck) {
            console.error('Unable to target deck element.');
            return false;
        }
        if (this.cards.length < 2) {
            console.error('Not enough cards in the deck.');
            return false;
        }
        var invalidCard = false;
        this.cards.forEach(function (card, index) {
            if (!card) {
                invalidCard = true;
                console.error("Unable to target card " + (index + 1) + " of " + _this.cards.length + ".", _this.cards);
                return;
            }
        });
        return !invalidCard;
    };
    return Slide;
}());
