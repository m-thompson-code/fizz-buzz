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
   * Map an Array of numeric values to Fizzbuzz values
   * @param values Array of numeric values
   * @returns Fizzbuzz values
   */
export const getFizzbuzzValues = (values: number[]): string[] => {
    return values.map(value => {
        if (!(value % 3) && !(value % 5)) {
            return 'Fizzbuzz';
        }

        if (!(value % 3)) {
            return 'Fizz';
        }
      
        if (!(value % 5)) {
            return 'Buzz';
        }

        return `${value}`;
    });
};
