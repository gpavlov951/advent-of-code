const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// const input = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9`;

const formattedInput = input
  .trim()
  .split("\n")
  .map((l) => l.split(" ").map(Number));

// --- Part One ---
let safeReports = 0;
for (const report of formattedInput) {
  const firstLevel = report[0];
  const secondLevel = report[1];

  if (isDiffWrong(firstLevel, secondLevel)) continue;

  const initDir = calcDir(firstLevel, secondLevel);

  let isSafeReport = true;
  for (let i = 2; i < report.length; i++) {
    const prevLevel = report[i - 1];
    const currLevel = report[i];

    if (isDiffWrong(prevLevel, currLevel)) {
      isSafeReport = false;
      break;
    }

    const currDir = calcDir(prevLevel, currLevel);
    if (currDir !== initDir) {
      isSafeReport = false;
      break;
    }
  }

  if (isSafeReport) {
    safeReports++;
  }
}

/**
 *
 * @param {number} prevLevel
 * @param {number} currentLevel
 * @returns boolean
 */
function isDiffWrong(prevLevel, currentLevel) {
  const diff = Math.abs(prevLevel - currentLevel);
  return diff < 1 || diff > 3;
}

/**
 *
 * @param {number} prevLevel
 * @param {number} currentLevel
 * @returns 1 | -1
 */
function calcDir(prevLevel, currentLevel) {
  if (prevLevel > currentLevel) return -1;
  else return 1;
}

console.log("Safe Reports:", safeReports);

// --- Part Two ---
let safeReportsTwo = 0;
for (const report of formattedInput) {
  const dirMap = new Map();
  let skipLevel = 0;

  for (let i = 1; i < report.length; i++) {
    const prevLevel = report[i - 1];
    const currLevel = report[i];
    const nextLevel = report[i + 1];

    const dir = calcDir(prevLevel, currLevel);
    let value = dirMap.get(dir) || 0;
    dirMap.set(dir, ++value);

    if (!isDiffWrong(prevLevel, currLevel)) continue;

    if (typeof nextLevel === "number" && !isDiffWrong(prevLevel, nextLevel))
      skipLevel++;
    else skipLevel = 2;
  }

  const increaseDirValues = dirMap.get(1) || 0;
  const decreaseDirValues = dirMap.get(-1) || 0;
  if (increaseDirValues > 1 && decreaseDirValues > 1) continue;

  if (skipLevel > 1) continue;

  safeReportsTwo++;
}

console.log("Save Reports Part Two:", safeReportsTwo);
