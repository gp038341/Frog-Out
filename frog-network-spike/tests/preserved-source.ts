import {readFileSync} from 'node:fs';
/** Historical baseline hashes still apply after reversing only documented M8 adapter edits.
 * arenas.test.ts independently requires those exact edits and the approved M7 full-file hash.
 */
export function m9PreservedSource(path:string){let source=multitouchPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-9-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}
export function iphonePreservedSource(path:string){let source=m9PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-reliability-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}
export function preservedSource(path:string){
 let source=iphonePreservedSource(path);
 const manifest=JSON.parse(readFileSync(new URL('../docs/milestone-8-adapter-preservation.json',import.meta.url),'utf8'));
 for(const change of manifest.files[path]?.changes??[])source=source.replace(change.from,change.to);
 return source;
}

export function multitouchPreservedSource(path:string){let source=recoveryPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-multitouch-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function recoveryPreservedSource(path:string){let source=viewportPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-recovery-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function viewportPreservedSource(path:string){let source=m11PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/iphone-viewport-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m11PreservedSource(path:string){let source=m12PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-11-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m12PreservedSource(path:string){let source=m13PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-12-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m13PreservedSource(path:string){let source=refinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-13-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function refinementPreservedSource(path:string){let source=m14PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-13-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m14PreservedSource(path:string){let source=bathhousePreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-14-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function bathhousePreservedSource(path:string){let source=toyshopRosterPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/bubblewash-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

function toyshopRosterPreservedSource(path:string){let source=soapPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/toyshop-roster-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function soapPreservedSource(path:string){let source=m15PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/soap-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m15PreservedSource(path:string){let source=m16PreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-15-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function m16PreservedSource(path:string){let source=classicPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/milestone-16-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosDPreservedSource(path:string){let source=chaosDRefinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-d-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosCWindPreservedSource(path:string){let source=chaosDPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-c-wind-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosCContactPreservedSource(path:string){let source=chaosCWindPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-c-contact-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosCRefinementPreservedSource(path:string){let source=chaosCContactPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-c-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosCPreservedSource(path:string){let source=chaosCRefinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-c-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosBRefinementPreservedSource(path:string){let source=chaosCPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-b-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosBPreservedSource(path:string){let source=chaosBRefinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-b-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosPreservedSource(path:string){let source=chaosBPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-a-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function classicPreservedSource(path:string){let source=chaosPreservedSource(path);const m17=JSON.parse(readFileSync(new URL('../docs/milestone-17-preservation.json',import.meta.url),'utf8'));for(const c of m17.files[path]?.changes??[])source=source.replace(c.from,c.to);const poof=JSON.parse(readFileSync(new URL('../docs/tag-poof-preservation.json',import.meta.url),'utf8'));for(const c of poof.files[path]?.changes??[])source=source.replace(c.from,c.to);const m=JSON.parse(readFileSync(new URL('../docs/classic-tag-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosDRefinementPreservedSource(path:string){let source=chaosDLabelPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-d-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosDLabelPreservedSource(path:string){let source=chaosDBubblePreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-d-label-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosDBubblePreservedSource(path:string){let source=chaosDBalloonPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-d-bubble-shake-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosDBalloonPreservedSource(path:string){let source=chaosEPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-d-balloon-launch-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosEPreservedSource(path:string){let source=chaosERefinementPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-e-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function chaosERefinementPreservedSource(path:string){let source=stickyPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/chaos-e-refinement-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function stickyPreservedSource(path:string){let source=departurePreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/sticky-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

export function departurePreservedSource(path:string){let source=botPreservedSource(path);const m=JSON.parse(readFileSync(new URL('../docs/departure-preservation.json',import.meta.url),'utf8'));for(const c of m.files[path]?.changes??[])source=source.replace(c.from,c.to);return source;}

/** Reverse only owner-authorized CPU participant adapters before historical preservation checks. */
export function botPreservedSource(path:string){const source=b1PreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-a-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** B1 is a CPU-only controller replacement; retain Bot A historical source checks. */
export function b1PreservedSource(path:string){const source=b2PreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-b1-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** B2 only supplies tactical destinations to the approved B1 navigator. */
export function b2PreservedSource(path:string){const source=b2rPreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-b2-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the B2 movement coordination correction for historical checks. */
export function b2rPreservedSource(path:string){const source=b2sPreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-b2r-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the focused B2 pursuit/spring/bubble correction for historical evidence. */
export function b2sPreservedSource(path:string){const source=b2iPreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-b2s-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse the owner-authorized independent tactics refinement for historical checks. */
export function b2iPreservedSource(path:string){const source=botCPreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-b2i-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** C changes AI perception/execution only; historical B2 checks use its approved source. */
export function botCPreservedSource(path:string){const source=rulesGuidePreservedSource(path),m=JSON.parse(readFileSync(new URL('../docs/bot-c-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the individually authorized rules/help presentation consolidation. */
export function rulesGuidePreservedSource(path:string,raw=false){const source=soundCoveragePreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/rules-guide-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the owner-authorized sound coverage layer before historical checks. */
export function soundCoveragePreservedSource(path:string,raw=false){const source=lobbyRecoveryPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/sound-coverage-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the client lifecycle/Ready recovery correction for historical checks. */
export function lobbyRecoveryPreservedSource(path:string,raw=false){const source=backgroundMusicPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/lobby-recovery-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the owner-authorized background music integration for historical checks. */
export function backgroundMusicPreservedSource(path:string,raw=false){const source=musicMoodPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/background-music-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the requested music mood/master-button refinement. */
export function musicMoodPreservedSource(path:string,raw=false){const source=globalSettingsPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/music-mood-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the authorized global settings access layer for historical checks. */
export function globalSettingsPreservedSource(path:string,raw=false){const source=soundSettingsPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/global-settings-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the approved audio-settings relocation for historical assertions. */
export function soundSettingsPreservedSource(path:string,raw=false){const source=joystickPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/sound-settings-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only authorized analog/floating joystick adapters for historical checks. */
export function joystickPreservedSource(path:string,raw=false){const source=floatingActionPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/joystick-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only the right floating action area for historical assertions. */
export function floatingActionPreservedSource(path:string,raw=false){const source=modifierTweaksPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/floating-action-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Reverse only owner-directed wind/Pogo/bubble refinements for historical assertions. */
export function modifierTweaksPreservedSource(path:string,raw=false){const source=scoringPreservedSource(path,raw),m=JSON.parse(readFileSync(new URL('../docs/modifier-tweaks-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??source;}

/** Recover the approved pre-scoring source for historical preservation assertions. */
export function scoringPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/scoring-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??matchChromePreservedSource(path,raw);}

/** Reverse only the approved match-chrome relocation for historical assertions. */
export function matchChromePreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/match-chrome-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??poisonHudPreservedSource(path,raw);}

/** Reverse only the requested removal of redundant Poison Tag score readouts. */
export function poisonHudPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/poison-hud-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??resultsPreservedSource(path,raw);}

/** Reverse only the cartoon results adapter for historical baseline checks. */
export function resultsPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/cartoon-results-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??resultsRefinementPreservedSource(path,raw);}

export function resultsRefinementPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/results-refinement-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??spaciousnessPreservedSource(path,raw);}

/** Reverse only the authorized spawn/layout experiment for historical assertions. */
export function spaciousnessPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/spaciousness-a-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??locatorPreservedSource(path,raw);}

/** Reverse only the requested local-frog countdown/swap pointer. */
export function locatorPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/local-locator-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??swapProtectionPreservedSource(path,raw);}

/** Reverse only the requested Swap Hop protection duration increase. */
export function swapProtectionPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/swap-protection-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??roundReadoutPreservedSource(path,raw);}

/** Reverse only the requested round-number readouts. */
export function roundReadoutPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/round-readout-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??botCompetitivenessPreservedSource(path,raw);}

/** Reverse only authorized CPU planning/execution changes for historical guards. */
export function botCompetitivenessPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/bot-competitiveness-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??finalPodiumPreservedSource(path,raw);}

/** Reverse only final-standings presentation for earlier approval guards. */
export function finalPodiumPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/final-podium-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??resultsWindowPreservedSource(path,raw);}

/** Reverse only results-window sizing for historical approval checks. */
export function resultsWindowPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/results-window-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??desktopMousePreservedSource(path,raw);}

/** Reverse only optional desktop mouse input adapters for earlier approval guards. */
export function desktopMousePreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/desktop-mouse-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??mouseFreezePreservedSource(path,raw);}

/** Reverse only the requested mouse-action, transient HUD and Freeze AI corrections. */
export function mouseFreezePreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/mouse-classic-freeze-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??soundHatsPreservedSource(path,raw);}

/** Reverse only requested soundtrack, victory cue and cosmetic rendering refinements. */
export function soundHatsPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/sound-hats-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??audioHatRevisionPreservedSource(path,raw);}

/** Reverse only owner-directed hat seating, original eyelid fill, music reassignment and applause. */
export function audioHatRevisionPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/audio-hat-revision-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??recordedAudioPreservedSource(path,raw);}

/** Reverse only recorded round audio and its countdown activation for older approval guards. */
export function recordedAudioPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/recorded-round-audio-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??chaseMusicPreservedSource(path,raw);}

/** Reverse only the owner-requested gameplay track replacement and attribution. */
export function chaseMusicPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/chase-music-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??heroicMusicPreservedSource(path,raw);}

/** Reverse only the owner-selected Heroic Age gameplay recording and credit. */
export function heroicMusicPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/heroic-age-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??creativePreservedSource(path,raw);}

/** Reverse only the explicitly authorized, reversible Pond Press visual experiment. */
export function creativePreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/creative-identity/preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??cosmeticOptionsPreservedSource(path,raw);}

/** Recover the approved pre-options cosmetics for historical byte-preservation guards.
 * cosmetic-options.test.ts separately verifies the exact current adapters and protected systems. */
export function cosmeticOptionsPreservedSource(path:string,raw=false){const m=JSON.parse(readFileSync(new URL('../docs/cosmetic-options-preservation.json',import.meta.url),'utf8'));return m.files[path]?.original??readFileSync(new URL(`../${path}`,import.meta.url),raw?undefined:'utf8');}
