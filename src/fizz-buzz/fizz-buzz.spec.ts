import * as lib from './fizz-buzz';

describe('fizz-bizz', () => {
    describe('getCountingNumbers()', () => {
        it('should return an array of numbers from 0', () => {
            expect(lib.getCountingNumbers(5)).toStrictEqual([0, 1, 2, 3, 4]);
        });

        it('should allow for starting at any specified number', () => {
            expect(lib.getCountingNumbers(6, 7)).toStrictEqual([7, 8, 9, 10, 11, 12]);
        });
    });

    describe('isDivisible()', () => {
        it('should return false if NOT divisible by', () => {
            expect(lib.isDivisible(1, 3)).toBe(false);
            expect(lib.isDivisible(2, 3)).toBe(false);
        });

        it('should return true if divisible by', () => {
            expect(lib.isDivisible(3, 3)).toBe(true);
        });
    });

    describe('getFizzbuzzValue()', () => {
        it('should return Fizzbuzz if divisible by 3 and 5', () => {
            expect(lib.getFizzbuzzValue(30)).toBe('Fizzbuzz');
        });

        it('should return Fizz if divisible by 3 and NOT 5', () => {
            expect(lib.getFizzbuzzValue(27)).toBe('Fizz');
        });

        it('should return Fizz if divisible by 5 and NOT 3', () => {
            expect(lib.getFizzbuzzValue(35)).toBe('Buzz');
        });

        it('should return input number if NOT divisible by 5 or 3', () => {
            expect(lib.getFizzbuzzValue(4)).toBe('4');
        });
    });

    describe('getFizzbuzzValues()', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });

        it('should use getFizzbuzzValue to create its return value', () => {
            const spy = jest
                .spyOn(lib, 'getFizzbuzzValue')
                .mockImplementation((value: number) => { return `${value}_mock`});

            expect(lib.getFizzbuzzValues([9, 35, 30, 101])).toStrictEqual([
                '9_mock',
                '35_mock',
                '30_mock',
                '101_mock',
            ]);

            expect(spy).toHaveBeenNthCalledWith(1, 9);
            expect(spy).toHaveBeenNthCalledWith(2, 35);
            expect(spy).toHaveBeenNthCalledWith(3, 30);
            expect(spy).toHaveBeenNthCalledWith(4, 101);
        });

        it('should map values of the input array to Fizzbuzz values', () => {
            expect(lib.getFizzbuzzValues([9, 35, 30, 101])).toStrictEqual([
                'Fizz',
                'Buzz',
                'Fizzbuzz',
                '101',
            ]);
        });
    });
});
