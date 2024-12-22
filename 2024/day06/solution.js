const fs = require("fs");
const path = require("path");

// const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`; // Part One - 41 | Part Two - 6

const formattedInput = input.split("\n").map((row) => row.split(""));

// --- Part One ---

const guardPos = { x: null, y: null };
const initGuardCoords = { x: null, y: null };
const top = "^";
const right = ">";
const bottom = "v";
const left = "<";
const wall = "#";

// Set init coords of the Guard
for (let row = 0; row < formattedInput.length; row++) {
  for (let col = 0; col < formattedInput[0].length; col++) {
    const pos = formattedInput[row][col];

    if (pos === top) {
      initGuardCoords.x = row;
      initGuardCoords.y = col;
      break;
    }
  }

  if (initGuardCoords.x && initGuardCoords.y) {
    guardPos.x = initGuardCoords.x;
    guardPos.y = initGuardCoords.y;

    break;
  }
}

/**
 *
 * @param {number} dir The directions of path (-1) | 1. If we go 'top' or 'left' we need to pass '-1' and opposite
 * @param {'x' | 'y'} coord The coordinate that we want to change - 'x' or 'y'
 */
function updateCoords(dir, coord) {
  guardPos[coord] += dir;
}

/**
 * The method pick the current spot from the map. The idea is that if the guard is out of the map it will return 'undefind' and the while cicle will stop
 *  @param {string[][]} map
 *  @returns
 */
function isValidCoord(map) {
  return !!(map[guardPos.x] && map[guardPos.x][guardPos.y]);
}

/**
 * Check if the next spot is a wall '#'
 * @param {string} nextSpot Spot from the map - input[x][y]
 * @returns
 */
function canMove(nextSpot) {
  return nextSpot !== wall;
}

/**
 *
 * @param {Direction} dir
 * @param {string[][]} map
 * @returns {"." | "#" | null}
 */
function getNextSpot(dir, map) {
  try {
    switch (dir) {
      case top:
        return map[guardPos.x - 1][guardPos.y];
      case right:
        return map[guardPos.x][guardPos.y + 1];
      case bottom:
        return map[guardPos.x + 1][guardPos.y];
      case left:
        return map[guardPos.x][guardPos.y - 1];
    }
  } catch {
    return null;
  }
}

let distinctPositionsCount = 0;
let currentDir = top;
let nextSpot = getNextSpot(currentDir, formattedInput);

while (isValidCoord(formattedInput)) {
  while (isValidCoord(formattedInput) && canMove(nextSpot)) {
    const currentSpot = formattedInput[guardPos.x][guardPos.y];

    // Mark the spot
    if (currentSpot !== "X") {
      formattedInput[guardPos.x][guardPos.y] = "X";
      distinctPositionsCount++;
    }

    // Move Guard
    switch (currentDir) {
      case top:
        updateCoords(-1, "x");
        break;
      case right:
        updateCoords(1, "y");
        break;
      case bottom:
        updateCoords(1, "x");
        break;
      case left:
        updateCoords(-1, "y");
        break;
    }

    nextSpot = getNextSpot(currentDir, formattedInput);
  }

  currentDir = getNextDir(currentDir);
  // The direction is changed, so the next spot is different
  nextSpot = getNextSpot(currentDir, formattedInput);
}

console.log("Distinct positions count:", distinctPositionsCount);

// --- Part Two ---

/** @typedef {"^" | ">" | "v" | "<"} Direction - Direction of the guard */

/**
 *
 * @param {Direction} currentDir
 * @returns {Direction}
 */
function getNextDir(currentDir) {
  switch (currentDir) {
    case top:
      return right;
    case right:
      return bottom;
    case bottom:
      return left;
    case left:
      return top;
  }
}

/**
 *
 * @param {Direction} dir
 * @param {string[][]} map The current map which we are using for search
 * @returns {boolean} True if correct path is found in the line
 */
function isTherePath(dir, map) {
  const nextDir = getNextDir(dir);
  const isVerticalSearch = nextDir === top || nextDir === bottom;
  const searchParams = {
    startPos: isVerticalSearch ? guardPos.x : guardPos.y,
    increment: nextDir === top || nextDir === left ? -1 : 1,
  };
  const spot = isVerticalSearch ? verticalDir : horizontalDir;

  return checkPathInLine(searchParams, isVerticalSearch, map, spot);
}

