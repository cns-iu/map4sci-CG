# ZMLT Compactness-Guided Layout

## Setup

Prerequisite: install node.js v16+√

```bash
npm ci
```
## Initialization

```
argument-1 inputfile: dot formated file which is the network
argument-2 Text Direct: directory to store the created text files
argument-3 outputfile: json file which will be the input for the Algorithm

eg: python3 init-py/init-layout.py examples/batchtree/last-fm.dot examples/textFile/ examples/csv/last-fm.csv
```

## Input Data

```
The csv file generated from initialization will be the input 
```

## Running

```
npm run cg inputfile outputfile.tsv
```

## Output Data

```
Outputs graph coordinates to form a network
```

## Additional Tips

```
for large data include NODE_OPTIONS="--max-old-space-size=8192 this will help preventing the error due to memory issues

```
