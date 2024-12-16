const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// const input = `MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX`; // 18 || 9

const formattedInput = input.split("\n");

// --- Part One ---

/**
 *
 * @param {string[]} row
 */
function countInRow(row) {
  return (row.match(/XMAS/g) || []).length;
}

/**
 *
 * @param {number} acc
 * @param {string[]} row
 * @returns
 */
function sumCount(acc, row) {
  acc += countInRow(row);
  return acc;
}

const horizontalMatch = formattedInput.reduce(sumCount, 0);

const reverseHorizontalMatch = formattedInput
  .map((row) => row.split("").reverse().join(""))
  .reduce(sumCount, 0);

const verticalInput = [];

for (let row = 0; row < formattedInput.length; row++) {
  const verticalCol = [];

  for (let col = 0; col < formattedInput[0].length; col++) {
    verticalCol.push(formattedInput[col][row]);
  }

  verticalInput.push(verticalCol);
}

const verticalMatch = verticalInput
  .map((row) => row.join(""))
  .reduce(sumCount, 0);

const reverseVerticalMatch = verticalInput
  .map((row) => row.reverse().join(""))
  .reduce(sumCount, 0);

const diagonalInput = formattedInput.map((row) => row.split(""));
const diagonalMatchLR = calcDiagonalMatchLR(diagonalInput);

const reverseDiagonalInput = diagonalInput.reverse();
const reverseDiagonalMatchLR = calcDiagonalMatchLR(reverseDiagonalInput);

const diagonalInputRL = formattedInput.map((row) => row.split("").reverse());
const diagonalMatchRL = calcDiagonalMatchLR(diagonalInputRL);

const reverseDiagonalInputRL = diagonalInputRL.reverse();
const reverseDiagonalMatchRL = calcDiagonalMatchLR(reverseDiagonalInputRL);

/**
 *
 * @param {string[][]} diagonalInput
 * @returns number
 */
function calcDiagonalMatchLR(diagonalInput) {
  let diagonalMatch = 0;

  for (let row = 0; row < diagonalInput.length - 3; row++) {
    for (let col = 0; col < diagonalInput[0].length - 3; col++) {
      const x = diagonalInput[row][col];
      const m = diagonalInput[row + 1][col + 1];
      const a = diagonalInput[row + 2][col + 2];
      const s = diagonalInput[row + 3][col + 3];

      if (`${x}${m}${a}${s}` === "XMAS") diagonalMatch++;
    }
  }

  return diagonalMatch;
}

console.log(
  "Word Search Result:",
  horizontalMatch +
    reverseHorizontalMatch +
    verticalMatch +
    reverseVerticalMatch +
    diagonalMatchLR +
    reverseDiagonalMatchLR +
    diagonalMatchRL +
    reverseDiagonalMatchRL
);

// --- Part Two ---

let xmasMatch = 0;

for (let row = 1; row < formattedInput.length - 1; row++) {
  for (let col = 1; col < formattedInput[0].length - 1; col++) {
    const char = formattedInput[row][col];

    if (char === "A") {
      const tl = formattedInput[row - 1][col - 1];
      const tr = formattedInput[row - 1][col + 1];
      const bl = formattedInput[row + 1][col - 1];
      const br = formattedInput[row + 1][col + 1];

      const scenario = tl === "M" && br === "S";
      const scenario1 = tl === "S" && br === "M";
      const scenario2 = tr === "M" && bl === "S";
      const scenario3 = tr === "S" && bl === "M";

      if ((scenario || scenario1) && (scenario2 || scenario3)) xmasMatch++;
    }
  }
}

console.log("X-MAS Search Result:", xmasMatch);
