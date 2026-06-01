import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const BUILDINGS = {
  'CELC':  `NUS's dedicated academic unit for English language and communication skills, serving students across all faculties. Located at 10 Architecture Drive within the SDE precinct, the building benefits from surrounding greenery and tree canopy that moderates the urban heat island effect around the site.`,
  'E1':    `One of the core teaching and office blocks of NUS's College of Design and Engineering. The building is part of the 1970s Kent Ridge campus masterplan and is connected via sheltered corridors; mature trees along Engineering Drive provide partial shading to the building envelope.`,
  'E1A':   `Houses the Department of Civil and Environmental Engineering and the Department of Industrial Systems Engineering and Management, along with EDIC's assembly and training workshops. The building's research focus on environmental engineering aligns with ongoing campus-wide sustainability initiatives to reduce embodied carbon in civil infrastructure.`,
  'E2':    `A large central engineering block forming the spine of the engineering precinct, housing faculty offices and a canteen. Its central position on the hillside campus means it is shaded by surrounding blocks in the morning, but the west-facing facades receive significant afternoon solar gain.`,
  'E2A':   `Home of the Engineering Design and Innovation Centre, featuring design studios, an electronics workshop, and an immersive reality lab. The colourful vertical banner facade also serves a passive function, providing partial shading to the building's glazed surfaces.`,
  'E3':    `Contains the Central Workshop, seminar rooms, active learning rooms, and student amenities serving the wider engineering precinct. The building is connected to E4 via sheltered walkways with yellow-painted ceilings — a campus landmark — that also reduce direct solar exposure for pedestrians.`,
  'E3A':   `Houses the Department of Materials Science and Engineering's lab offices and research laboratories. The department's research into sustainable materials, including low-carbon concrete and recyclable composites, directly supports Singapore's Green Plan 2030 goals.`,
  'E4':    `Houses the Department of Electrical and Computer Engineering and an Engineering Fabrication Lab. Retrofitted with a distinctive faceted aluminium screen facade by AR43 Architects, the building received the BCA Green Mark Platinum award in 2015 — one of the highest green building ratings in Singapore.`,
  'E4A':   `A supplementary engineering block adjacent to E4, providing additional office, laboratory, and teaching space for the College of Design and Engineering. Like E4, its location within the engineering precinct benefits from the extensive mature tree canopy along Engineering Drive 3.`,
  'E5':    `Primary home of the Department of Chemical and Biomolecular Engineering, housing teaching labs, research facilities, and faculty offices. Research in green chemistry and sustainable bioprocessing at E5 contributes to Singapore's circular economy and net-zero carbon ambitions.`,
  'E6':    `An engineering block associated with the Department of Civil and Environmental Engineering, providing large-format structural, hydraulic, and environmental testing laboratories. Research on flood-resilient infrastructure and sustainable drainage systems conducted here supports Singapore's climate adaptation planning.`,
  'E8':    `Located at 1 Engineering Drive 3, E8 functions as Engineering Workshop 2, supporting fabrication, prototyping, and machining activities. Workshop buildings like E8 are being studied as part of NUS's campus sustainability programme to identify opportunities for waste heat recovery from machining operations.`,
  'EA':    `The flagship administrative and events building of NUS's College of Design and Engineering, housing the Dean's Office, student programme offices, the Innovation and Design Hub, and the Engineering Auditorium lecture theatre. A rooftop garden and planted terraces on the upper levels contribute to biodiversity and passive cooling of the building envelope.`,
  'EW1':   `A dedicated workshop block in the SDE precinct area, supporting practical fabrication and prototyping activities for College of Design and Engineering students. Its proximity to the SDE green precinct exposes it to the landscape buffer that moderates heat and noise from workshop operations.`,
  'EW1A':  `An annex workshop block adjacent to EW1, providing supplementary fabrication and storage space for the College of Design and Engineering. As the smallest building by total energy in this dataset, it is a candidate for electrification and solar panel installation under NUS's campus decarbonisation roadmap.`,
  'SDE1':  `A net-zero energy retrofit of a 1970s building completed in 2023, housing the Department of Architecture. Features light shelves, solar radiation screens, a hybrid cooling system, and a lush courtyard jungle garden. Achieved an Energy Use Intensity of 41 kilowatt hours per square metre per year in 2022 and holds the BCA Green Mark Platinum award.`,
  'SDE2':  `One of the original SDE campus buildings at 2 Architecture Drive, housing departments including Real Estate and other Built Environment disciplines. Surrounded by the mature landscaping of the Architecture Drive corridor, which provides significant shading to the building's east and west facades throughout the day.`,
  'SDE3':  `The primary architecture studio building, renovated in 2023 with an exposed structural frame retained to minimise embodied carbon, alongside new maker spaces, flexible studios, and a hybrid cooling system. Achieved an Energy Use Intensity of 43 kilowatt hours per square metre per year and won the 2024 Society of Facade Engineers Project of the Year International Sustainability Award.`,
  'SDE4':  `Southeast Asia's first net-zero energy building, opened in 2019 and designed by Serie Architects and Multiply Architects. Features a large rooftop photovoltaic array generating approximately 500 kilowatt hours per day, chilled ceilings, natural ventilation, a smart building management system, and exposed building services as a living learning tool. Holds the BCA Green Mark 2021 Platinum Positive Energy Award.`,
  'T-Lab': `A national defence research and development institute established in 2000 through a partnership between MINDEF and NUS, conducting research in aeronautical sciences, electromagnetics, and information security. As the highest energy consumer on campus by a wide margin, T-Lab is a priority target for NUS's campus decarbonisation strategy.`,
};

const tts = new MsEdgeTTS();
await tts.setMetadata('en-US-AvaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

for (const [name, text] of Object.entries(BUILDINGS)) {
  const filename = `../frontend/public/audio/${name}.mp3`;
  const { audioStream } = await tts.toStream(text);
  await pipeline(audioStream, createWriteStream(filename));
  console.log(`✓ ${filename}`);
}

console.log('\nAll 20 buildings done.');
