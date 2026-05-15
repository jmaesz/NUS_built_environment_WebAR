// Simulates CloudCompare PCV (Ambient Occlusion / sky illuminance) using vertex normals.
// Illuminance = how much of the sky each face sees.
// Roof (normal.y ≈ 1) → illuminance 1.0 → RED
// Walls (normal.y ≈ 0) → illuminance 0.5 → GREEN
// Overhangs/underside (normal.y < 0) → illuminance low → BLUE
import { NodeIO, Accessor } from '@gltf-transform/core';

const io = new NodeIO();
const doc = await io.read('scene.glb');
const root = doc.getRoot();
const buffer = root.listBuffers()[0];

const isBuilding = name =>
  name && !name.startsWith('Not Important') && !name.startsWith('NUScape') && name !== 'No Idea';

// Blue → Green → Red colormap (matches CloudCompare "Blue+Green+" ramp)
function blueGreenRed(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.5) {
    const s = t * 2;
    return [0, s, 1 - s]; // blue → green
  } else {
    const s = (t - 0.5) * 2;
    return [s, 1 - s, 0]; // green → red
  }
}

// PCV: average illuminance from multiple sky directions (simulates CloudCompare PCV)
// Simple version: illuminance = max(0, dot(normal, upward)) averaged over a hemisphere
// We approximate with 5 sky directions: straight up + 4 diagonal
const SKY_DIRS = [
  [0, 1, 0],
  [0.5, 0.866, 0], [-0.5, 0.866, 0],
  [0, 0.866, 0.5], [0, 0.866, -0.5],
];

function pcv(nx, ny, nz) {
  let sum = 0;
  for (const [dx, dy, dz] of SKY_DIRS) {
    sum += Math.max(0, nx*dx + ny*dy + nz*dz);
  }
  return sum / SKY_DIRS.length;
}

let buildings = 0, terrain = 0;

for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;

  if (isBuilding(node.getName())) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      const nrm = prim.getAttribute('NORMAL');
      if (!pos) continue;
      const n = pos.getCount();
      const colors = new Float32Array(n * 3);

      for (let i = 0; i < n; i++) {
        let illum;
        if (nrm) {
          const [nx, ny, nz] = nrm.getElement(i, []);
          illum = pcv(nx, ny, nz);
        } else {
          // No normals: fall back to normalised Y height
          const y = pos.getElement(i, [])[1];
          illum = 0.5; // neutral green if no normals
        }
        const [r, g, b] = blueGreenRed(illum);
        colors[i*3] = r; colors[i*3+1] = g; colors[i*3+2] = b;
      }

      prim.setAttribute('COLOR_0',
        doc.createAccessor().setType(Accessor.Type.VEC3).setArray(colors).setBuffer(buffer));
      let mat = prim.getMaterial();
      if (!mat) { mat = doc.createMaterial(); prim.setMaterial(mat); }
      mat.setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(0.9);
    }
    console.log(`  PCV: ${node.getName()}`);
    buildings++;
  } else {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const grey = new Float32Array(pos.getCount() * 3).fill(0.45);
      prim.setAttribute('COLOR_0',
        doc.createAccessor().setType(Accessor.Type.VEC3).setArray(grey).setBuffer(buffer));
      let mat = prim.getMaterial();
      if (!mat) { mat = doc.createMaterial(); prim.setMaterial(mat); }
      mat.setBaseColorFactor([1, 1, 1, 1]);
    }
    terrain++;
  }
}

await io.write('scene-pcv.glb', doc);
console.log(`\nDone — ${buildings} buildings (PCV illuminance) + ${terrain} terrain`);
console.log('Saved → scene-pcv.glb');
