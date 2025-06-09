const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// --- Part 1 ---

/**
 * @param {string} char
 * @returns {boolean}
 */
function isSymbol(char) {
  return char !== "." && !isDigit(char);
}

/**
 * @param {string} char
 * @returns {boolean}
 */
function isDigit(char) {
  return Number.isInteger(Number(char));
}

/**
 * @param {string[][]} grid
 * @returns {number[][]}
 */
function findAllSymbolPositions(grid) {
  const positions = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (isSymbol(grid[row][col])) {
        positions.push([row, col]);
      }
    }
  }

  return positions;
}

/**
 * @param {number} numberRow
 * @param {number} startCol
 * @param {number} endCol
 * @param {number[][]} symbolPositions
 * @returns {boolean}
 */
function isNumberAdjacentToSymbol(
  numberRow,
  startCol,
  endCol,
  symbolPositions
) {
  for (const [symbolRow, symbolCol] of symbolPositions) {
    if (symbolRow < numberRow - 1 || symbolRow > numberRow + 1) {
      continue;
    }

    if (symbolCol >= startCol - 1 && symbolCol <= endCol + 1) {
      return true;
    }
  }

  return false;
}

/**
 * @param {string} numberStr
 * @param {number} row
 * @param {number} startCol
 * @param {number} endCol
 * @param {number[][]} symbolPositions
 * @param {string[]} result
 */
function processNumber(
  numberStr,
  row,
  startCol,
  endCol,
  symbolPositions,
  result
) {
  if (isNumberAdjacentToSymbol(row, startCol, endCol, symbolPositions)) {
    result.push(numberStr);
  }
}

/**
 * @param {string[][]} grid
 * @param {number[][]} symbolPositions
 * @returns {string[]}
 */
function findNumbersAdjacentToSymbols(grid, symbolPositions) {
  const adjacentNumbers = [];

  for (let row = 0; row < grid.length; row++) {
    let currentNumber = "";

    for (let col = 0; col < grid[row].length; col++) {
      const currentChar = grid[row][col];

      if (isDigit(currentChar)) {
        currentNumber += currentChar;
        continue;
      }

      if (currentNumber.length > 0) {
        const endCol = col - 1;
        const startCol = endCol - currentNumber.length + 1;

        processNumber(
          currentNumber,
          row,
          startCol,
          endCol,
          symbolPositions,
          adjacentNumbers
        );
        currentNumber = "";
      }
    }

    if (currentNumber.length > 0) {
      const endCol = grid[row].length - 1;
      const startCol = endCol - currentNumber.length + 1;

      processNumber(
        currentNumber,
        row,
        startCol,
        endCol,
        symbolPositions,
        adjacentNumbers
      );
    }
  }

  return adjacentNumbers;
}

/**
 * @param {string[]} numbers
 * @returns {number}
 */
function calculateSum(numbers) {
  return numbers.reduce((sum, numberStr) => sum + Number(numberStr), 0);
}

const grid = input.trim().split("\n");
const symbolPositions = findAllSymbolPositions(grid);
const adjacentNumbers = findNumbersAdjacentToSymbols(grid, symbolPositions);
const sum = calculateSum(adjacentNumbers);

console.log(sum);
