import * as d3 from 'd3'
console.log(d3.__version__);
import * as underscore from 'underscore'
console.log(underscore.__version__);
import fetch from "node-fetch";
import * as math from "mathjs";
import Worker from "web-worker";
import * as simulation from "simulation";

import * as fs from 'fs'



var onmessage = null;
//--------code----------
const colorscheme = d3.schemeAccent;//schemePastel1
const OPACITY_NOT_UPDATE = 0.1;
const IS_PROGRESSIVE = true;
const IS_DYNAMIC = false;
const EDGE_COLOR = '#000';
// const EDGE_COLOR = d3.rgb(249,180,35);
const HIDE_OVERLAP = false;
const DPR = 2;
// const font = 'monospace';
const FONT = 'Times';
const HIDDEN_NODE_ALPHA = 0.0;
const HIDDEN_EDGE_ALPHA = 0.0;
const HIDDEN_LABEL_ALPHA = 0.0;

//globals
let shouldTick = true;

let darkMode = false;
let bg = darkMode ? '#322':'#fff';

let runtime = [];
let nodes;

let progress = undefined;
let enabledNodes = undefined;

let shouldDraw = true;
let shouldLabel = true;
let shouldMarkOverlap = false;

let forceLabel = true;
let forceLabelLevel = 99;

//--------data----------
let fns = [
  'out.js',
];

// var my_data = null;
// fs.readFile("out.json", 'utf8' , (err2, data2) => {
//   if (err2) {
//     console.error(err2)
//     return
//   }
//   //console.log(data2)
//   eval(data2)

//   fs.readFile('lib_node.js', 'utf8' , (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     //console.log(data)
//     eval(data)
//   })


// })




