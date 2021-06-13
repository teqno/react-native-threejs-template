import * as THREE from "three";

export interface BodyBase {
  object: THREE.Object3D;
  collisionBox: [number, number];
}
