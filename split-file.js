import { existsSync, mkdirSync, createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';
import { once } from 'events';

const inputFile = './examples/inputs/initbtreeSciMap.json'; // Path to the large JSON file
const outputFolder = 'output'; // Folder to save the split files
const chunkSize = 10000000; // Number of lines per chunk

async function splitFile() {
  let lineNumber = 0;
  let chunkNumber = 0;
  let outputStream = null;

  // Create the output folder if it doesn't exist
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder);
  }

  // Create a readline interface to read the input file line by line
  const rl = createInterface({
    input: createReadStream(inputFile),
    crlfDelay: Infinity,
  });


  // Read the input file line by line
  for await (const line of rl) {
    lineNumber++;

    // Create a new output stream for each chunk
    if (lineNumber === 1 || lineNumber % chunkSize === 1) {
      chunkNumber++;
      const outputFileName = `${outputFolder}/chunk-${chunkNumber}.json`;
      outputStream = createWriteStream(outputFileName);
      console.log(`Writing chunk ${chunkNumber} to ${outputFileName}`);
    
    }

    // Write the line to the current output stream
    outputStream.write(`${line}${lineNumber % chunkSize === 0 ? ']' : ''}\n`);
  }
}

splitFile().catch((err) => console.error(err));




