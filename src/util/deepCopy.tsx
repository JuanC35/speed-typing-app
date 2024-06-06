// export default function deepCopy(input: any): any {
//   if (input === null || typeof input !== "object") return input;
//   let copyArr = [];

//   if (Array.isArray(input)) {
//     copyArr = input.map((el) => deepCopy(el));
//     return copyArr;
//   }

//   const copy = {};

//   let key: typeof keyof input

//   for (key in input) {
//     if (input.hasOwnProperty(key)) {
//       copy[key] = deepCopy(input[key]);
//     }
//   }

//   return copy;
// }

export default function deepCopy<T extends Record<string, any>>(input: T): T {
  if (input === null || typeof input !== "object") return input;
  let copyArr: any[] = [];

  if (Array.isArray(input)) {
    copyArr = input.map((el) => deepCopy(el));
    return copyArr as unknown as T;
  }

  const copy: Partial<T> = {};

  let key: keyof T;

  for (key in input) {
    if (input.hasOwnProperty(key)) {
      copy[key] = deepCopy(input[key]);
    }
  }

  return copy as T;
}
