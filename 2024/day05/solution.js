const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// const input = `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13

// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`;

const [pageOrdering, pageUpdates] = input.split("\n\n");
const formattedPageOrdering = pageOrdering.split("\n");
const formattedPageUpdates = pageUpdates.split("\n");

// --- Part One ---

let sumMidNumbers = 0;
for (const update of formattedPageUpdates) {
  const formattedUpdate = update.split(",");

  let isValidUpdate = true;

  for (let i = 0; i < formattedUpdate.length; i++) {
    const n = formattedUpdate[i];

    for (let j = i + 1; j < formattedUpdate.length; j++) {
      const x = formattedUpdate[j];
      const order = `${n}|${x}`;

      if (!formattedPageOrdering.includes(order)) {
        isValidUpdate = false;
        break;
      }
    }

    if (!isValidUpdate) break;
  }

  if (isValidUpdate) {
    const midIndex = Math.floor(formattedUpdate.length / 2);
    const midNumber = Number(formattedUpdate[midIndex]);

    sumMidNumbers += midNumber;
  }
}

console.log("Middle page numbers sum:", sumMidNumbers);
