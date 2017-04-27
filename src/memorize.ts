import {memCache} from "./memCache";
import {IMemorizeHint} from "./IMemorizeHint";

export const memorize = <T extends Function>(f: T, tags: string[], hint: IMemorizeHint = {}): T => {
    const tagHash = tags.join('__:__');

    // add to every tag information about tagHash
    tags.forEach(tag => {
        if (void 0 === memCache.__tages[tag]) {
            memCache.__tages[tag] = [];
        }

        if (-1 === memCache.__tages[tag].indexOf(tagHash)) {
            memCache.__tages[tag].push(tagHash);
        }
    });

    // create symbol for memorized function
    const symbol = Symbol();

    return <any>function (...args) {
        if (void 0 === memCache[tagHash]) {
            memCache[tagHash] = {};
        }

        if (void 0 === memCache[tagHash][symbol]) {
            memCache[tagHash][symbol] = {};
        }

        let argumentHash = void 0;

        if (hint.none) {
            argumentHash = 'none';
        } else if (hint.scalar) {
            argumentHash = args.join(':');
        } else {
            argumentHash = JSON.stringify(args);
        }

        // mis, should perform direct call
        if (void 0 === memCache[tagHash][symbol][argumentHash]) {
            return memCache[tagHash][symbol][argumentHash] = f.apply(this, args);
        }

        return memCache[tagHash][symbol][argumentHash];
    };
};