//Create street lamp
function streetLamp(x, z) {
  var loader = new THREE.TextureLoader(),
    texture_black = loader.load("textures/black.jpg"),
    texture_glass = loader.load("textures/glass.jpg");

  var material_black = new THREE.MeshPhongMaterial({
    map: texture_black,
  });

  var material_glass = new THREE.MeshPhongMaterial({
    map: texture_glass,
  });
  var material_white = new THREE.MeshBasicMaterial({ color: 0xffffff });

  var lamp = new THREE.Object3D();

  var geometry_disc_1 = new THREE.CylinderGeometry(5, 10, 200, 32);
  var disc_1 = new THREE.Mesh(geometry_disc_1, material_black);
  disc_1.position.x = x;
  disc_1.position.z = z;
  disc_1.position.y = 0;

  var geometry_cube = new THREE.BoxGeometry(25, 5, 35);
  var cube_1 = new THREE.Mesh(geometry_cube, material_black);
  cube_1.position.x = x;
  cube_1.position.z = z;
  cube_1.position.y = 50;
  
  var geometry_cube = new THREE.BoxGeometry(25, 5, 25);
  var cube_2 = new THREE.Mesh(geometry_cube, material_black);
  cube_2.position.x = x;
  cube_2.position.z = z;
  cube_2.position.y = 60;


  var geometry_sphere = new THREE.SphereGeometry(25, 8, 3, 0, 6.3, 4, 2.4);
  var sphere = new THREE.Mesh(geometry_sphere, material_glass);
  sphere.position.x = x;
  sphere.position.z = z;
  sphere.position.y = 90;
  sphere.rotation.x = Math.PI;

  var geometry_light = new THREE.SphereGeometry(15, 32, 32);
  var light_sphere = new THREE.Mesh(geometry_light, material_white);
  light_sphere.position.x = x;
  light_sphere.position.z = z;
  light_sphere.position.y = 90;


  lamp.add(disc_1)
  lamp.add(cube_1);
  lamp.add(cube_2);
  lamp.add(sphere)
  lamp.add(light_sphere);

  lamp.position.y = 100;
  scene.add(lamp);
}

var camera, scene, renderer;

init();
animate();

function init() {

  //Render definition
  renderer = new THREE.WebGLRenderer({ antialias: true });
  var width = window.innerWidth;
  var height = window.innerHeight;

  //Render settings for making lights work
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  //Create a scene
  scene = new THREE.Scene();

  //Moving camera settings
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.y = 460;
  camera.position.z = 300;
  camera.position.x = 1000;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = 85 * Math.PI / 180;

  //Define lights
  //Just Pi/4 anglee
  spot_light = new THREE.SpotLight(0xffffff, 1);
  spot_light.position.set(300, 200, 150);
  spot_light.castShadow = true;
  spot_light.angle = Math.PI / 4;
  spot_light.distance = 2000;
  spot_light.shadow.mapSize.width = 1024;
  spot_light.shadow.mapSize.height = 1024;
  spot_light.shadow.camera.near = 0.5;
  spot_light.shadow.camera.far = 500;
  scene.add(spot_light);

  //Every direction
  var point_light = new THREE.PointLight( 0xffffff, 2, 100);
  point_light.position.set( 2000, 200, -600);
  point_light.castShadow = true,
  point_light.distance = 1500;
  point_light.shadow.mapSize.width = 1024;
  point_light.shadow.mapSize.height = 1024;
  point_light.shadow.camera.near = 0.5;
  point_light.shadow.camera.far = 1000;
  scene.add(point_light);

  spot_light_2 = new THREE.SpotLight(0xffffff, 3);
  spot_light_2.position.set(1000, 200, 2000);
  spot_light_2.castShadow = true;
  spot_light_2.angle = Math.PI / 4;
  spot_light_2.distance = 2000;
  spot_light_2.shadow.mapSize.width = 1024;
  spot_light_2.shadow.mapSize.height = 1024;
  spot_light_2.shadow.camera.near = 0.5;
  spot_light_2.shadow.camera.far = 500;
  scene.add(spot_light_2);

  //Debugging
  //lightHelper = new THREE.PointLightHelper(point_light, 250);
  //scene.add(lightHelper)

  //lightHelper = new THREE.SpotLightHelper(spot_light);
  //scene.add(lightHelper)

  //Create the world around the threes
  var skyGeo = new THREE.SphereBufferGeometry(3000, 150, 150, 0, 2 * Math.PI, 0, 0.5 * Math.PI);

  //Load the world textures
  var loader = new THREE.TextureLoader(),
    texture = loader.load("textures/universe.png");

  var material = new THREE.MeshPhongMaterial({
    map: texture,
  });

  //Create mesh combining geometry and material 
  var sky = new THREE.Mesh(skyGeo, material);
  sky.material.side = THREE.BackSide;
  scene.add(sky);

  //Create the field
  var textureLoader = new THREE.TextureLoader();
  var fieldGeometry = new THREE.CircleGeometry(3000, 250);
  var texture = textureLoader.load("textures/grasslight-small.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  var plane = new THREE.Mesh(fieldGeometry, new THREE.MeshPhongMaterial({ color: 'green', side: THREE.DoubleSide, map: texture }));
  plane.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 90 * Math.PI / 180));
  plane.receiveShadow = true;
  plane.castShadow = false;
  scene.add(plane);
  plane.name = "plane"

  //Lights for the world
  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  setRule();

  mesh = drawTree(0, 0, 0);
  scene.add(mesh);
  mesh.name = "tree";

  streetLamp(300, 150);
  streetLamp(2000, -600);
  streetLamp(1000, 2000);

}

function animate() {

  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function removeTree() {
  controls.update();
  var selectedObject = scene.getObjectByName("tree");
  scene.remove(selectedObject);
}

function createTree(x, y, z) {
  mesh = drawTree(x, y, z);
  mesh.name = "tree"
  scene.add(mesh);
}

function onDocumentMouseDown(event) {

  var vector = new THREE.Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );
  vector.unproject(camera);
  var raycaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );
  var intersects = raycaster.intersectObject(scene.getObjectByName("plane"));
  if (intersects.length > 0) {
    clicked = intersects[0];
    setParams();
    createTree(clicked.point.x, clicked.point.y, clicked.point.z)
  }
}

document.addEventListener("dblclick", onDocumentMouseDown);
