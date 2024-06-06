export default function hashString(str: string) {
  const abc =  ["p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"];
  const nums =  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let arr = '';

  for (let i = 0; i < str.length; i++) {
    if (abc.includes(str[i])) {
      arr += abc.indexOf(str[i]);
    } else if (nums.includes(str[i])) {
      arr += abc[Number(str[i])];
    }
    else arr +=str[i];
  }

  return arr;
}
