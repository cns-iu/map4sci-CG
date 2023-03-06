import { existsSync, createReadStream } from 'fs';
import { join } from 'path';

const outputFolder = 'output'; // Folder containing the split files
const combinedFileName = 'combined.json'; // Name of the combined file

async function combineChunks() {
  const combinedData = [];

  // Iterate through each chunk file
  let chunkNumber = 1;
  while (true) {
    const chunkFileName = join(outputFolder, `chunk-${chunkNumber}.json`);
    
    // Check if the current chunk file exists
    if (!existsSync(chunkFileName)) {
      break;
    }
    
    // Read and parse the current chunk file
    const chunkData = await readAndParseFile(chunkFileName);
    
    // Add the parsed data to the combined data array
    combinedData.push(...chunkData);
    
    chunkNumber++;
  }
  
  // Write the combined data to a file
  const combinedFilePath = join(outputFolder, combinedFileName);
  await writeToFile(combinedFilePath, JSON.stringify(combinedData));
}

// Reads and parses a file with the given file name
async function readAndParseFile(fileName) {
  return new Promise((resolve, reject) => {
    const data = [];
    const stream = createReadStream(fileName, { encoding: 'utf8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });
    
    rl.on('line', (line) => {
      data.push(JSON.parse(line));
    });
    
    rl.on('close', () => {
      resolve(data);
    });
    
    rl.on('error', (err) => {
      reject(err);
    });
  });
}

// Writes data to a file with the given file name
async function writeToFile(fileName, data) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(fileName, { encoding: 'utf8' });
    stream.write(data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

combineChunks().catch((err) => console.error(err));
