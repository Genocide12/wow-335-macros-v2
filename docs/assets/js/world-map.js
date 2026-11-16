(() => {
  const start = () => {
    const card = document.querySelector('.hero-main');
    const canvas = document.getElementById('worldMapShader');
    const picker = document.getElementById('pathPicker');
    const image = new Image();
    if (!card || !canvas || !picker) return;
    image.src = 'assets/icons/northrend-map.png';

    const zones = [...picker.querySelectorAll('.map-zone')];
    const zoneIndex = { arms: 0, fury: 1, prot: 2 };
    const state = { selected: 1, hovered: -1, ripple: [0.5, 0.5], rippleAt: -10, gl: null, raf: 0, lastFrame: 0 };
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let resizeObserver;

    const makeShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };

    const buildMask = () => {
      const mask = document.createElement('canvas');
      mask.width = 1536; mask.height = 1024;
      const ctx = mask.getContext('2d');
      zones.forEach((zone, index) => {
        ctx.fillStyle = ['#ff0000', '#00ff00', '#0000ff'][index];
        ctx.fill(new Path2D(zone.getAttribute('d')));
      });
      return mask;
    };

    const initGL = () => {
      const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
      if (!gl) return false;
      const vertex = `attribute vec2 aPosition; attribute vec2 aUV; varying vec2 vUV;
        void main(){gl_Position=vec4(aPosition,0.0,1.0);vUV=aUV;}`;
      const fragment = `precision mediump float;
        varying vec2 vUV;
        uniform sampler2D uMap; uniform sampler2D uMask;
        uniform vec2 uResolution; uniform vec2 uRipple;
        uniform float uTime; uniform float uRippleAge; uniform float uSelected; uniform float uHovered;
        float zoneAt(vec2 p,float i){vec3 m=texture2D(uMask,p).rgb;return i<0.5?m.r:(i<1.5?m.g:m.b);}
        void main(){
          vec2 uv=vUV;
          vec3 base=texture2D(uMap,uv).rgb;
          float selected=zoneAt(uv,uSelected);
          float hovered=uHovered<0.0?0.0:zoneAt(uv,uHovered);
          float focus=max(selected,hovered);
          float strength=max(selected*0.56,hovered*0.98);
          float lift=mix(0.003,0.008,focus);
          vec2 raisedUV=clamp(uv+vec2(0.0,lift),vec2(0.001),vec2(0.999));
          float raised=max(zoneAt(raisedUV,uSelected),uHovered<0.0?0.0:zoneAt(raisedUV,uHovered));
          float rim=focus*(1.0-min(1.0,raised));
          vec3 col=base*(1.0-rim*strength*0.22);
          vec3 raisedColor=texture2D(uMap,raisedUV).rgb;
          col=mix(col,raisedColor,min(1.0,raised*strength));
          float shimmer=0.5+0.5*sin(uv.x*26.0+uv.y*13.0-uTime*2.4);
          col+=vec3(0.13,0.085,0.018)*max(selected*0.36,hovered)*(0.10+shimmer*0.22);
          vec2 delta=(uv-uRipple)*vec2(uResolution.x/uResolution.y,1.0);
          float ring=exp(-pow((length(delta)-uRippleAge*0.55)*42.0,2.0))*exp(-uRippleAge*2.0);
          col+=vec3(0.25,0.17,0.035)*ring*(uRippleAge<1.8?1.0:0.0);
          gl_FragColor=vec4(col,1.0);
        }`;
      const program = gl.createProgram();
      gl.attachShader(program, makeShader(gl, gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, makeShader(gl, gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);

      const vertices = new Float32Array([
        -1, 1, 0, 1,  1, 1, 1, 1, -1,-1, 0, 0,
        -1,-1, 0, 0,  1, 1, 1, 1,  1,-1, 1, 0
      ]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const stride = 16;
      const pos = gl.getAttribLocation(program, 'aPosition');
      const uv = gl.getAttribLocation(program, 'aUV');
      gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(uv); gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, stride, 8);
      const texture = (unit, source, uniform) => {
        const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.uniform1i(gl.getUniformLocation(program, uniform), unit);
      };
      texture(0, image, 'uMap'); texture(1, buildMask(), 'uMask');
      state.gl = { gl, program };
      card.classList.add('map-live');
      canvas.style.opacity = '1';
      return true;
    };

    const render = now => {
      if (!state.gl) return;
      if (!reduceMotion && now - state.lastFrame < 32) { state.raf = requestAnimationFrame(render); return; }
      state.lastFrame = now;
      const { gl, program } = state.gl;
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), width, height);
      gl.uniform2f(gl.getUniformLocation(program, 'uRipple'), state.ripple[0], state.ripple[1]);
      gl.uniform1f(gl.getUniformLocation(program, 'uTime'), reduceMotion ? 0 : now / 1000);
      gl.uniform1f(gl.getUniformLocation(program, 'uRippleAge'), (now - state.rippleAt) / 1000);
      gl.uniform1f(gl.getUniformLocation(program, 'uSelected'), state.selected);
      gl.uniform1f(gl.getUniformLocation(program, 'uHovered'), state.hovered);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduceMotion && document.visibilityState === 'visible') state.raf = requestAnimationFrame(render);
    };

    const updateSelection = spec => {
      if (zoneIndex[spec] == null) return;
      state.selected = zoneIndex[spec];
      zones.forEach(zone => {
        const selected = zone.dataset.spec === spec;
        zone.classList.toggle('selected', selected);
        zone.setAttribute('aria-pressed', String(selected));
      });
      if (state.gl && reduceMotion) state.raf = requestAnimationFrame(render);
    };
    const ripple = event => {
      const rect = canvas.getBoundingClientRect();
      state.ripple = [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height))];
      state.rippleAt = performance.now();
      if (reduceMotion) state.raf = requestAnimationFrame(render);
    };
    const zoneFrom = target => target instanceof Element ? target.closest('.map-zone,.map-label') : null;
    card.addEventListener('pointerover', event => { const zone = zoneFrom(event.target); if (zone) { state.hovered = zoneIndex[zone.dataset.spec] ?? -1; if (reduceMotion) state.raf = requestAnimationFrame(render); } });
    card.addEventListener('pointerout', event => { const zone = zoneFrom(event.target); if (zone && !zone.contains(event.relatedTarget)) { state.hovered = -1; if (reduceMotion) state.raf = requestAnimationFrame(render); } });
    card.addEventListener('pointerdown', event => { if (zoneFrom(event.target)) ripple(event); });
    zones.forEach(zone => { zone.setAttribute('aria-pressed', 'false'); zone.setAttribute('aria-label', zone.getAttribute('aria-label') || zone.dataset.spec); });
    image.onload = () => {
      try {
        if (!initGL()) return;
        updateSelection(new URLSearchParams(location.search).get('spec') || localStorage.getItem('warriorSpec') || 'fury');
        resizeObserver = new ResizeObserver(() => { if (!state.gl) return; cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(render); });
        resizeObserver.observe(card);
        document.addEventListener('visibilitychange', () => {
          cancelAnimationFrame(state.raf);
          if (document.visibilityState === 'visible') state.raf = requestAnimationFrame(render);
        });
        state.raf = requestAnimationFrame(render);
      } catch (error) {
        console.warn('Map shader fallback enabled:', error);
        card.classList.remove('map-live');
        canvas.style.opacity = '0';
      }
    };
    image.onerror = () => { canvas.style.opacity = '0'; };
    window.WorldMap = { setSpec: updateSelection };
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
