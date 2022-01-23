/**
 * Get the counting numberes given a starting value (defaults to 0): 0, 1, 2, 3
 *
 * @param length {number} - length of array
 * @param start {number} - (Optional) - starting value of the array
 * @returns array of counting numbers
 */
export const getCountingNumbers = (
    length: number,
    start?: number
): number[] => {
    // Default starting value as 0
    const startingNumber = start ?? 0;

    return Array.from({ length }, (_, i) => startingNumber + i);
};

/**
 * Checks if a number (dividend) is divisible by another number (divsor)
 * @param dividend - number being checked if divisible
 * @param divisor {number} - what is used to determine if number is divisible by
 * @returns number is divisible
 */
export const isDivisible = (dividend: number, divisor: number): boolean => {
    // modulo operation will return 0 if there's no remainders => divisible
    return !(dividend % divisor);
};

/**
 * Map an Array of numeric values to Fizzbuzz values
 * @param values Array of numeric values
 * @returns Fizzbuzz values
 */
export const getFizzbuzzValues = (values: number[]): string[] => {
    return values.map((value) => {
        const divisibleByThree = isDivisible(value, 3);
        const divisibleByFive = isDivisible(value, 5);

        if (divisibleByThree && divisibleByFive) {
            return 'Fizzbuzz';
        }

        if (divisibleByThree) {
            return 'Fizz';
        }

        if (divisibleByFive) {
            return 'Buzz';
        }

        return `${value}`;
    });
};
