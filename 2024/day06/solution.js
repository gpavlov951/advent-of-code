const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// const input = `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`; // Part One - 41 | Part Two -

const formattedInput = input.split("\n").map((row) => row.split(""));

// --- Part One ---

let guardPos = { x: null, y: null };
const top = "^";
const right = ">";
const bottom = "v";
const left = "<";
const wall = "#";

for (let row = 0; row < formattedInput.length; row++) {
  for (let col = 0; col < formattedInput[0].length; col++) {
    const pos = formattedInput[row][col];

    if (pos === top) {
      guardPos.x = row;
      guardPos.y = col;
      break;
    }
  }

  if (guardPos.x && guardPos.y) break;
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
 * @returns
 */
function isValidCoord() {
  return !!(
    formattedInput[guardPos.x] && formattedInput[guardPos.x][guardPos.y]
  );
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
 * @param {"^" | ">" | "v" | "<"} dir - Direction of the guard
 * @returns {"." | "#" | null}
 */
function getNextSpot(dir) {
  try {
    switch (dir) {
      case top:
        return formattedInput[guardPos.x - 1][guardPos.y];
      case right:
        return formattedInput[guardPos.x][guardPos.y + 1];
      case bottom:
        return formattedInput[guardPos.x + 1][guardPos.y];
      case left:
        return formattedInput[guardPos.x][guardPos.y - 1];
    }
  } catch {
    return null;
  }
}

let distinctPositionsCount = 0;
let currentDir = top;
let nextSpot = getNextSpot(currentDir);

while (isValidCoord()) {
  while (isValidCoord() && canMove(nextSpot)) {
    const currentSpot = formattedInput[guardPos.x][guardPos.y];

    if (currentSpot !== "X") {
      formattedInput[guardPos.x][guardPos.y] = "X";
      distinctPositionsCount++;
    }

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

    nextSpot = getNextSpot(currentDir);
  }

  switch (currentDir) {
    case top:
      currentDir = right;
      break;
    case right:
      currentDir = bottom;
      break;
    case bottom:
      currentDir = left;
      break;
    case left:
      currentDir = top;
      break;
  }

  nextSpot = getNextSpot(currentDir);
}

// console.log(formattedInput.map((row) => row.join("")).join("\n"));
console.log("Distinct positions count:", distinctPositionsCount);
