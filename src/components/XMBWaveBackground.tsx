import { useEffect, useRef } from 'react'

// ─── Configurable types ───────────────────────────────────────────────────────
export interface XMBWaveConfig {
  /** Wave color as a CSS hex string.  Default: "#4d4d4d" */
  waveColor?: string
  /** Global speed multiplier. 1 = original speed.  Default: 1.0 */
  speedMultiplier?: number
  /** CSS background color shown behind the WebGL canvas. Default: "#000000" */
  backgroundColor?: string
  /** Invert colors for a light/white background.  Default: false */
  lightMode?: boolean
  /** Intensity of the radial glow (0 = none, 1 = full). Default: 0.35 */
  radialIntensity?: number
  /** Reach of the radial glow as a % of the screen (0–1). Default: 0.6 */
  radialRadius?: number
  /**
   * Max brightness where waves overlap (0–1).
   * 1.0 = original additive (can saturate to white).
   * 0.4–0.6 = soft/dim peaks. Default: 0.6
   */
  brightnessCap?: number
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function hexToRGB(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ]
}

// ─── Shaders ──────────────────────────────────────────────────────────────────
const VERT_SRC = `
attribute vec2 aVertexPosition;
void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform bool  uLightMode;
uniform vec3  uWaveColor;
uniform float uSpeedMultiplier;
uniform float uBrightnessCap;

const float WAVE_WIDTH_FACTOR = 1.5;

vec3 calcSine(
  vec2  uv,
  float speed,
  float frequency,
  float amplitude,
  float phaseShift,
  float verticalOffset,
  vec3  baseColor,
  float lineWidth,
  float sharpness,
  bool  invertFalloff
) {
  float angle       = uTime * uSpeedMultiplier * speed * frequency * -1.0
                      + (phaseShift + uv.x) * 2.0;
  float waveY       = sin(angle) * amplitude + verticalOffset;
  float deltaY      = waveY - uv.y;
  float distanceVal = distance(waveY, uv.y);

  if (invertFalloff) {
    if (deltaY > 0.0) { distanceVal *= 4.0; }
  } else {
    if (deltaY < 0.0) { distanceVal *= 4.0; }
  }

  float smoothVal = smoothstep(lineWidth * WAVE_WIDTH_FACTOR, 0.0, distanceVal);
  float scaleVal  = pow(smoothVal, sharpness);
  return min(baseColor * scaleVal, baseColor);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 acc = vec3(0.0);
  // Upper waves (invertFalloff = false)
  acc += calcSine(uv, 0.2, 0.20, 0.20, 0.0, 0.5, uWaveColor, 0.10, 15.0, false);
  acc += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.5, uWaveColor, 0.10, 17.0, false);
  acc += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.5, uWaveColor, 0.05, 23.0, false);
  // Lower waves (invertFalloff = true)
  acc += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.3, uWaveColor, 0.10, 17.0, true);
  acc += calcSine(uv, 0.3, 0.36, 0.07, 0.0, 0.3, uWaveColor, 0.10, 17.0, true);
  acc += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.3, uWaveColor, 0.05, 23.0, true);
  acc += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.3, uWaveColor, 0.20, 15.0, true);

  float maxChannel = max(acc.r, max(acc.g, acc.b));
  if (maxChannel <= 0.0) discard;

  // Compress accumulated brightness so overlapping waves don't saturate.
  // uBrightnessCap: 1.0 = full additive, lower = softer peaks.
  vec3 color = acc / (acc + vec3(1.0 - uBrightnessCap + 0.001));
  color = uLightMode ? vec3(1.0) - color : color;

  float alpha = max(color.r, max(color.g, color.b));
  gl_FragColor = vec4(color, alpha);
}
`

// ─── Component ────────────────────────────────────────────────────────────────
export default function XMBWaveBackground({
  waveColor       = '#4d4d4d',
  speedMultiplier = 1.0,
  backgroundColor = '#000000',
  lightMode       = false,
  radialIntensity = 0.2,
  radialRadius    = 0.8,
  brightnessCap   = 0.6,
}: XMBWaveConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) {
      console.error('WebGL not supported in this browser.')
      return
    }

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    // ── Compile shader ──────────────────────────────────────────────────────
    const compile = (src: string, type: number) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(VERT_SRC, gl.VERTEX_SHADER)
    const fs = compile(FRAG_SRC, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    // ── Uniform locations ───────────────────────────────────────────────────
    const posLoc   = gl.getAttribLocation(program,  'aVertexPosition')
    const timeLoc  = gl.getUniformLocation(program, 'uTime')
    const resLoc   = gl.getUniformLocation(program, 'uResolution')
    const modeLoc  = gl.getUniformLocation(program, 'uLightMode')
    const colorLoc   = gl.getUniformLocation(program, 'uWaveColor')
    const speedLoc   = gl.getUniformLocation(program, 'uSpeedMultiplier')
    const capLoc     = gl.getUniformLocation(program, 'uBrightnessCap')

    // ── Full-screen quad ────────────────────────────────────────────────────
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // ── Alpha blending (for transparent wave edges) ─────────────────────────
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // ── Static uniforms ─────────────────────────────────────────────────────
    const [r, g, b] = hexToRGB(waveColor)
    gl.uniform3f(colorLoc, r, g, b)
    gl.uniform1f(speedLoc, speedMultiplier)
    gl.uniform1f(capLoc, brightnessCap)
    gl.uniform1i(modeLoc, lightMode ? 1 : 0)
    gl.clearColor(0, 0, 0, 0)

    // ── Render loop ─────────────────────────────────────────────────────────
    const render = (ms: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(timeLoc, ms * 0.001)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [waveColor, speedMultiplier, lightMode, brightnessCap])

  // Build CSS radial-gradient colour from waveColor
  const [gr, gg, gb] = hexToRGB(waveColor)
  const glowColor = `rgba(${Math.round(gr * 255)}, ${Math.round(gg * 255)}, ${Math.round(gb * 255)}, ${radialIntensity})`
  const glowSize  = `${Math.round(radialRadius * 100)}%`

  return (
    <>
      {/* Base background */}
      <div style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: backgroundColor,
        zIndex:          -3,
      }} />

      {/* Ambient radial glow — top-right, independent of waves */}
      <div style={{
        position:   'fixed',
        inset:      0,
        background: `radial-gradient(circle at 90% 10%, ${glowColor} 0%, transparent ${glowSize})`,
        zIndex:     -2,
        pointerEvents: 'none',
      }} />

      {/* WebGL wave canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top:      0,
          left:     0,
          width:    '100%',
          height:   '100%',
          zIndex:   -1,
          display:  'block',
        }}
      />
    </>
  )
}
