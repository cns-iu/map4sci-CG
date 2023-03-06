import * as fs from 'fs'


const input = JSON.parse(fs.readFileSync('../examples/inputs/last-fmLinear1.json'))

// const node_id = input.node_id.filter((node) => node<1000);
const node_id =[]
const node_index = input.node_id.filter((node) => node<1000);

const node_x =[]
const node_y =[]
const node_neighbors = []
const edge_source = []
const edge_target = []

for(let i=0;i<=1000;i++){
   edge_source.push(input.edge_source)
   edge_target.push(input.edge_target)
}

for(let i=0;i<1000;i++){
if( node_id.includes(edge_source[i] == false )){
    node_id.push(node_id.push(edge_source[i]))}
else if(node_id.includes(edge_target[i] ==false) ){
    node_id.push(node_id.push(edge_target[i]))
}
}

console.log(node_id)

