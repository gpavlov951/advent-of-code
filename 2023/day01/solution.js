const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// --- Part One ---
const totalSum = input
  .trim()
  .split("\n")
  .map((l) => {
    const numbers = l.match(/\d+/g);

    const firstNumber = numbers[0][0];
    const lastSequenceNumbers = numbers[numbers.length - 1];
    const lastNumber = lastSequenceNumbers[lastSequenceNumbers.length - 1];
    return Number(firstNumber + lastNumber);
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(totalSum);

// --- Part Two ---
