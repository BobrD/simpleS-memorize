import {memorize} from "./memorize";
import {IMemorizeHint} from "./IMemorizeHint";
import {clearCache} from "./clearCache";

export const cache = (
    tags: string[],
    hint: IMemorizeHint = {scalar: false, immutable: false, none: false}
) => {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = memorize(original, tags, hint);

        return descriptor;
    };
};

export const invalidate = (tags: string[]) => {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {

        const original = descriptor.value;

        descriptor.value = function (...args) {
            clearCache(tags);

            return original.apply(this, args);
        };

        return descriptor;
    };
};