import { useEffect } from "react";
import {
  Clock,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { type Font, FontLoader } from "three/addons/loaders/FontLoader.js";

interface TextConfig {
  text: string;
  url: string;
}

export function ThreeCanvas() {
  useEffect(() => {
    Three();
  }, []);

  return (
    <div id="three-canvas" className="absolute top-0 left-0 w-full h-full" />
  );
}

function Three() {
  const canvas = document.getElementById("three-canvas");
  if (!canvas) {
    throw new Error("Canvas not found");
  }

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 1000);
  camera.position.set(0, 0, 100);
  camera.lookAt(scene.position);

  // 背景
  const backgroundGeometry = new PlaneGeometry(2, 2);
  const rainbowMaterial = new ShaderMaterial({
    fragmentShader: `
    uniform vec2 resolution;
    uniform float iTime;
    varying vec2 vUv;

    void main() {
        vec2 st = gl_FragCoord.xy / resolution.xy;

        vec3[4] colors = vec3[](
            vec3(1.0, 0.0, 0.0),
            vec3(0.0, 0.0, 1.0),
            vec3(0.0, 1.0, 0.0),
            vec3(1.0, 1.0, 0.0)
        );

        vec3 color = mix(
            mix(-sin(colors[0] * iTime), cos(colors[1] * iTime), st.x),
            mix(cos(colors[2] * iTime), sin(colors[3] * iTime), st.x),
            st.y
        );

        gl_FragColor = vec4(color, 1.0);
    }
    `,
    vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    uniforms: {
      resolution: {
        value: new Vector2(
          window.innerWidth * window.devicePixelRatio,
          window.innerHeight * window.devicePixelRatio,
        ),
      },
      iTime: { value: 0 },
    },
  });

  const background = new Mesh(backgroundGeometry, rainbowMaterial);
  scene.add(background);

  let textMeshes: Mesh[] = [];
  const textConfigs: TextConfig[] = [
    { text: "Blog", url: "https://yashikota.com/blog" },
    { text: "Slides", url: "https://yashikota.com/slides" },
    { text: "Works", url: "https://yashikota.com/works" },
    { text: "Games", url: "https://yashikota.com/games" },
    { text: "Gallery", url: "https://yashikota.com/gallery" },
    { text: "About", url: "https://yashikota.com/about" },
  ];

  function randomPosition(): [number, number, number] {
    return [Math.random() * 1.6 - 0.8, Math.random() * 1.6 - 0.8, 0];
  }

  function randomDirection(): [number, number] {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos(angle) * 0.003, Math.sin(angle) * 0.003];
  }

  const loader = new FontLoader();
  loader.load(
    "https://threejs-plactice.vercel.app/fontloader/fonts/helvetiker_regular.typeface.json",
    (font) => {
      textMeshes = textConfigs.map((config) => {
        const mesh = createTextMesh(font, config);
        mesh.position.set(...randomPosition());
        mesh.userData.direction = randomDirection();
        mesh.userData.url = config.url;
        return mesh;
      });

      const textMaterial = new MeshBasicMaterial({
        color: 0xffffff,
      });

      for (const mesh of textMeshes) {
        mesh.material = textMaterial;
        scene.add(mesh);
        mesh.geometry.computeBoundingBox();
      }

      animate();
    },
  );

  // raycaster
  const raycaster = new Raycaster();
  const mouse = new Vector2();

  canvas.addEventListener("click", onMouseClick, false);

  function onMouseClick(event: MouseEvent) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(textMeshes);

    if (intersects.length > 0) {
      const url = intersects[0].object.userData.url;
      window.location.href = url;
    }
  }

  // レンダラーを作成
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: false,
    stencil: false,
    depth: true,
  });
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height);

  canvas.appendChild(renderer.domElement);

  function handleOnResize() {
    if (!canvas) {
      return;
    }
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    rainbowMaterial.uniforms.resolution.value = new Vector2(
      width * window.devicePixelRatio,
      height * window.devicePixelRatio,
    );
    camera.updateProjectionMatrix();
  }
  handleOnResize();
  window.addEventListener("resize", handleOnResize);

  const clock = new Clock();

  function animate() {
    requestAnimationFrame(animate);
    rainbowMaterial.uniforms.iTime.value = clock.getElapsedTime();

    for (const mesh of textMeshes) {
      if (mesh.geometry.boundingBox) {
        const direction = mesh.userData.direction as [number, number];
        mesh.position.x += direction[0];
        mesh.position.y += direction[1];

        const boundingBox = mesh.geometry.boundingBox;
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;

        // X軸の反転
        if (
          mesh.position.x + width / 2 > 1 ||
          mesh.position.x - width / 2 < -1
        ) {
          direction[0] *= -1;
        }

        // Y軸の反転
        if (
          mesh.position.y + height / 2 > 1 ||
          mesh.position.y - height / 2 < -1
        ) {
          direction[1] *= -1;
        }
      }
    }

    renderer.render(scene, camera);
  }
}

function createTextMesh(font: Font, config: TextConfig): Mesh {
  const geometry = new TextGeometry(config.text, {
    font,
    size: 0.15,
    depth: 0.01,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 5,
  });

  return new Mesh(geometry);
}
