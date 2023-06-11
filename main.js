import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Plank from "./Objects/planks.js";
import Ball from "./Objects/ball.js";
import { contactMaterial } from "./Objects/materials.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("gray");

const camera = new THREE.PerspectiveCamera(
  35, // fov
  window.innerWidth / window.innerHeight, // aspect
  1, // near
  100 // far
);
camera.position.set(0, 30, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const orbitControl = new OrbitControls(camera, renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const directionalLight = new THREE.DirectionalLight();
directionalLight.castShadow = true;
scene.add(directionalLight);

const plank = new Plank({
  world,
  scene,
});

const balls = [
  {
    initialPosition: { x: 2, y: 5, z: 2 },
    keyBindings: {
      LEFT: "KeyA",
      RIGHT: "KeyD",
      FORWARD: "KeyW",
      BACKWARD: "KeyS",
    },
    name: "Yash",
  },
  {
    initialPosition: { x: 0, y: 5, z: 0 },
    keyBindings: {
      LEFT: "ArrowLeft",
      RIGHT: "ArrowRight",
      FORWARD: "ArrowUp",
      BACKWARD: "ArrowDown",
    },
    name: "Swati",
  },
];

const ballBodies = balls.map((ball) => new Ball({ world, scene, ...ball }));

world.addContactMaterial(contactMaterial);

const animate = () => {
  world.step(1 / 60);
  plank.update();
  ballBodies.forEach((ball) => ball.update());

  orbitControl.update();

  if (ballBodies.some((b) => b.isOutOfBounds())) {
    console.log(
      "Game Over: ",
      ballBodies.find((b) => b.isOutOfBounds()).body.name + " out of bounds"
    );
    cancelAnimationFrame(animate);
    return;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

renderer.setAnimationLoop(animate);
