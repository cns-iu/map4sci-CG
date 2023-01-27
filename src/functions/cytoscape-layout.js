
import cytoscape from 'cytoscape';

export async function cytoscapeLayout(collectiveData){
    const cy = cytoscape({
        /* options */
      });
      collectiveData.node_id.forEach((node, i) => {
        cy.add({
          group: 'nodes',
          data: {
            weight: collectiveData.node_weight[i],
            id: node.toString(),
            name: collectiveData.node_label[i],
          },
          position: { x: collectiveData.node_x[i], y: collectiveData.node_y[i] },
        });
      });
    
      //adding edges
      const weights = {};
      collectiveData.edge_weight.forEach((edgeWeight, i) => {
        weights[i] = parseFloat(edgeWeight);
      });
    
      collectiveData.edge_source.forEach((edge, i) => {
        cy.add({
          group: 'edges',
          data: {
            id: `${edge}-${collectiveData.edge_target[i]}`.toString(),
            source: edge,
            target: collectiveData.edge_target[i],
            weight: collectiveData.edge_weight[i],
          },
        });
      });
      return cy
}