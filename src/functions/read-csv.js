import { fromFile } from 'gen-readlines';

export function* readCSVLines(filePath, separator = ',') {
  for (const line of fromFile(filePath, { bufferSize: 128 * 1024 * 1024 })) {
    yield line.toString().split(separator);
  }
}

/**
 *
 * @param {path to the file} filePath
 * @returns data in json format
 */
export function readCSVFile(filePath) {
  const histogram = {};
  for (const [key, _value] of readCSVLines(filePath)) {
    histogram[key] = (histogram[key] ?? 0) + 1;
  }

  const pointer = Object.fromEntries(
    Object.keys(histogram).map((key) => [key, 0])
  );
  const data = Object.fromEntries(
    Object.entries(histogram).map((key, size) => [key, new Array(size)])
  );
  for (const [key, value] of readCSVLines(filePath)) {
    data[key][pointer++] = Number(value);
  }

  return data;
}
