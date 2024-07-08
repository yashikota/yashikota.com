import {
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Vector2,
    WebGLRenderer,
    Clock,
} from "three";

const container = document.getElementById("three-canvas");
if (!container) {
    throw new Error("Canvas Container not found");
}

const scene = new Scene();
const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);

const geometry = new PlaneGeometry(2, 2);
const material = new ShaderMaterial({
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

const mesh = new Mesh(geometry, material);
scene.add(mesh);

const renderer = new WebGLRenderer({
    antialias: true,
    alpha: false,
    stencil: false,
    depth: true,
});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

function handleOnResize() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.resolution.value = new Vector2(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio,
    );
    camera.updateProjectionMatrix();
}
handleOnResize();
window.addEventListener("resize", handleOnResize);

const clock = new Clock();

function animate() {
    requestAnimationFrame(animate);
    material.uniforms.iTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}
animate();
