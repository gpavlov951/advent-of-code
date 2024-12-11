const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// --- Part One ---
const validSequence = "mul(";
const lengthOfValidSequence = validSequence.length;
let partOneResult = 0;

for (let i = 0; i < input.length; i++) {
  const char = input[i];

  if (
    char === "m" &&
    input.slice(i, i + lengthOfValidSequence) === validSequence
  ) {
    const res = getMultiplications(i);
    if (!res) continue;

    partOneResult += res;
  }
}

/**
 *
 * @param {number} index
 * @returns
 */
function getMultiplications(index) {
  const indexFirstBraket = index + 3;
  const indexEndBraket = input.indexOf(")", index + lengthOfValidSequence);
  const lengthValidString = 9; // (000,000)

  if (indexEndBraket - indexFirstBraket >= lengthValidString) return;

  const [firstNumber, secondNumber] = input
    .slice(indexFirstBraket + 1, indexEndBraket)
    .split(",")
    .map(Number);

  if (isNaN(firstNumber) || isNaN(secondNumber)) return;

  return firstNumber * secondNumber;
}

console.log("Results of Multiplications:", partOneResult);

// --- Part Two ---

let isEnable = true;
let partTwoResult = 0;
let nextTargetIndex = input.indexOf("don't()"); // First 'don't()' because we start with isEnable = true

for (let i = 0; i < input.length; i++) {
  const char = input[i];

  if (nextTargetIndex === i) {
    nextTargetIndex = isEnable
      ? input.indexOf("do()", i)
      : input.indexOf("don't()", i);
    isEnable = !isEnable;
  }

  if (!isEnable) continue;

  if (
    char === "m" &&
    input.slice(i, i + lengthOfValidSequence) === validSequence
  ) {
    const res = getMultiplications(i);
    if (!res) continue;

    partTwoResult += res;
  }
}

console.log("Part Two Result:", partTwoResult);
