/** SVG adapter for the same small Graphics vocabulary used by the gameplay frog.
 * Catalog-only geometry; no user-provided markup, DOM, textures, or runtime requests. */
export class SVGGraphics {
 private parts:string[]=[];private fill='#000000';private alpha=1;private stroke='#000000';private width=1;private strokeAlpha=1;
 private hex(n:number){return '#'+n.toString(16).padStart(6,'0');}
 fillStyle(color:number,alpha=1){this.fill=this.hex(color);this.alpha=alpha;return this;}
 lineStyle(width:number,color:number,alpha=1){this.width=width;this.stroke=this.hex(color);this.strokeAlpha=alpha;return this;}
 private add(tag:string,attrs:string,outline=false){this.parts.push(`<${tag} ${attrs} ${outline?`fill="none" stroke="${this.stroke}" stroke-width="${this.width}" stroke-opacity="${this.strokeAlpha}" stroke-linejoin="round" stroke-linecap="round"`:`fill="${this.fill}" fill-opacity="${this.alpha}"`}/>`);return this;}
 fillCircle(x:number,y:number,r:number){return this.add('circle',`cx="${x}" cy="${y}" r="${r}"`);}
 strokeCircle(x:number,y:number,r:number){return this.add('circle',`cx="${x}" cy="${y}" r="${r}"`,true);}
 fillEllipse(x:number,y:number,w:number,h:number){return this.add('ellipse',`cx="${x}" cy="${y}" rx="${w/2}" ry="${h/2}"`);}
 strokeEllipse(x:number,y:number,w:number,h:number){return this.add('ellipse',`cx="${x}" cy="${y}" rx="${w/2}" ry="${h/2}"`,true);}
 fillRect(x:number,y:number,w:number,h:number){return this.add('rect',`x="${x}" y="${y}" width="${w}" height="${h}"`);}
 fillRoundedRect(x:number,y:number,w:number,h:number,r:number){return this.add('rect',`x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"`);}
 strokeRoundedRect(x:number,y:number,w:number,h:number,r:number){return this.add('rect',`x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"`,true);}
 fillPoints(points:{x:number;y:number}[],close=true){return this.add(close?'polygon':'polyline',`points="${points.map(p=>`${p.x},${p.y}`).join(' ')}"`);}
 strokePoints(points:{x:number;y:number}[],close=false){return this.add(close?'polygon':'polyline',`points="${points.map(p=>`${p.x},${p.y}`).join(' ')}"`,true);}
 fillTriangle(x:number,y:number,x2:number,y2:number,x3:number,y3:number){return this.fillPoints([{x,y},{x:x2,y:y2},{x:x3,y:y3}]);}
 lineBetween(x:number,y:number,x2:number,y2:number){return this.add('line',`x1="${x}" y1="${y}" x2="${x2}" y2="${y2}"`,true);}
 markup(){return this.parts.join('');}
}
