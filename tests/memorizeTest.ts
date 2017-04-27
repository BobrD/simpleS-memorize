import {expect} from 'chai';
import {memorize} from "../src/memorize";
import {clearCache} from "../src/clearCache";
import {cache, invalidate} from "../src/decorator";

describe('memorize', () => {
    it('memorize result of function call', () => {
        let t = 0;
        const functionA = () => ++t;
        const functionB = () => ++t;

        const memorizedA = memorize(functionA, ['a']);
        const memorizedB = memorize(functionB, ['a']);

        // direct call A
        expect(memorizedA()).to.be.eq(1);
        // hit A
        expect(memorizedA()).to.be.eq(1);
        // direct call B
        expect(memorizedB()).to.be.eq(2);
        // hit B
        expect(memorizedB()).to.be.eq(2);
    });

    it('can clear cache by tags', () => {
        let t = 0;
        const functionA = () => ++t;
        const functionB = () => ++t;

        const memorizedA = memorize(functionA, ['a', 'b']);
        const memorizedB = memorize(functionB, ['a']);

        // direct call A
        expect(memorizedA()).to.be.eq(1);
        // direct call B
        expect(memorizedB()).to.be.eq(2);
        // hit A
        expect(memorizedA()).to.be.eq(1);
        // hit B
        expect(memorizedB()).to.be.eq(2);

        clearCache(['b']);

        // direct call A
        expect(memorizedA()).to.be.eq(3);
        // hit B
        expect(memorizedB()).to.be.eq(2);

        clearCache(['a']);

        // direct call A
        expect(memorizedA()).to.be.eq(4);
        // direct call B
        expect(memorizedB()).to.be.eq(5);
        // hit A
        expect(memorizedA()).to.be.eq(4);
        // hit B
        expect(memorizedB()).to.be.eq(5);

        clearCache(['a', 'b']);

        // direct call A
        expect(memorizedA()).to.be.eq(6);
        // direct call B
        expect(memorizedB()).to.be.eq(7);
        // hit A
        expect(memorizedA()).to.be.eq(6);
        // hit B
        expect(memorizedB()).to.be.eq(7);
    });

    it('support hint for function argument types', () => {
        let t = 0;
        const functionWithoutArgs = () => ++t;
        const functionWithScalarArgs = (c: number) => ++t + c;

        const memorizedFunctionWithoutArgs = memorize(functionWithoutArgs, ['a'], {none: true});
        const memorizedFunctionWithScalarArgs = memorize(functionWithScalarArgs, ['a'], {scalar: true});

        // direct call WithoutArgs
        expect(memorizedFunctionWithoutArgs()).to.be.eq(1);
        // direct call WithScalarArgs
        expect(memorizedFunctionWithScalarArgs(1)).to.be.eq(3);
        // hit WithoutArgs
        expect(memorizedFunctionWithoutArgs()).to.be.eq(1);
        // hit WithScalarArgs
        expect(memorizedFunctionWithScalarArgs(1)).to.be.eq(3);
    });

    it('support cache decorators for methods', () => {
        let t = 0;
        class Test {
            @cache(['a'], {none: true})
            a() { return ++t; }

            @cache(['a'], {none: true})
            b() { return ++t; }
        }

        const test = new Test();

        // direct call A
        expect(test.a()).to.be.eq(1);
        // hit A
        expect(test.a()).to.be.eq(1);
        // direct call B
        expect(test.b()).to.be.eq(2);
        // hit B
        expect(test.b()).to.be.eq(2);
    });

    it('support invalidate decorators for methods', () => {
        let t = 0;
        class Test {
            @cache(['a'], {none: true})
            a() { return ++t; }

            @cache(['a'], {none: true})
            b() { return ++t; }

            @invalidate(['a'])
            clear() {
                return 'called';
            }
        }

        const test = new Test();

        // direct call A
        expect(test.a()).to.be.eq(1);

        // hit A
        expect(test.a()).to.be.eq(1);
        // direct call B
        expect(test.b()).to.be.eq(2);
        // hit B
        expect(test.b()).to.be.eq(2);

        expect(test.clear()).to.be.eq('called');

        // direct call A
        expect(test.a()).to.be.eq(3);
        // hit A
        expect(test.a()).to.be.eq(3);
        // direct call B
        expect(test.b()).to.be.eq(4);
        // hit B
        expect(test.b()).to.be.eq(4);
    });
});