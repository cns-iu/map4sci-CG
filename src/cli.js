import * as fs from 'fs';
import parse from 'dotparser';
import { preprocess } from '../src/functions/preprocess.js';
import { init } from './functions/init.js';
import { processDot } from './functions/processDot.js';

if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

async function main(network, outputFile) {
  const data = parse(fs.readFileSync(network, { encoding: 'utf8', flag: 'r' }));
  const { collectiveData, cy } = await processDot(data);
  preprocess(collectiveData);
  const nodes = await init(collectiveData, outputFile);
  // update cy with new coordinates

  // write cy graph to outputFile .. .cyjs
  let newOutput = nodes.map((c) => `${c.x}\t${c.y}\t${c.id}`).join('\n');
  fs.writeFileSync(outputFile, newOutput);

  for (const { x, y, id } of nodes) {
    cy.$id(id.toString()).position({ x, y });
  }
  const networkContent = cy.json();
  fs.writeFileSync('test-output.cyjs', JSON.stringify(networkContent, null, 2));

  return newOutput;
}

main(process.argv[2], process.argv[3]);
