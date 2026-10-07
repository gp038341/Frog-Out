import type {ArenaId} from '../simulation/arenas';
import type {Input} from '../simulation/world';
import type {PhysicsState} from '../simulation/state';
export type Command={seq:number;at:number;input:Input};
export type Snapshot={arenaId?:ArenaId;state:PhysicsState;serverTime:number;ack:number[];connected:boolean[];tickMs:{p50:number;p95:number;p99:number;max:number};overruns:number;resetId:number};
export const NETWORK={snapshotHz:30,inputHz:30,interpolationMs:65,staleInputMs:350,maxPredictionMs:250,correctionSmoothMs:80,snapDistance:2};

export type PlayerInfo={id:string;name:string;connected:boolean;ready:boolean;slot:number;reconnectUntil?:number};
export type LobbyState={arenaId:ArenaId;code:string;phase:'lobby'|'game';hostId:string;players:PlayerInfo[];notice:string;reconnectSeconds:number};
