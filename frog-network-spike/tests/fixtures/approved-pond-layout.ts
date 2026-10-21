import {ARENAS} from '../../src/simulation/arenas';
/** Historical AI benchmarks compare controllers on their original fixed course.
 * The experiment's actual geometry/spawns have separate traversal and match tests. */
export function approvedPondCourse<T>(run:()=>T):T{const pond=ARENAS['sunny-pond'],solids=pond.solids;try{pond.solids=solids.slice(0,12);return run();}finally{pond.solids=solids;}}
