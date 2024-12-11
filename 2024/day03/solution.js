const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// --- Part One ---
const lengthOfValidSequence = 4; // mul(
let resultsOfMultiplications = 0;

for (let i = 0; i < input.length; i++) {
  const char = input[i];

  if (char === "m" && input.slice(i, i + lengthOfValidSequence) === "mul(") {
    const indexFirstBraket = i + 3;
    const indexEndBraket = input.indexOf(")", i + lengthOfValidSequence);
    const lengthValidString = 9; // (000,000)

    if (indexEndBraket - indexFirstBraket >= lengthValidString) continue;

    const [firstNumber, secondNumber] = input
      .slice(indexFirstBraket + 1, indexEndBraket)
      .split(",")
      .map(Number);

    if (isNaN(firstNumber) || isNaN(secondNumber)) continue;

    resultsOfMultiplications += firstNumber * secondNumber;
  }
}

console.log("Results of Multiplications:", resultsOfMultiplications);

// --- Part Two ---
