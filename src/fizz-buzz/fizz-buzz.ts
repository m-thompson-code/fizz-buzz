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
 * @param dividend - number being checked if divisible by some other number (divsor)
 * @param divisor {number} - what is used to determine if a number (dividend) is divisible
 * @returns number (dividend) is divisible
 */
export const isDivisible = (dividend: number, divisor: number): boolean => {
    return !(dividend % divisor);
}

/**
 * Get a Fizzbuzz value based on a numeric value
 * @param value Numeric value
 * @returns Fizzbuzz value
 */
export const getFizzbuzzValue = (value: number): string => {
    const divisibleByThree = isDivisible(value, 3);
    const divisibleByFive = isDivisible(value, 5);

    // Check if value is divisible by 3 and 5 first
    if (divisibleByThree && divisibleByFive) {
        return 'Fizzbuzz';
    }

    // It is important to check if number is divisible 3 after checking if divisible by 3 and 5
    if (divisibleByThree) {
        return 'Fizz';
    }

    // It is important to check if number is divisible 5 after checking if divisible by 3 and 5
    if (divisibleByFive) {
        return 'Buzz';
    }

    // Default case: return numeric value as a string
    return `${value}`;
};

/**
 * Map an Array of numeric values to Fizzbuzz values
 * @param values Array of numeric values
 * @returns Fizzbuzz values
 */
export const getFizzbuzzValues = (values: number[]): string[] => {
    return values.map(value => getFizzbuzzValue(value));
};
