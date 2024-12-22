const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// const input = `190: 10 19
// 3267: 81 40 27
// 83: 17 5
// 156: 15 6
// 7290: 6 8 6 15
// 161011: 16 10 13
// 192: 17 8 14
// 21037: 9 7 18 13
// 292: 11 6 16 20`; // Part One - 3749 |

// --- Part One ---

const formattedInput = input.split("\n").map((line) => {
  const [left, right] = line.split(": ");
  return [left, right.split(" ")];
});

const add = "+";
const multi = "*";

let totalCalibrationResults = 0;

for (const [eq, numbers] of formattedInput) {
  const expressions = generateExpressions(numbers);

  for (const expr of expressions) {
    const res = parseExpression(expr);

    const nEq = Number(eq);
    if (res === nEq) {
      totalCalibrationResults += nEq;
      break;
    }
  }
}

/**
 * Generate expressions using recursion
 * @param {string[]} numbers
 * @param {("+" | "*")[]} operators
 * @returns {string[]}
 */
function generateExpressions(numbers, operators = [add, multi]) {
  const results = [];

  function helper(expr, index) {
    if (index === numbers.length - 1) {
      results.push(expr);
      return;
    }

    for (const op of operators) {
      helper(`${expr} ${op} ${numbers[index + 1]}`, index + 1);
    }
  }

  helper(numbers[0], 0);

  return results;
}

/**
 *
 * @param {string} expression
 * @returns {number}
 */
function parseExpression(expression) {
  let res, sign;

  for (const char of expression.split(" ")) {
    if (char === add || char === multi) {
      sign = char;
      continue;
    }

    const number = Number(char);

    if (res === undefined) {
      res = number;
      continue;
    }

    if (sign === add) {
      res += number;
    } else {
      res *= number;
    }
  }

  return res;
}

console.log("Total Calibration Results:", totalCalibrationResults);
