import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Texture } from 'ogl';

import './Particles.css';

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

// Programming language logos data - Only React and TypeScript
const programmingLanguages = [
  { 
    name: 'React', 
    color: '#61DAFB', 
    symbol: '⚛',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  { 
    name: 'TypeScript', 
    color: '#3178C6', 
    symbol: 'TS',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
  }
];

// Fallback to text-based particles if images fail
const fallbackLanguages = [
  { 
    name: 'React', 
    color: '#61DAFB', 
    symbol: '⚛'
  },
  { 
    name: 'TypeScript', 
    color: '#3178C6', 
    symbol: 'TS'
  }
];

const hexToRgb = hex => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

// Load an HTMLImageElement (not a WebGL texture) so we can draw it to a canvas atlas
const loadImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
};

// Function to create a texture atlas with all programming language logos
const createTextureAtlas = async (gl, languages, atlasSize = 512) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = atlasSize;
  canvas.height = atlasSize;
  
  // Set background to transparent
  ctx.clearRect(0, 0, atlasSize, atlasSize);
  
  const symbolsPerRow = Math.ceil(Math.sqrt(languages.length));
  const symbolSize = Math.floor(atlasSize / symbolsPerRow);
  const padding = 10;
  
  // Store UV coordinates for each language
  const uvCoordinates = {};
  
  // Load all images first (HTMLImageElements)
  const images = await Promise.all(
    languages.map(async (lang) => {
      try {
        return await loadImage(lang.logoUrl);
      } catch {
        // If image fails, create a temporary canvas with the symbol
        const fallbackCanvas = document.createElement('canvas');
        const fctx = fallbackCanvas.getContext('2d');
        fallbackCanvas.width = 128;
        fallbackCanvas.height = 128;
        fctx.clearRect(0, 0, 128, 128);
        fctx.font = `${128 * 0.6}px Arial, sans-serif`;
        fctx.textAlign = 'center';
        fctx.textBaseline = 'middle';
        fctx.fillStyle = lang.color;
        fctx.shadowColor = lang.color;
        fctx.shadowBlur = 12;
        fctx.fillText(lang.symbol, 64, 64);
        const img = new Image();
        img.src = fallbackCanvas.toDataURL();
        await new Promise((r) => (img.onload = r));
        return img;
      }
    })
  );
  
  // Draw each logo to the atlas (synchronously now that all images are loaded)
  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    const img = images[i];
    const row = Math.floor(i / symbolsPerRow);
    const col = i % symbolsPerRow;
    
    const x = col * symbolSize + padding;
    const y = row * symbolSize + padding;
    const actualSize = symbolSize - (padding * 2);
    
    // Draw the logo directly into the atlas, fitting inside the padded cell
    ctx.drawImage(img, x, y, actualSize, actualSize);
    
    // Store UV coordinates (normalized)
    uvCoordinates[lang.name] = {
      u1: x / atlasSize,
      v1: y / atlasSize,
      u2: (x + actualSize) / atlasSize,
      v2: (y + actualSize) / atlasSize
    };
  }
  
  // Create texture from canvas
  const texture = new Texture(gl, {
    image: canvas,
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE
  });
  
  return { texture, uvCoordinates };
};

