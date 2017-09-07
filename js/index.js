let camera,
    scene,
    element = document.getElementById('panoramic'),
    renderer,
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat,
    fov = 70,
    isUserInteracting = false,
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    onMouseDownLon = 0,
    onMouseDownLat = 0,
    ratio = 2.1;

const geometry = new THREE.TorusKnotGeometry( 40, 3, 100, 16 );
const material = new THREE.MeshLambertMaterial({
  color: 0xAAE048,
  transparent: true,
  opacity: 0.3,
  emissive: 0xAAE048,
  emissiveIntensity: 0.9
});

const object = new THREE.Mesh( geometry, material);

let texture = THREE.ImageUtils.loadTexture('img/pano.jpg', new THREE.UVMapping(), function() {
    Events.init();
    Events.animate();
});


const Events = {

  onWindowResized: (event) => {
     renderer.setSize(window.innerWidth, window.innerHeight);

      camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100);
  },

  onDocumentMouseDown: (event) => {
      event.preventDefault();
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
      isUserInteracting = true;
      element.addEventListener('mousemove', Events.onDocumentMouseMove);
      element.addEventListener('mouseup', Events.onDocumentMouseUp);
  },

  onDocumentMouseMove: (event) => {
      lon = (event.clientX - onPointerDownPointerX) * -0.175 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * -0.175 + onPointerDownLat;
  },

  onDocumentMouseUp: (event) => {
      isUserInteracting = false;
      element.removeEventListener('mousemove', Events.onDocumentMouseMove);
      element.removeEventListener('mouseup', Events.onDocumentMouseUp);
  },

  onDocumentMouseWheel: (event) => {
      if (event.wheelDeltaY) {
          fov -= event.wheelDeltaY * 0.05;
      } else if (event.wheelDelta) {
          fov -= event.wheelDelta * 0.05;
      } else if (event.detail) {
          fov += event.detail * 1.0;
      }

      if (fov < 45 || fov > 90) {
          fov = (fov < 45) ? 45 : 90;
      }

      camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100);
  },

  render: () => {

      if (isUserInteracting === false) {
          lon += .05;
      }
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.Math.degToRad(90 - lat);
      theta = THREE.Math.degToRad(lon);
      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
  },

  animate: () => {
      requestAnimationFrame(Events.animate);
      Events.render();
  },

  init: () => {

      camera = new THREE.PerspectiveCamera(fov, ratio, 1, 1000);
      scene = new THREE.Scene();
      let mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({map: texture}));
      mesh.scale.x = -1;
      scene.add(mesh);
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      element.appendChild(renderer.domElement);
      element.addEventListener('mousedown', Events.onDocumentMouseDown);
      element.addEventListener('mousewheel', Events.onDocumentMouseWheel);
      element.addEventListener('DOMMouseScroll', Events.onDocumentMouseWheel);
      window.addEventListener('resize', Events.onWindowResized);
      Events.onWindowResized(null);


      object.position.x = 5
      object.position.y = 5
      object.position.z = 300

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() * 2 + 1;
      object.scale.y = Math.random() * 2 + 1;
      object.scale.z = Math.random() * 2 + 1;

      scene.add(object);
  }
}
