class PasswordBruteForce {
    constructor (...charIterators) {
        this.iterators = charIterators;

        // this.minLength = minLength;
        // this.maxLength = maxLength;
    }

    newCharIterator() {
        return CharactersIterators.merger(...this.iterators);
    }

    *getPassword (len) {
        let ite = this.newCharIterator();
        let current;
        if (len == 1) {
            while(true) {
                current = ite.next();
                if (current.done) break;
                yield current.value;
            }
        }
        else {
            let sub;
            let subCurrent;
            while(true) {
                current = ite.next();

                if (current.done) break;
                
                sub = this.getPassword(len - 1);
                
                while (true) {
                    subCurrent = sub.next();
                    if (subCurrent.done) break;
                    yield current.value + subCurrent.value;
                }
            }
        }
        return;
    }
}

class CharactersIterators {
    static *merger(...iterators) {
        let ite, current;
        for (let i = 0; i < iterators.length; i++) {
            ite = iterators[i]();
            while(true) {
                current = ite.next();
                if (current.done) break;
                yield current.value;
            }
        }
    }

    static symbolIterator(symbols) {
        return () => {return CharactersIterators._symbolIterator(symbols)};
    }

    static *_symbolIterator(symbols) {
        for (let i = 0; i < symbols.length; i++) {
            yield symbols[i];
        }
    }

    static *asciiIterator(start=65, end=90) {
        for (let i = start; i <= end; i++) {
            yield String.fromCharCode(i);
        }
    }

    static *upperLetterIterator() {
        let ite = CharactersIterators.asciiIterator();
        let c;
        while (true) {
            c = ite.next();
            if (c.done) break;
            yield c.value;
        }
    }

    static *lowerLetterIterator() {
        let ite = CharactersIterators.asciiIterator(97, 122);
        let c;
        while (true) {
            c = ite.next();
            if (c.done) break;
            yield c.value;
        }
    }

    static *numberIterator() {
        for (let i = 0; i < 10; i++) {
            yield i;
        }
    }
}

// var ite = CharactersIterators.merger(CharactersIterators.lowerLetterIterator, CharactersIterators.upperLetterIterator);
// var current;

// while(true) {
//     current = ite.next();
//     if (current.done) break;
//     console.log(current.value);
// }

let passwordCracker = new PasswordBruteForce(
    CharactersIterators.upperLetterIterator,
    CharactersIterators.numberIterator,
    CharactersIterators.symbolIterator(["_"])
);

let ite = passwordCracker.getPassword(5);
let current;
const step = 100000;
let c = 0;
while(true) {
    current = ite.next();
    if (current.done) break;
    if (c++ == step) {
        c = 0;
        console.log(current.value);
    }
}