// Function to create a text-based atlas (fallback)
const createTextAtlas = (gl, languages, atlasSize = 512) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = atlasSize;
  canvas.height = atlasSize;
  
  // Set background to transparent
  ctx.clearRect(0, 0, atlasSize, atlasSize);
  
  const symbolsPerRow = Math.ceil(Math.sqrt(languages.length));
  const symbolSize = Math.floor(atlasSize / symbolsPerRow);
  const padding = 10;
  
  // Store UV coordinates for each language
  const uvCoordinates = {};
  
  languages.forEach((lang, index) => {
    const row = Math.floor(index / symbolsPerRow);
    const col = index % symbolsPerRow;
    
    const x = col * symbolSize + padding;
    const y = row * symbolSize + padding;
    const actualSize = symbolSize - (padding * 2);
    
    // Set text properties
    ctx.font = `${actualSize * 0.6}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = lang.color;
    
    // Add glow effect
    ctx.shadowColor = lang.color;
    ctx.shadowBlur = actualSize * 0.1;
    
    // Draw text
    ctx.fillText(lang.symbol, x + actualSize / 2, y + actualSize / 2);
    
    // Store UV coordinates (normalized)
    uvCoordinates[lang.name] = {
      u1: x / atlasSize,
      v1: y / atlasSize,
      u2: (x + actualSize) / atlasSize,
      v2: (y + actualSize) / atlasSize
    };
  });
  
  // Create texture from canvas
  const texture = new Texture(gl, {
    image: canvas,
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE
  });
  
  return { texture, uvCoordinates };
};

// Function to create a simple text texture (fallback)
const createTextTexture = (gl, text, color, size = 64) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  
  // Set background to transparent
  ctx.clearRect(0, 0, size, size);
  
  // Set text properties
  ctx.font = `${size * 0.6}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  
  // Add glow effect
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.1;
  
  // Draw text
  ctx.fillText(text, size / 2, size / 2);
  
  // Create texture from canvas
  const texture = new Texture(gl, {
    image: canvas,
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE
  });
  
  return texture;
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  attribute vec2 uv;
  attribute vec4 uvBounds;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  varying vec2 vUv;
  varying vec4 vUvBounds;
  
  void main() {
    vRandom = random;
    vColor = color;
    vUv = uv;
    vUvBounds = uvBounds;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  uniform sampler2D uTexture;
  varying vec4 vRandom;
  varying vec3 vColor;
  varying vec2 vUv;
  varying vec4 vUvBounds;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    // Map UV coordinates to texture atlas (flip Y to account for WebGL texture origin)
    vec2 atlasUv;
    atlasUv.x = mix(vUvBounds.x, vUvBounds.z, uv.x);
    atlasUv.y = mix(vUvBounds.w, vUvBounds.y, uv.y);
    
    // Sample the texture from atlas
    vec4 textureColor = texture2D(uTexture, atlasUv);
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      // Mix texture with color and add glow effect
      vec3 finalColor = mix(vColor, textureColor.rgb, 0.8) + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28);
      gl_FragColor = vec4(finalColor, textureColor.a);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      vec3 finalColor = mix(vColor, textureColor.rgb, 0.8) + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28);
      gl_FragColor = vec4(finalColor, circle * textureColor.a);
    }
  }
`;

const Particles = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  showLogos = true,
  className
}) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const initParticles = async () => {
      const container = containerRef.current;
      if (!container) return;

    const renderer = new Renderer({ depth: false, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    const handleMouseMove = e => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);
    const uvBounds = new Float32Array(count * 4);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    // Create texture atlas for programming languages
    let textureAtlas = null;
    let uvCoordinates = {};
    
    // For now, let's use simple particles without complex texture atlas
    console.log('Creating simple particles without texture atlas');
    textureAtlas = createTextTexture(gl, '●', '#ffffff', 64);
    uvCoordinates = {};

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      
      // Choose a random programming language
      const langIndex = Math.floor(Math.random() * fallbackLanguages.length);
      const lang = fallbackLanguages[langIndex];
      const col = hexToRgb(lang.color);
      colors.set(col, i * 3);
      
      // Set UV coordinates for texture mapping (center of point)
      uvs.set([0.5, 0.5], i * 2);
      
      // Set UV bounds for texture atlas - use default for now
      uvBounds.set([0, 0, 1, 1], i * 4);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
      uv: { size: 2, data: uvs },
      uvBounds: { size: 4, data: uvBounds }
    });

    // Use texture atlas or create default texture
    let finalTexture;
    if (showLogos && textureAtlas) {
      finalTexture = textureAtlas;
      console.log('Using texture atlas');
    } else {
      finalTexture = createTextTexture(gl, '●', '#ffffff', 64);
      console.log('Using default texture');
    }
    
    console.log('Final texture:', finalTexture);
    console.log('Particle count:', count);
    console.log('Show logos:', showLogos);
    console.log('Texture atlas exists:', !!textureAtlas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
        uTexture: { value: finalTexture }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = t => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

      return () => {
        window.removeEventListener('resize', resize);
        if (moveParticlesOnHover) {
          container.removeEventListener('mousemove', handleMouseMove);
        }
        cancelAnimationFrame(animationFrameId);
        if (container.contains(gl.canvas)) {
          container.removeChild(gl.canvas);
        }
      };
    };

    initParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    showLogos
  ]);

  return <div ref={containerRef} className={`particles-container ${className}`} />;
};

export default Particles;
