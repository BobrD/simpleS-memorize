import {memCache} from "./memCache";

export const clearCache = (tags: string[]) => {
    Object.keys(memCache.__tages).forEach(tag => {
        if (-1 !== tags.indexOf(tag)) {
            memCache.__tages[tag].forEach(tagHash => delete memCache[tagHash]);
        }
    });
};
