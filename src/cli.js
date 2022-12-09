import * as fs from 'fs';
import { preprocess } from '../src/functions/preprocess.js';
import { init } from './functions/init.js';

if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

async function main(inputFile, outputFile) {
  const INPUT_FILE = JSON.parse(
    fs.readFileSync(inputFile, { encoding: 'utf8', flag: 'r' })
  );

  preprocess(INPUT_FILE);
  const coordinates = await init(INPUT_FILE, outputFile);
  let newOutput = Object.values(coordinates)[0]
    .map((c) => `${c.x}\t${c.y}\t${c.id}`)
    .join('\n');
  fs.writeFileSync(outputFile, newOutput);
  console.log(newOutput);
  return newOutput;
}

main(process.argv[2], process.argv[3]);
