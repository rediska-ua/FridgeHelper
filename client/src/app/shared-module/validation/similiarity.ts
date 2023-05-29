const editDistance = (string1: string, string2: string): number => {
  string1 = string1.toLowerCase();
  string2 = string2.toLowerCase();

  const costs: number[] = [];
  for (let i = 0; i <= string1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= string2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (string1.charAt(i - 1) != string2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[string2.length] = lastValue;
  }
  return costs[string2.length];
}


export function similarity(string1: string, string2: string) {
  let longerStr = string1;
  let shorterStr = string2;
  if (string1.length < string2.length) {
    longerStr = string2;
    shorterStr = string1;
  }
  let longerLengthStr = longerStr.length;
  if (longerLengthStr == 0) {
    return 1.0;
  }
  return (longerLengthStr - editDistance(longerStr, shorterStr)) / parseFloat(String(longerLengthStr));
}
