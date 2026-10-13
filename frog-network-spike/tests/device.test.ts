import {test} from 'node:test';import assert from 'node:assert/strict';import {mobileControlDevice} from '../src/input/device';
test('touch UI is eligible on phones/tablets but not desktop PCs, including touchscreen PCs',()=>{
 for(const [ua,platform,points,expected]of[
 ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome','Win32',10,false],
 ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome','Win32',0,false],
 ['Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari','MacIntel',0,false],
 ['Mozilla/5.0 (X11; Linux x86_64) Firefox','Linux x86_64',0,false],
 ['Mozilla/5.0 (iPhone; CPU iPhone OS) Mobile Safari','iPhone',5,true],
 ['Mozilla/5.0 (Linux; Android 15) Chrome Mobile','Linux armv8l',5,true],
 ['Mozilla/5.0 (Linux; Android 15) Chrome','Linux armv8l',5,true],
 ['Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari','MacIntel',5,true],
 ['Mozilla/5.0 (iPad; CPU OS) Safari','iPad',5,true]
 ]as const)assert.equal(mobileControlDevice(ua,platform,points),expected,ua);
});
