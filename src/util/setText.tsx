export function randomWord(words: string[]) {
  const num = Math.floor(Math.random() * words.length)
  return words[num];
}

export function randomPhrase(words: string[], num: number) {
  const phrase = []

  for (let i = 0; i < num; i++) {
    phrase.push(randomWord(words));
  }

  return phrase;
}