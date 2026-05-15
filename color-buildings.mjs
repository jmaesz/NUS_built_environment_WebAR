import { NodeIO } from '@gltf-transform/core';

const io = new NodeIO();
const doc = await io.read('scene.glb');
const root = doc.getRoot();

const isBuilding = name =>
  name && !name.startsWith('Not Important') && !name.startsWith('NUScape') && name !== 'No Idea';

// Visually distinct palette (linear sRGB — no gamma correction needed for gltf-transform)
const PALETTE = [
  [0.93, 0.26, 0.26, 1],  // red
  [0.20, 0.60, 0.86, 1],  // sky blue
  [0.22, 0.70, 0.44, 1],  // green
  [0.95, 0.61, 0.07, 1],  // amber
  [0.58, 0.31, 0.86, 1],  // purple
  [0.95, 0.38, 0.58, 1],  // pink
  [0.10, 0.74, 0.74, 1],  // teal
  [0.86, 0.47, 0.15, 1],  // orange
  [0.35, 0.55, 0.27, 1],  // olive
  [0.40, 0.40, 0.82, 1],  // indigo
  [0.78, 0.22, 0.48, 1],  // magenta
  [0.15, 0.52, 0.62, 1],  // steel blue
  [0.85, 0.75, 0.15, 1],  // yellow
  [0.60, 0.20, 0.20, 1],  // dark red
  [0.20, 0.40, 0.65, 1],  // navy
  [0.50, 0.80, 0.35, 1],  // lime
  [0.70, 0.45, 0.20, 1],  // brown
  [0.80, 0.55, 0.75, 1],  // lavender
  [0.10, 0.60, 0.40, 1],  // emerald
  [0.90, 0.35, 0.10, 1],  // burnt orange
];

const greyMat = doc.createMaterial('mat_terrain')
  .setBaseColorFactor([0.55, 0.55, 0.55, 1.0])
  .setMetallicFactor(0.0)
  .setRoughnessFactor(0.95);

let buildingIdx = 0, terrain = 0;

for (const node of root.listNodes()) {
  const name = node.getName();
  const mesh = node.getMesh();
  if (!mesh) continue;

  if (isBuilding(name)) {
    const color = PALETTE[buildingIdx % PALETTE.length];
    const mat = doc.createMaterial(`mat_building_${buildingIdx}`)
      .setBaseColorFactor(color)
      .setMetallicFactor(0.05)
      .setRoughnessFactor(0.75);
    for (const prim of mesh.listPrimitives()) prim.setMaterial(mat);
    console.log(`  [${buildingIdx}] ${name} → rgb(${color.slice(0,3).map(v=>Math.round(v*255)).join(', ')})`);
    buildingIdx++;
  } else {
    for (const prim of mesh.listPrimitives()) prim.setMaterial(greyMat);
    terrain++;
  }
}

await io.write('scene-colored.glb', doc);
console.log(`\nDone — ${buildingIdx} buildings (unique colours) + ${terrain} terrain/misc nodes (grey)`);
console.log('Saved → scene-colored.glb');
