

import * as fs from 'fs';
import json from 'big-json'

export async function main(network) {
    const readStream = fs.createReadStream(network);
    const parseStream = json.createParseStream();
    
    parseStream.on('data', function(pojo) {
        // => receive reconstructed POJO
        console.log(pojo)
    });
    
    readStream.pipe(parseStream);
}

main(process.argv[2]);


