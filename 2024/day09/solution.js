const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

// const input = `2333133121414131402`; // Part One - 1928 | Part Two - 2858

// --- Part One ---

/** @typedef { { type: "file" | "space", id?: number } } Disk  */

/**
 * Parse the input string into files and spaces
 * @param {string} str
 * @returns { Disk[] }
 */
function parseInput(str) {
  const result = [];
  let fileId = 0;
  let isFile = true; // Alternate between file and space

  for (let i = 0; i < str.length; i++) {
    const length = parseInt(str[i]);

    if (isFile) {
      // Add file blocks with their ID
      for (let j = 0; j < length; j++) {
        result.push({ type: "file", id: fileId });
      }

      fileId++;
    } else {
      // Add space blocks
      for (let j = 0; j < length; j++) {
        result.push({ type: "space" });
      }
    }

    isFile = !isFile;
  }

  return result;
}

/**
 * Move files from right to left into empty spaces
 * @param { Disk[] } disk
 * @returns { Disk[] }
 */
function compactDisk(disk) {
  let changed;
  do {
    changed = false;
    // Find rightmost file block that has a space to its left
    for (let i = disk.length - 1; i > 0; i--) {
      if (disk[i].type === "file") {
        // Look for leftmost space before this file
        let spaceIdx = -1;
        for (let j = 0; j < i; j++) {
          if (disk[j].type === "space") {
            spaceIdx = j;
            break;
          }
        }

        if (spaceIdx !== -1) {
          // Move file block to space
          disk[spaceIdx] = disk[i];
          disk[i] = { type: "space" };
          changed = true;
          break;
        }
      }
    }
  } while (changed);

  return disk;
}

/**
 * Calculate checksum based on final positions
 * @param { Disk[] } disk
 * @returns {number}
 */
function calculateCheckSum(disk) {
  return disk.reduce((sum, block, position) => {
    if (block.type === "file") {
      return sum + position * block.id;
    }

    return sum;
  }, 0);
}

/**
 * Main process
 * @param {string} input
 * @returns {number}
 */
function solveDiskFragmenterPartOne(input) {
  const disk = parseInput(input);
  const compactedDisk = compactDisk(disk);
  return calculateCheckSum(compactedDisk);
}

console.log(
  "File System Check Sum Part One:",
  solveDiskFragmenterPartOne(input)
);

// --- Part Two ---

/**
 *
 * @param {Disk[]} disk
 * @returns { Map<number, { size: number, startIndex: number}> }
 */
function getFiles(disk) {
  const files = new Map();
  let currentId = null;
  let startIndex = 0;
  let size = 0;

  for (let i = 0; i < disk.length; i++) {
    const block = disk[i];
    if (block.type === "file") {
      if (currentId === null || block.id !== currentId) {
        if (currentId !== null) {
          files.set(currentId, { size, startIndex });
        }
        currentId = block.id;
        startIndex = i;
        size = 1;
      } else {
        size++;
      }
    }
  }

  // Don't forget the last file
  if (currentId !== null) {
    files.set(currentId, { size, startIndex });
  }

  return files;
}

/**
 *
 * @param {Disk[]} disk
 * @param {number} startPos
 * @param {number} size
 * @returns
 */
function findLeftmostSpace(disk, startPos, size) {
  let consecutiveSpaces = 0;
  let potentialStart = -1;

  // Only look at positions before startPos
  for (let i = 0; i < startPos; i++) {
    if (disk[i].type === "space") {
      if (consecutiveSpaces === 0) {
        potentialStart = i;
      }
      consecutiveSpaces++;
      if (consecutiveSpaces === size) {
        return potentialStart;
      }
    } else {
      consecutiveSpaces = 0;
    }
  }
  return -1;
}

/**
 *
 * @param {Disk[]} disk
 * @param {number} fromIndex
 * @param {number} toIndex
 * @param {number} size
 */
function moveFile(disk, fromIndex, toIndex, size) {
  // Create a copy of the file blocks
  const fileBlocks = disk.slice(fromIndex, fromIndex + size);
  // Replace old position with spaces

  for (let i = fromIndex; i < fromIndex + size; i++) {
    disk[i] = { type: "space" };
  }

  // Replace new position with file blocks
  for (let i = 0; i < size; i++) {
    disk[toIndex + i] = fileBlocks[i];
  }
}

/**
 *
 * @param {Disk[]} disk
 * @returns {Disk[]}
 */
function compactWholeFile(disk) {
  const files = getFiles(disk);
  const fileIds = Array.from(files.keys()).sort((a, b) => b - a);

  for (const fileId of fileIds) {
    const { size, startIndex } = files.get(fileId);
    const newPosition = findLeftmostSpace(disk, startIndex, size);

    if (newPosition !== -1) {
      moveFile(disk, startIndex, newPosition, size);
    }
  }

  return disk;
}

/**
 *
 * @param {string} input
 * @returns {number}
 */
function solveDiskFragmenterPartTwo(input) {
  const disk = parseInput(input);
  const compactedWholeFile = compactWholeFile(disk);
  return calculateCheckSum(compactedWholeFile);
}

console.log(
  "File System Check Sum Part Two:",
  solveDiskFragmenterPartTwo(input)
);
