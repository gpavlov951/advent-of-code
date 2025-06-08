const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const INITIAL_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
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
        currentCubes.red > INITIAL_CUBES.red ||
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
