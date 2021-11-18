class PasswordBruteForce {
    constructor (...charIterators) {
        this.iterators = charIterators;

        // this.minLength = minLength;
        // this.maxLength = maxLength;
    }

    get newCharIterator() {
        return CharactersIterators.merger(...this.iterators);
    }

    *getPassword (len) {
        let ite = this.newCharIterator;
        let current;
        if (len == 1) {
            do {
                current = ite.next().value;
                yield current.value;
            } while (!current.done);
        }
        else {
            let sub = this.getPassword(len - 1);
            let subCurrent;
            do {
                current = ite.next().value;
                do {
                    subCurrent = sub.next();
                    console.log(subCurrent, sub);
                    yield subCurrent.value + current.value;
                } while (!subCurrent.done);
            } while (!current.done);
        }
        return;
    }
}

class CharactersIterators {
    static *merger(...iterators) {
        let ite, current;
        for (let i = 0; i < iterators.length; i++) {
            console.log(iterators[i]);
            ite = iterators[i]();
            while(true) {
                current = ite.next();
                if (current.done) break;
                yield current.value;
            }
        }
    }

    static *symbolIterator(symbols) {
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
    CharactersIterators.symbolIterator(["_"])
);

let ite = passwordCracker.getPassword(3);
let current;
while(true) {
    current = ite.next();
    if (current.done) break;
    console.log(current.value);
}