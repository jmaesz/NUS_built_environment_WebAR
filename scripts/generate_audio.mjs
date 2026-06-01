import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const text = `Southeast Asia's first net-zero energy building, opened in 2019 and designed by Serie Architects and Multiply Architects. Features a large rooftop PV array generating around 500 kilowatt hours per day, chilled ceilings, natural ventilation, a smart building management system, and exposed building services as a living learning tool. Holds the BCA Green Mark 2021 Platinum Positive Energy Award.`;

const tts = new MsEdgeTTS();
await tts.setMetadata('en-US-AvaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

const { audioStream } = await tts.toStream(text);
await pipeline(audioStream, createWriteStream('../frontend/public/audio/SDE4.mp3'));
console.log('Done: ../frontend/public/audio/SDE4.mp3');
