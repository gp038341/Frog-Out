/** Presentation adapter only: use the existing Sound master handler and saved effects gain. */
export function mountSoundSettings(audio:{enabled:boolean;volume:number;setVolume:(value:number)=>void}){
 const panel=document.createElement('fieldset');panel.className='music-settings';panel.id='sound-settings';
 const legend=document.createElement('legend');legend.textContent='Sound';panel.append(legend);
 const row=document.createElement('div');row.className='music-controls';panel.append(row);
 const toggle=document.createElement('button');toggle.type='button';toggle.id='settings-sound-toggle';row.append(toggle);
 const label=document.createElement('label');label.textContent='Sound Effects Volume';row.append(label);
 const values=document.createElement('span');values.className='music-volume-row';label.append(values);
 const volume=document.createElement('input');volume.type='range';volume.min='0';volume.max='100';volume.step='1';volume.setAttribute('aria-label','Sound Effects Volume');values.append(volume);
 const output=document.createElement('output');values.append(output);
 const sync=()=>{toggle.textContent=`Sound: ${audio.enabled?'On':'Off'}`;toggle.setAttribute('aria-pressed',String(audio.enabled));volume.value=String(Math.round(audio.volume*100));output.textContent=volume.value+'%';};
 toggle.onclick=()=>{document.getElementById('sound')!.click();sync();};
 volume.oninput=()=>{audio.setVolume(Number(volume.value)/100);sync();};
 document.querySelector('#game-menu .dialog-actions')!.before(panel);sync();return sync;
}
