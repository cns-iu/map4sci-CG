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
  const data = await readCSVFile(network);
  console.log('Finished reading files');

  preprocess(data);
  const nodes = await init(data, outputFile);

  let newOutput = nodes
    .map((c) => `${c.x}\t${c.y}\t${data.label2i[c.id]}`)
    .join('\n');
  fs.writeFileSync(outputFile, newOutput);

  if (nodes.length < 1000) {
    const cy = await cytoscapeLayout(data);

    // update cy with new coordinates
    for (const { x, y, id } of nodes) {
      cy.$id(id.toString()).position({ x, y });
    }

    // write cy graph to outputFile .. .cyjs
    const networkContent = cy.json();
    fs.writeFileSync(
      outputFile + '.cyjs',
      JSON.stringify(networkContent, null, 2)
    );
  }

  return newOutput;
}

main(process.argv[2], process.argv[3]);
