import * as fs from 'fs';
import parse from 'dotparser';
import { preprocess } from '../src/functions/preprocess.js';
import { init } from './functions/init.js';
import { processDot } from './functions/processDot.js';

// if (process.argv.length !== 4) {
//   console.error(`${process.argv[0]}: <input file> <output file>`);
//   process.exit(-1);
// }

async function main(inputFile, outputFile, network) {
  const INPUT_FILE = JSON.parse(
    fs.readFileSync(inputFile, { encoding: 'utf8', flag: 'r' })
  );
  const data = parse(fs.readFileSync(network, { encoding: 'utf8', flag: 'r' }));
  const convertedData = processDot(data);
  preprocess(convertedData);
  const coordinates = await init(convertedData, outputFile);
  let newOutput = Object.values(coordinates)[0]
    .map((c) => `${c.x}\t${c.y}\t${c.id}`)
    .join('\n');
  fs.writeFileSync(outputFile, newOutput);
  return newOutput;
}

main(process.argv[2], process.argv[3], process.argv[4]);
