const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const [firstNumbers, secondNumbers] = input
  .trim()
  .split("\n")
  .map((l) => l.split(/\s+/))
  .reduce(
    (acc, [first, second]) => {
      acc[0].push(Number(first));
      acc[1].push(Number(second));
      return acc;
    },
    [[], []]
  );

// --- Part One ---
firstNumbers.sort((a, b) => a - b);
secondNumbers.sort((a, b) => a - b);

const distanceResults = firstNumbers.reduce((acc, n, i) => {
  const secondN = secondNumbers[i];

  acc += Math.abs(n - secondN);

  return acc;
}, 0);

console.log("Distance Results:", distanceResults);

// --- Part Two ---
const secondNumbersMap = new Map();

for (const n of secondNumbers) {
  let value = secondNumbersMap.get(n) || 0;
  secondNumbersMap.set(n, ++value);
}

const similarityResult = firstNumbers.reduce((acc, n) => {
  const appears = secondNumbersMap.get(n) || 0;

  acc += n * appears;

  return acc;
}, 0);

console.log("Similarity Result:", similarityResult);
