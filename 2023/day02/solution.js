const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// --- Part 1 ---

const INITIAL_CUBES = {
  RED: 12,
  GREEN: 13,
  BLUE: 14,
};

const sumValidGameIds = input
  .trim()
  .split("\n")
  .map((line) => {
    const [gameName, parts] = line.split(": ");
    const [_, id] = gameName.split("Game ");

    const games = parts.split("; ");
    let valid = true;

    for (const game of games) {
      const cubes = game.split(", ");
      const currentCubes = {
        red: 0,
        green: 0,
        blue: 0,
      };

      for (const cube of cubes) {
        const [count, color] = cube.split(" ");
        currentCubes[color] += Number(count);
      }

      if (
        currentCubes.red > INITIAL_CUBES.RED ||
        currentCubes.green > INITIAL_CUBES.green ||
        currentCubes.blue > INITIAL_CUBES.blue
      ) {
        valid = false;
        break;
      }
    }

    return valid ? Number(id) : 0;
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(sumValidGameIds);

// --- Part 2 ---

const sumPowerSets = input
  .trim()
  .split("\n")
  .map((l) => {
    const [_, parts] = l.split(": ");
    const games = parts.split("; ");

    const currentMaxCubes = {
      red: 0,
      green: 0,
      blue: 0,
    };

    for (const game of games) {
      const cubes = game.split(", ");

      for (const cube of cubes) {
        const [count, color] = cube.split(" ");
        currentMaxCubes[color] = Math.max(
          currentMaxCubes[color],
          Number(count)
        );
      }
    }

    return Object.values(currentMaxCubes).reduce((acc, curr) => acc * curr, 1);
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(sumPowerSets);
