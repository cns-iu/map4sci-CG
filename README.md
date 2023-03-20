# ZMLT Compactness-Guided Layout

## Setup

Prerequisite: install node.js v16+

```bash
npm ci
```
## Initialization

```
eg: python3 init-py/init-layout.py examples/batchtree/last-fm.dot examples/textFile/ examples/csv/last-fm.csv
```

## Input Data

```
The csv file generated from initialization will be the input
```

## Running

```
npm run cg csvfile outputfile.tsv
```

## Output Data

```
Outputs graph coordinates to form a network
```

## Additional Tips

```
for large data include NODE_OPTIONS="--max-old-space-size=8192

```
