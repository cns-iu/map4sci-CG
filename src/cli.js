import * as fs from 'fs';
import { preprocess } from '../src/functions/preprocess.js';
import { init } from './functions/init.js';

if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

function main(inputFile, outputFile) {
  const INPUT_FILE = JSON.parse(
    fs.readFileSync(inputFile, { encoding: 'utf8', flag: 'r' })
  );

  preprocess(INPUT_FILE);
  init(INPUT_FILE, outputFile);
}

main(process.argv[2], process.argv[3]);
