// Extracts building center positions from scene.glb and outputs AR label coordinates.
// Usage: node scripts/extract-positions.mjs
import { NodeIO } from '@gltf-transform/core';
import * as THREE from 'three';

const TARGETS = ['E3', 'E4', 'E4A', 'E6', 'E7', 'E8', 'T-Lab'];
const INPUT = './scene.glb';

const io = new NodeIO();
const doc = await io.read(INPUT);
const root = doc.getRoot();

// Collect world-space bounding boxes for each target building
const boxes = {};

for (const name of TARGETS) {
  const node = root.listNodes().find(n => n.getName() === name);
  if (!node) { console.warn(`WARNING: "${name}" not found in GLB`); continue; }

  // Accumulate all mesh vertex positions under this node
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];

  function visitNode(n, parentMatrix) {
    const localTx = n.getTranslation() || [0,0,0];
    const localRot = n.getRotation()   || [0,0,0,1];
    const localScl = n.getScale()      || [1,1,1];

    const mat = new THREE.Matrix4().compose(
      new THREE.Vector3(...localTx),
      new THREE.Quaternion(...localRot),
      new THREE.Vector3(...localScl)
    );
    const world = parentMatrix ? parentMatrix.clone().multiply(mat) : mat;

    const mesh = n.getMesh();
    if (mesh) {
      for (const prim of mesh.listPrimitives()) {
        const pos = prim.getAttribute('POSITION');
        if (!pos) continue;
        for (let i = 0; i < pos.getCount(); i++) {
          const v = new THREE.Vector3(...pos.getElement(i, []));
          v.applyMatrix4(world);
          if (v.x < min[0]) min[0] = v.x;
          if (v.y < min[1]) min[1] = v.y;
          if (v.z < min[2]) min[2] = v.z;
          if (v.x > max[0]) max[0] = v.x;
          if (v.y > max[1]) max[1] = v.y;
          if (v.z > max[2]) max[2] = v.z;
        }
      }
    }
    for (const child of n.listChildren()) visitNode(child, world);
  }

  visitNode(node, null);
  boxes[name] = { min, max, center: [
    (min[0]+max[0])/2,
    (min[1]+max[1])/2,
    (min[2]+max[2])/2,
  ]};
}

// Find overall bounds across all target buildings
const allCenters = Object.values(boxes).map(b => b.center);
const overallMin = allCenters.reduce((a,c) => [Math.min(a[0],c[0]), Math.min(a[1],c[1]), Math.min(a[2],c[2])], [Infinity,Infinity,Infinity]);
const overallMax = allCenters.reduce((a,c) => [Math.max(a[0],c[0]), Math.max(a[1],c[1]), Math.max(a[2],c[2])], [-Infinity,-Infinity,-Infinity]);

const rangeX = overallMax[0] - overallMin[0] || 1;
const rangeZ = overallMax[2] - overallMin[2] || 1;
const AR_SCALE = 0.9; // AR units to spread labels across (tune this to match your model size)
const AR_Y    = 0.20; // height above model surface

console.log('\n// ── AR label positions extracted from scene.glb ─────────────────────────');
console.log('const LABELS = [');
for (const name of TARGETS) {
  if (!boxes[name]) continue;
  const c = boxes[name].center;
  // Normalise X and Z to [-AR_SCALE/2, AR_SCALE/2]
  const ax = ((c[0] - overallMin[0]) / rangeX - 0.5) * AR_SCALE;
  const az = ((c[2] - overallMin[2]) / rangeZ - 0.5) * AR_SCALE;
  console.log(`  { key: '${name}', pos: '${ax.toFixed(3)} ${AR_Y} ${az.toFixed(3)}' },`);
}
console.log('];\n');
console.log('Raw centers (GLB space):');
for (const [name, b] of Object.entries(boxes)) {
  console.log(`  ${name}: [${b.center.map(v=>v.toFixed(2)).join(', ')}]`);
}
