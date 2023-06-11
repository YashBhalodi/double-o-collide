import * as THREE from "three";
import * as CANNON from "cannon-es";
import { plankMaterial } from "./materials";

class Plank {
  constructor({ world, scene }) {
    this.geometry = new THREE.BoxGeometry(10, 10, 0.01);
    this.material = new THREE.MeshBasicMaterial({
      color: "cyan",
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.set(Math.PI / 2, 0, 0);
    this.mesh.receiveShadow = true;

    this.body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.005)),
      material: plankMaterial,
    });
    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );

    scene.add(this.mesh);
    world.addBody(this.body);
  }

  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}

export default Plank;
