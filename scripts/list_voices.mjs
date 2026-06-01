import { MsEdgeTTS } from 'msedge-tts';
const tts = new MsEdgeTTS();
const voices = await tts.getVoices();
const english = voices.filter(v => v.Locale.startsWith('en-'));
english.forEach(v => console.log(`${v.Locale.padEnd(10)} ${v.Gender.padEnd(8)} ${v.ShortName}`));
