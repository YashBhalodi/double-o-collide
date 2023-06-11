import * as CANNON from "cannon-es";

const plankMaterial = new CANNON.Material();

const ballMaterial = new CANNON.Material();

const contactMaterial = new CANNON.ContactMaterial(
  plankMaterial,
  ballMaterial,
  {
    friction: 0.7,
    restitution: 0.7,
  }
);

export { plankMaterial, ballMaterial, contactMaterial };
