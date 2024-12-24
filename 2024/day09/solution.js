const fs = require("fs");
const path = require("path");

// const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const input = `2333133121414131402`; // Part One - 1928

// --- Part One ---

/**
 *
 * @param {string} input
 * @returns {number}
 */
function solveDiskFragmenter(input) {
  /**
   * Parse the input string into files and spaces
   * @param {string} str
   * @returns { { type: "file" | "space", id?: number }[] }
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
   * @param { { type: "file" | "space", id?: number }[] } disk
   * @returns { { type: "file" | "space", id?: number }[] }
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
   * @param { { type: "file" | "space", id?: number }[] } disk
   * @returns {number}
   */
  function calculateChecksum(disk) {
    return disk.reduce((sum, block, position) => {
      if (block.type === "file") {
        return sum + position * block.id;
      }
      return sum;
    }, 0);
  }

  // Main process
  const disk = parseInput(input);
  const compactedDisk = compactDisk(disk);
  return calculateChecksum(compactedDisk);
}

console.log("File System Check Sum:", solveDiskFragmenter(input));
