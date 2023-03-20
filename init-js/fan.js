import * as loadash from 'loadash'

export function fan(nodes, origin=[0, 0], radii=[], phaseCenter=0, phaseRange=Math.PI, weights ) {
    const pos = {};
    const phases = {};
    const ranges = {};
    const n = nodes.length;
    const cos = Math.cos;
    const sin = Math.sin;
    const mode='random'
    let weightTotal = weights.reduce((acc, curr) => acc + curr, 0);
    weights = weights.map(w => w / weightTotal);
    const nr = nodes.map((node, i) => [node, weights[i], radii[i]])
        .sort((a, b) => a[1] - b[1]);

    let nr2;
    if (mode === 'random') {
       
    }

}
