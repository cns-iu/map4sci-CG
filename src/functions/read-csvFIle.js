import * as readline from 'node:readline';
import * as fs from 'fs';

/**
 * 
 * @param {path to the file} filePath 
 * @returns data in json format
 */
export async function readCSVFile(filePath) {
    // Create a readline interface for reading the file line by line
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });
  
    // Promise to resolve when all data points have been read
    const data = {};
  
    // Event listener for each line read
    rl.on('line', (line) => {
      // Process the data point
      const [key, value] = line.split(',');
      if (key in data) {
        data[key].push(value);
      } else {
        data[key] = [value];
      }
  
    });
  
    // Promise to resolve when end of file is reached
    const endOfFile = new Promise((resolve) => {
      rl.on('close', () => {
        resolve();
      });
    });
  
    // Wait for end of file and return all data points
    await endOfFile;
    return data;
  }