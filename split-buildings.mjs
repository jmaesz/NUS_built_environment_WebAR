import { NodeIO } from '@gltf-transform/core';
import { center } from '@gltf-transform/functions';
import { readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BUILDINGS = [
  'CFA Studio',
  'E1', 'E1A', 'E2', 'E2A', 'E3', 'E3A', 'E4', 'E4A', 'E5', 'E6', 'E7', 'E8', 'EA',
  'EW1', 'EW1A',
  'Information Tech',
  'LT1,LT2', 'LT4', 'LT6',
  'Raffles Hall 5', 'Raffles Hall Kuok Foundation Building',
  'Raffles Hall1', 'Raffles Hall2', 'Raffles Hall3', 'Raffles Hall4',
  'SDE1', 'SDE2', 'SDE3', 'SDE4',
  'T-Lab', 'Techno Edge',
];
const INPUT = './frontend/public/scene.glb';
const OUTPUT_DIR = './frontend/public/models';

mkdirSync(OUTPUT_DIR, { recursive: true });

const io = new NodeIO();

for (const buildingName of BUILDINGS) {
  console.log(`Processing ${buildingName}...`);

  const doc = await io.read(INPUT);
  const root = doc.getRoot();

  // Find the target node
  const allNodes = root.listNodes();
  const targetNode = allNodes.find(n => n.getName() === buildingName);

  if (!targetNode) {
    console.log(`  WARNING: node "${buildingName}" not found, skipping`);
    continue;
  }

  // Remove all scenes and rebuild with just the target node
  const scenes = root.listScenes();
  scenes.forEach(scene => {
    scene.listChildren().forEach(child => scene.removeChild(child));
    scene.addChild(targetNode);
  });

  // Remove all top-level nodes that aren't our target or its ancestors
  allNodes.forEach(node => {
    if (node === targetNode) return;
    // detach any node that has no parent (top-level orphan) and isn't our target
    if (!node.getParentNode()) {
      try { node.dispose(); } catch(e) {}
    }
  });

  // Center the model at origin
  await doc.transform(center({ pivot: 'center' }));

  const outPath = join(OUTPUT_DIR, `${buildingName.toLowerCase().replace(/ /g, '-')}.glb`);
  await io.write(outPath, doc);
  console.log(`  -> ${outPath}`);
}

console.log('Done.');
