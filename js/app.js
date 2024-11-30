const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('fractalCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Геометрия и шейдер
const geometry = new THREE.PlaneGeometry(2, 2, 1, 1); // Экранное пространство
const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float time;

    void main() {
      vec2 uv = vUv;

      // Преобразование координат для закручивания
      float angle = time + length(uv - 0.5) * 5.0;
      float dist = length(uv - 0.5);
      uv.x += sin(angle) * dist * 0.1;
      uv.y += cos(angle) * dist * 0.1;

      // Генерация мигающего цвета с использованием времени
      float red = 0.5 + 0.5 * sin(time + uv.x * 10.0);
      float green = 0.5 + 0.5 * cos(time + uv.y * 10.0);
      float blue = 0.5 + 0.5 * sin(time + uv.x * 5.0) * cos(time + uv.y * 5.0);

      gl_FragColor = vec4(red, green, blue, 1.0);
    }
  `,
  uniforms: {
    time: { value: 0.0 }
  }
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Камера
camera.position.z = 1;

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.time.value += 0.01; // анимация по времени
  renderer.render(scene, camera);
}

// Обновление размера при изменении окна
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

animate();