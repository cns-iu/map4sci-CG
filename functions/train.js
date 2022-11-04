export function train(niter, simulation) {
  simulation.velocityDecay(0.4).alphaDecay(1 - Math.pow(0.001, 1 / niter));

  simulation.restart();
}
