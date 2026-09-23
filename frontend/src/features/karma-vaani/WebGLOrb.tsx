import { useEffect, useRef } from 'react';

interface WebGLOrbProps {
  onClick: () => void;
  isListening: boolean;
}

export default function WebGLOrb({ onClick, isListening }: WebGLOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;
    
    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.wwww) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float d = length(uv);
    
    // Smooth rotation for the gradient
    float angle = u_time * 0.5;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedUv = rot * uv;
    
    // Intelligent thinking flow noise
    float noise = snoise(uv * 2.5 + u_time * 0.4);
    float swirl = snoise(rotatedUv * 1.5 - u_time * 0.2);
    
    // Brand Colors: Institutional Navy and Gold
    vec3 deepNavy = vec3(0.03, 0.09, 0.2);
    vec3 accentBlue = vec3(0.2, 0.5, 0.9);
    vec3 gold = vec3(1.0, 0.75, 0.3);
    
    // Wave patterns
    float waves = sin(d * 12.0 - u_time * 3.0 + noise * 1.5) * 0.5 + 0.5;
    
    // Color composition
    vec3 color = mix(deepNavy, accentBlue, waves * 0.5);
    color = mix(color, gold, swirl * 0.3 * (0.8 - d));
    
    // Pulse and inner glow
    float pulse = 0.8 + 0.2 * sin(u_time * 2.0);
    color += (0.1 / d) * accentBlue * pulse;
    
    // Circular Mask with anti-aliasing
    float mask = smoothstep(0.8, 0.78, d);
    
    gl_FragColor = vec4(color, mask);
}`;

    function cs(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }
    
    const prog = gl.createProgram();
    if (!prog) return;
    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      gl.deleteProgram(prog);
      resizeObserver?.disconnect();
      return;
    }
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      resizeObserver?.disconnect();
      return;
    }
    gl.useProgram(prog);
    
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    if (pos < 0) {
      gl.deleteProgram(prog);
      resizeObserver?.disconnect();
      return;
    }
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    function render(t: number) {
      if (!gl || !canvas) return;
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex justify-center relative py-4 z-0">
      {/* Outer rings from the HTML provided */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* User requested 'just one customisation make the sqaure shape to round circle'. 
            We make sure everything related is circular to be safe and match the prompt visually if the outer dashed was square in original.
            The HTML snippet actually had circular rings, but the screenshot showed a dashed square. 
            I'll use a dashed circle here to keep everything round as requested. */}
        <div className="w-64 h-64 rounded-full border-2 border-dashed border-[#fea619]/40 absolute"></div>
        <div className="w-72 h-72 rounded-full border border-[#acc7fe]/50 absolute animate-pulse"></div>
      </div>

      {/* Main Shader Container - Modified to rounded-full (circle) as requested */}
      <div
        className={`relative w-48 h-48 rounded-full shadow-[0_0_50px_rgba(13,46,92,0.4)] bg-[#002481] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-500 border-4 border-[#f7f9fb] animate-breathe group overflow-hidden ${isListening ? 'ring-4 ring-red-300/70' : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onClick();
        }}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        
        {/* Canvas is circular now due to parent overflow-hidden + rounded-full */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* AI Eyes - explicitly requested NOT to remove */}
        <div className="relative z-10 flex gap-4 animate-eyes group-hover:scale-110 transition-transform">
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#acc7fe]"></div>
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#acc7fe]"></div>
        </div>
      </div>
    </div>
  );
}
