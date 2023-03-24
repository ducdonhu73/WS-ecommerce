export const filterNullValues = <T>(arr: Array<T | undefined | null>) => {
  return arr.reduce<T[]>((prev, current) => {
    // Use this to remove null value inside array (Filter does not work)
    if (current) {
      prev.push(current);
    }
    return prev;
  }, []);
};

export const isArrayOf = <T>(elemGuard: (x: unknown) => x is T) => {
  return (arr: unknown[]): arr is Array<T> => arr.every(elemGuard);
};

// Array.prototype.filterNullValues = function <T>() {
//   const arr = this as Array<T | undefined | null>;
//   return arr.reduce<T[]>((prev, current) => {
//     // Use this to remove null value inside array (Filter does not work)
//     if (current) {
//       prev.push(current);
//     }
//     return prev;
//   }, []);
// };
