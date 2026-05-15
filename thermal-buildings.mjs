import { NodeIO, Accessor } from '@gltf-transform/core';

const io = new NodeIO();
const doc = await io.read('scene.glb');
const root = doc.getRoot();
const buffer = root.listBuffers()[0];

const isBuilding = name =>
  name && !name.startsWith('Not Important') && !name.startsWith('NUScape') && name !== 'No Idea';

// Jet colormap: t=0 → deep blue, t=1 → dark red
function jet(t) {
  const c = v => Math.max(0, Math.min(1, v));
  return [c(1.5 - Math.abs(4*t-3)), c(1.5 - Math.abs(4*t-2)), c(1.5 - Math.abs(4*t-1))];
}

// Pass 1 — find global Y range across all building vertices
let minY = Infinity, maxY = -Infinity;
for (const node of root.listNodes()) {
  if (!node.getMesh() || !isBuilding(node.getName())) continue;
  for (const prim of node.getMesh().listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    if (!pos) continue;
    for (let i = 0; i < pos.getCount(); i++) {
      const y = pos.getElement(i, [])[1];
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const yRange = Math.max(maxY - minY, 0.001);
console.log(`Building Y range: ${minY.toFixed(3)} → ${maxY.toFixed(3)}`);

// Pass 2 — assign per-vertex thermal colours
let buildings = 0, terrain = 0;

for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;

  if (isBuilding(node.getName())) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const n = pos.getCount();
      const colors = new Float32Array(n * 3);

      for (let i = 0; i < n; i++) {
        const y = pos.getElement(i, [])[1];
        const t = (y - minY) / yRange;          // 0=bottom, 1=top
        const thermalT = 0.90 - t * 0.82;       // top=0.90(red), bottom=0.08(blue)
        const [r, g, b] = jet(thermalT);
        colors[i*3] = r; colors[i*3+1] = g; colors[i*3+2] = b;
      }

      prim.setAttribute('COLOR_0',
        doc.createAccessor().setType(Accessor.Type.VEC3).setArray(colors).setBuffer(buffer));

      // White base colour so vertex colours render as-is
      let mat = prim.getMaterial();
      if (!mat) { mat = doc.createMaterial(); prim.setMaterial(mat); }
      mat.setBaseColorFactor([1, 1, 1, 1]);
    }
    console.log(`  THERMAL: ${node.getName()}`);
    buildings++;
  } else {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;
      const n = pos.getCount();
      const grey = new Float32Array(n * 3).fill(0.55);
      prim.setAttribute('COLOR_0',
        doc.createAccessor().setType(Accessor.Type.VEC3).setArray(grey).setBuffer(buffer));
      let mat = prim.getMaterial();
      if (!mat) { mat = doc.createMaterial(); prim.setMaterial(mat); }
      mat.setBaseColorFactor([1, 1, 1, 1]);
    }
    terrain++;
  }
}

await io.write('scene-thermal.glb', doc);
console.log(`\nDone — ${buildings} buildings (thermal) + ${terrain} terrain (grey)`);
console.log('Saved → scene-thermal.glb');
