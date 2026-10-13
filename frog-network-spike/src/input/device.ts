/** Phone/tablet UI eligibility, independent of window width or a PC touchscreen. */
export function mobileControlDevice(userAgent:string,platform:string,touchPoints:number){
 return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)||(platform==='MacIntel'&&touchPoints>1);
}
