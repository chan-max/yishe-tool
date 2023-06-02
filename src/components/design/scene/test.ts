// designiy.onClick((des) => {
//   let {
//     mouse,
//     mainMesh,
//     camera,
//     scene
//   } = des;

//   let raycaster = new Raycaster()
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObject(mainMesh);
//   if (intersects.length > 0) {
//     var n = intersects[0].face.normal.clone();
//     n.transformDirection(mainMesh.matrixWorld);
//     n.add(intersects[0].point);

//     let helper = new Object3D();

//     helper.position.copy(intersects[0].point);
//     helper.lookAt(n);

//     var position = intersects[0].point;
//     var size = new Vector3(0.1, 0.1, 0.1);

//     var decalGeometry = new DecalGeometry(mainMesh, position, helper.rotation, size);

//     var decal = new Mesh(decalGeometry, new MeshBasicMaterial({ color: 0xff0000 }));
//     scene.add(decal);
//   }
// });