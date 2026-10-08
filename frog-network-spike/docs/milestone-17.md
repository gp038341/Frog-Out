# Milestone 17 candidate

Approved Classic Tag baseline: `ae2367b8b04e34ab750712effb683416f2c2e893`, branch `checkpoint/approved-classic-tag`.

Spring surfaces share normal-impact energy response: launch = min(18, sqrt(12² + 0.55 × max(0, impact² − 6²))). Impact is positive velocity toward the supporting contact normal, observed before the contact solver removes impact velocity; a bounded 12-tick contact cache retains impact through the existing restitution/contact settling delay. Gentle/resting contacts retain 12; cooldown remains 12 ticks. No lateral bounce impulse. Normal buffered jumps retain priority. All existing lily/sponges/rubber surface IDs use this same localized calculation. Strength is synchronized with authoritative snapshots for bounded particle/squash/audio feedback; approved audio palette retained.

Render URL change deferred: connector does not expose service/subdomain rename. Desired hostname availability and safe supported reassignment have not been established. Existing Free service preserved; no DNS/resource/source configuration changes.
