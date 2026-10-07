/** The Canopy Courtyard: one 16:9 arena, physical rectangles are also the rendering source. */
export const WIDTH=40, HEIGHT=22.5;
export const FLOOR_TOP=21.5;
export const arena=[
 {x:20,y:22,w:40,h:1},
 {x:.25,y:11.25,w:.5,h:22.5}, {x:39.75,y:11.25,w:.5,h:22.5},
 {x:20,y:.25,w:40,h:.5},
 // Wide lower launches, offset middle interceptions, shared upper swing beam.
 {x:7,y:16,w:7,h:.5}, {x:33,y:16,w:7,h:.5},
 {x:12,y:11.5,w:4,h:.5}, {x:28,y:11.5,w:4,h:.5},
 {x:20,y:7,w:9,h:.5},
 {x:7,y:5,w:4,h:.5}, {x:33,y:5,w:4,h:.5},
];
export function spawnPoint(index:number,count:number){
 return {x:count===2?(index===0?12:20):2+(WIDTH-4)*index/(count-1),y:FLOOR_TOP-1};
}