/**
 * Checks for a spot in a straight line from the current position
 * @param {{ startPos: number, increment: number }} params Search parameters
 * @param {boolean} isVerticalSearch Whether searching vertically or horizontally
 * @param {string[][]} map The current map which we are using for search
 * @param {"|" | "-"} spot The spot that is looking for
 * @returns {boolean} True if a spot is found in the line
 */
function checkPathInLine(
  { startPos, increment },
  isVerticalSearch,
  map,
  searchingSpot
) {
  let pos = startPos;

  while (isVerticalSearch ? map[pos] : map[guardPos.x][pos]) {
    const spot = isVerticalSearch ? map[pos][guardPos.y] : map[guardPos.x][pos];
    if (spot === searchingSpot || spot === plus) return true;
    pos += increment;
  }

  return false;
}

/**
 *
 * @param {Direction} dir
 * @param {string[][]} map
 * @returns {boolean} True if a wall is found in the line
 */
function isThereAWall(dir, map) {
  const nextDir = getNextDir(dir);
  const isVerticalSearch = nextDir === top || nextDir === bottom;
  const searchParams = {
    startPos: isVerticalSearch ? guardPos.x : guardPos.y,
    increment: nextDir === top || nextDir === left ? -1 : 1,
  };

  return checkWallInLine(searchParams, isVerticalSearch, map);
}

/**
 * Checks for a wall in a straight line from the current position
 * @param {{ startPos: number, increment: number }} params Search parameters
 * @param {boolean} isVerticalSearch Whether searching vertically or horizontally
 * @param {string[][]} map
 * @returns {boolean} True if a wall is found in the line
 */
function checkWallInLine({ startPos, increment }, isVerticalSearch, map) {
  let pos = startPos;

  while (isVerticalSearch ? map[pos] : map[guardPos.x][pos]) {
    const spot = isVerticalSearch ? map[pos][guardPos.y] : map[guardPos.x][pos];
    if (spot === wall) return true;
    pos += increment;
  }

  return false;
}

const inputPartTwo = input.split("\n").map((row) => row.split(""));

let newObstructionPositionsCount = 0;
guardPos.x = initGuardCoords.x;
guardPos.y = initGuardCoords.y;
currentDir = top;
nextSpot = getNextSpot(currentDir, inputPartTwo);

const plus = "+";
const verticalDir = "|";
const horizontalDir = "-";

while (isValidCoord(inputPartTwo)) {
  while (isValidCoord(inputPartTwo) && canMove(nextSpot)) {
    const currentSpot = inputPartTwo[guardPos.x][guardPos.y];

    // Mark the spot
    if (
      currentSpot === top ||
      currentSpot === verticalDir ||
      currentSpot === horizontalDir
    ) {
      inputPartTwo[guardPos.x][guardPos.y] = plus;
    } else if (currentSpot === ".") {
      switch (currentDir) {
        case top:
        case bottom:
          inputPartTwo[guardPos.x][guardPos.y] = verticalDir;
          break;
        case left:
        case right:
          inputPartTwo[guardPos.x][guardPos.y] = horizontalDir;
          break;
      }
    }

    // Check for new obstruction position
    if (
      isTherePath(currentDir, inputPartTwo) &&
      isThereAWall(currentDir, inputPartTwo)
    ) {
      newObstructionPositionsCount++;
    }

    // Move Guard
    switch (currentDir) {
      case top:
        updateCoords(-1, "x");
        break;
      case right:
        updateCoords(1, "y");
        break;
      case bottom:
        updateCoords(1, "x");
        break;
      case left:
        updateCoords(-1, "y");
        break;
    }

    nextSpot = getNextSpot(currentDir, inputPartTwo);
  }

  currentDir = getNextDir(currentDir);
  try {
    inputPartTwo[guardPos.x][guardPos.y] = plus;
  } catch {}
  // The direction is changed, so the next spot is different
  nextSpot = getNextSpot(currentDir, inputPartTwo);
}

console.log(inputPartTwo.map((row) => row.join("")).join("\n"));
console.log("New obstruction positions count:", newObstructionPositionsCount);
