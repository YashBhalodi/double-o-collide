import * as THREE from "three";
import * as CANNON from "cannon-es";

import { ballMaterial } from "./materials.js";

class Ball {
  constructor({
    world,
    scene,
    radius = 0.2,
    mass = 1,
    initialPosition = { x: 0, y: 0, z: 0 },
    keyBindings,
    name = "Ball",
  }) {
    this.geometry = new THREE.SphereGeometry(radius, 32, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.body = new CANNON.Body({
      mass,
      shape: new CANNON.Sphere(radius),
      material: ballMaterial,
    });
    this.body.position.x = initialPosition.x;
    this.body.position.y = initialPosition.y;
    this.body.position.z = initialPosition.z;
    this.mesh.position.copy(this.body.position);
    scene.add(this.mesh);
    this.body.name = name;
    world.addBody(this.body);

    this.keyBindings = keyBindings;
    this.applyKeyBindings();
  }

  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }

  applyAcceleration(accelerationV3) {
    this.body.applyForce(accelerationV3, this.body.position);
  }

  moveLeft() {
    this.applyAcceleration(new CANNON.Vec3(-1, 0, 0));
  }

  moveRight() {
    this.applyAcceleration(new CANNON.Vec3(1, 0, 0));
  }

  moveForward() {
    this.applyAcceleration(new CANNON.Vec3(0, 0, -1));
  }

  moveBackward() {
    this.applyAcceleration(new CANNON.Vec3(0, 0, 1));
  }

  isOutOfBounds() {
    const { x, y, z } = this.body.position;
    return Math.abs(x) > 5 || Math.abs(z) > 5 || y < -5;
  }

  applyKeyBindings() {
    const { LEFT, RIGHT, FORWARD, BACKWARD } = this.keyBindings;
    this.listener = window.addEventListener("keydown", (e) => {
      e.preventDefault();
      switch (e.code) {
        case LEFT:
          this.moveLeft();
          break;
        case RIGHT:
          this.moveRight();
          break;
        case FORWARD:
          this.moveForward();
          break;
        case BACKWARD:
          this.moveBackward();
          break;
        default:
          break;
      }
    });
  }

  clearKeyBinding() {
    window.removeEventListener("keydown", this.keyBindings);
  }
}

export default Ball;
