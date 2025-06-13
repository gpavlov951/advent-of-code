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

// --- Part 2 ---

/**
 * @param {string[][]} grid
 * @returns {number[][]}
 */
function findPositionsOfSpecialSymbol(grid, symbol) {
  const positions = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === symbol) {
        positions.push([row, col]);
      }
    }
  }

  return positions;
}

/**
 * @param {string} row
 * @param {number} position
 * @returns {string}
 */
function findNumberOnRow(row, position) {
  let number = "";

  for (let i = position; i < row.length; i++) {
    if (isDigit(row[i])) {
      number += row[i];
    } else {
      break;
    }
  }

  for (let i = position - 1; i >= 0; i--) {
    if (isDigit(row[i])) {
      number = row[i] + number;
    } else {
      break;
    }
  }

  return number;
}

/**
 * @param {string[][]} grid
 * @param {number} gearRow
 * @param {number} gearCol
 * @returns {string[]}
 */
function findNumbersAdjacentToGear(grid, gearRow, gearCol) {
  const numbers = [];
  const foundNumbers = new Set();

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;

      const checkRow = gearRow + rowOffset;
      const checkCol = gearCol + colOffset;

      if (
        checkRow < 0 ||
        checkRow >= grid.length ||
        checkCol < 0 ||
        checkCol >= grid[checkRow].length
      ) {
        continue;
      }

      if (isDigit(grid[checkRow][checkCol])) {
        const number = findNumberOnRow(grid[checkRow], checkCol);

        let startCol = checkCol;
        while (startCol > 0 && isDigit(grid[checkRow][startCol - 1])) {
          startCol--;
        }

        const numberKey = `${checkRow},${startCol},${number}`;

        if (!foundNumbers.has(numberKey)) {
          foundNumbers.add(numberKey);
          numbers.push(number);
        }
      }
    }
  }

  return numbers;
}

/**
 * @param {string[][]} grid
 * @param {number[][]} coordinates
 * @returns {number[][]}
 */
function findNumbersAdjacentToCoordinates(grid, coordinates) {
  const numbersAdjacentToCoordinates = [];

  for (const [row, col] of coordinates) {
    const adjacentNumbers = findNumbersAdjacentToGear(grid, row, col);
    numbersAdjacentToCoordinates.push(adjacentNumbers);
  }

  return numbersAdjacentToCoordinates;
}

const positionsOfSpecialSymbol = findPositionsOfSpecialSymbol(grid, "*");
const numbersAdjacentToSpecialSymbol = findNumbersAdjacentToCoordinates(
  grid,
  positionsOfSpecialSymbol
);
const sum2 = numbersAdjacentToSpecialSymbol
  .filter((arr) => arr.length === 2)
  .reduce(
    (sum, numbers) =>
      sum + numbers.reduce((product, number) => product * Number(number), 1),
    0
  );

console.log(sum2);
