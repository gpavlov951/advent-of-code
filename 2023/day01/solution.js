const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// --- Part One ---
const totalSum = input
  .trim()
  .split("\n")
  .map((l) => {
    const numbers = l.match(/\d+/g) || [];

    const firstNumber = numbers[0]?.[0];
    const lastSequenceNumbers = numbers[numbers.length - 1];
    const lastNumber = lastSequenceNumbers?.[lastSequenceNumbers.length - 1];
    return Number(firstNumber + lastNumber);
  })
  .reduce((acc, curr) => acc + curr, 0);

// console.log(totalSum);

// --- Part Two ---

const lettersDigit = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const totalSum2 = input
  .trim()
  .split("\n")
  .map((l, index) => {
    const firstNumber = getFirstNumber(l);
    const lastNumber = getLastNumber(l);

    console.log(index + 1, firstNumber, lastNumber);

    return Number(firstNumber + lastNumber);
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(totalSum2);

/**
 * @param {string} l
 * @returns {string}
 */
function getFirstNumber(l) {
  const numbers = l.match(/\d+/g) || [];

  const firstSequenceNumbers = numbers[0] || "";
  const firstNFromSequence = firstSequenceNumbers[0] || "";
  const firstNIndex =
    l.indexOf(firstNFromSequence) === -1
      ? l.length
      : l.indexOf(firstNFromSequence);

  const lettersIndexes = lettersDigit
    .filter((d) => l.includes(d))
    .map((d) => ({ digit: d, index: l.indexOf(d) }))
    .sort((a, b) => a.index - b.index);

  const firstNumber =
    firstNFromSequence && firstNIndex <= (lettersIndexes[0]?.index ?? l.length)
      ? firstNFromSequence
      : fromDigitToStringNumber(lettersIndexes[0].digit);

  return firstNumber;
}

/**
 * @param {string} l
 * @returns {string}
 */
function getLastNumber(l) {
  const numbers = l.match(/\d+/g) || [];

  const lastSequenceNumbers = numbers[numbers.length - 1] || "";
  const lastNFromSequence =
    lastSequenceNumbers[lastSequenceNumbers.length - 1] || "";
  const lastNIndex =
    l.lastIndexOf(lastNFromSequence) === -1
      ? 0
      : l.lastIndexOf(lastNFromSequence);

  const lettersIndexes = lettersDigit
    .filter((d) => l.includes(d))
    .map((d) => ({ digit: d, index: l.lastIndexOf(d) }))
    .sort((a, b) => a.index - b.index);

  const lastNumber =
    lastNFromSequence &&
    lastNIndex >= (lettersIndexes[lettersIndexes.length - 1]?.index ?? 0)
      ? lastNFromSequence
      : fromDigitToStringNumber(
          lettersIndexes[lettersIndexes.length - 1].digit
        );

  return lastNumber;
}

/**
 * @param {"one" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine"} digit
 */
function fromDigitToStringNumber(digit) {
  switch (digit) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return "";
  }
}
