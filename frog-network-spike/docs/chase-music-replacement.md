# Chase music playtest candidate

Baseline: e1783c166bb7358f447eb55ad10910f7151b8f92, checkpoint/pre-chase-music-replacement.

Replaces only gameplay recording with Run Amok by Kevin MacLeod, CC BY 4.0, original 148 BPM comic-action orchestration. Driving strings, brass, woodwinds and percussion replace the mellower exploration track. 32-bar excerpt with 80ms cyclic crossfade; no pitch/speed manipulation. Settings includes permanent attribution, source/author and license links and edit notice. Local asset has a new URL to avoid stale cached audio.

Existing announcement/countdown start, mood switching, lobby music, applause, master Sound On, volume, storage, unlock, visibility handling and two-source playback remain unchanged. All server/game/input/cosmetic sources protected. Stop for listening approval; energy/fun are subjective and cannot be established by automated tests.

Validation: all 496 automated tests passed, production build passed (existing Phaser size warning). Two independent local browser clients created/joined a room and started Classic Tag; the decoded new track was active during announcement/countdown, exactly two music sources remained, applause preloaded, settings mute worked and no page errors occurred. Physical listening acceptance remains with the user.
