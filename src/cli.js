import * as fs from 'fs';
import { preprocess } from '../src/functions/preprocess.js';
import { init } from './functions/init.js';
import { cytoscapeLayout } from './functions/cytoscape-layout.js';
import { readCSVFile } from './functions/read-csvFIle.js';

if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

/**
 *
 * @param {Network file csv format} network
 * @param {output file .tsv format} outputFile
 * @returns
 */
async function main(network, outputFile) {
  console.log('Reading File');
  const INPUT_FILE = await readCSVFile(network);
  console.log('Finished reading files');

  const cy = await cytoscapeLayout(INPUT_FILE);
  preprocess(INPUT_FILE);
  const nodes = await init(INPUT_FILE, outputFile);

  let newOutput = nodes.map((c) => `${c.x}\t${c.y}\t${c.id}`).join('\n');
  fs.writeFileSync(outputFile, newOutput);

  // update cy with new coordinates
  for (const { x, y, id } of nodes) {
    cy.$id(id.toString()).position({ x, y });
  }

  // write cy graph to outputFile .. .cyjs
  const networkContent = cy.json();
  // fs.writeFileSync('examples/test-input.cyjs', JSON.stringify(networkContent, null, 2));

  return newOutput;
}

main(process.argv[2], process.argv[3]);
