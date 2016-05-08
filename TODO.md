TODO :
- use the same simulator to calculate steps and the fitness of each and then rollback to previous state ??
- use a centralized thing (engine, AI, ...) to calculate many scenarii (start calculating when we load with new maps) and thn we ask this entity to give us a solution (can be an emergency solution) when we are about to reach the timeout
- put all the possible genes ([column, rotation] in a module and then refer to them by array index)
- use 'round' caches to cache the fitness of each gene sequence
- store the fitness (based on score, block distribution, negative points and maybe in the future the opponent performance) inside the simulator and only calculate the the diff each time (currently called the yield)
