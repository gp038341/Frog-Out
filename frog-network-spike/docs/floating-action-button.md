# Floating jump/tongue button

Approved left-joystick baseline: `edf064654bfacb2ecb049a277bbe50e8c680991a`, checkpoint `checkpoint/approved-left-floating-joystick`.

The right 28% of the gameplay stage is now an action touch area, separate from the left movement area. A fresh right-thumb touch immediately holds the existing action input and positions the button under that thumb. The button follows that same finger while held, clamped inside the area so it stays visible. Release/cancellation restores the near-right-edge resting position. Dragging the action button never changes aim, movement or action strength, and leaving the region does not release it. Extra fingers cannot steal a held action; native missing-end recovery uses the current touch inventory. Existing independent releases, cancellations, blur/visibility/orientation/viewport resets remain.

No physics, movement, grapple, network, CPU, audio, settings, viewport or game-rule changes. Touch instructions describe the right action area. Desktop controls remain unchanged.

Validation: full automated suite and production build, with focused native Touch and pointer models for varied starts, bounded following, holding outside the region, independent left/right release, extra fingers, interrupted touches, charge/release and airborne tongue holds. The real two-client WebSocket input suite checks action edges and unchanged authoritative input. Physical iPhone/Android acceptance is still required for this new right-button behavior; automated event models are not physical-device testing.

Manual test: hold movement and start action at several right-side points; charge/release, fire/hold/release a grapple, drag the right thumb outside its area, and lift either thumb first. Repeat rapid action taps and return from Settings/background/orientation changes. Both controls should recover immediately without changing the other thumb's state.
