import { fromFile } from 'gen-readlines';

/**
 * Read a simple csv file line by line as a generator. 
 * Yields an array of strings for each line
 * 
 * @param {string} filePath path to the csv file
 * @param {string} separator the separator to split each line by
 */
export function* readCSVLines(filePath, separator = ',') {
  for (const line of fromFile(filePath, { bufferSize: 128 * 1024 * 1024 })) {
    yield line.toString().split(separator);
  }
}

/**
 *
 * @param {path to the file} filePath
 * @returns parsed data from the csv file
 */
export function readCSVFile(filePath) {
  const data = {};
  for (const [key, value] of readCSVLines(filePath)) {
    if (data.hasOwnProperty(key)) {
      data[key].push(value);
    } else {
      data[key] = [ value ];
    }
  }
  return data;
}
