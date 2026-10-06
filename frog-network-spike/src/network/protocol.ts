import type {Input} from '../simulation/world';
import type {PhysicsState} from '../simulation/state';
export type Command={seq:number;at:number;input:Input};
export type Snapshot={state:PhysicsState;serverTime:number;ack:number[];connected:boolean[];tickMs:{p50:number;p95:number;p99:number;max:number};overruns:number;resetId:number};
export const NETWORK={snapshotHz:30,inputHz:30,interpolationMs:65,staleInputMs:350,maxPredictionMs:250,correctionSmoothMs:80,snapDistance:2};
