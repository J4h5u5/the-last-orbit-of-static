/* ============================================================
   starfield: multi-layer parallax canvas
   ============================================================ */

function Starfield({ density = 180 }) {
  const c1 = useRef(null);
  const c2 = useRef(null);
  const c3 = useRef(null);
  const nebRef = useRef(null);
  const scrollY = useScrollY();
  const mouse = useMousePos();

  // generate star arrays
  const stars = useMemo(() => {
    const make = (n, sizeRange, speedMul, hueMix) => {
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push({
          x: Math.random(),
          y: Math.random() * 3, // 3 viewport heights worth
          r: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
          s: speedMul,
          tw: Math.random() * Math.PI * 2,
          hue: hueMix,
          twSpeed: 0.002 + Math.random() * 0.008,
        });
      }
      return arr;
    };
    const factor = density / 180;
    return {
      back: make(Math.floor(180 * factor), [0.3, 0.8], 0.2, "back"),
      mid:  make(Math.floor(100 * factor), [0.5, 1.4], 0.5, "mid"),
      near: make(Math.floor(40 * factor),  [1.0, 2.4], 1.0, "near"),
    };
  }, [density]);

  useEffect(() => {
    let raf;
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const sy = window.scrollY || 0;
      const layers = [
        { canvas: c1.current, set: stars.back, mul: 0.15, op: 0.5 },
        { canvas: c2.current, set: stars.mid,  mul: 0.35, op: 0.8 },
        { canvas: c3.current, set: stars.near, mul: 0.75, op: 1.0 },
      ];
      const t = performance.now() * 0.001;
      layers.forEach(({ canvas, set, mul, op }) => {
        if (!canvas) return;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (canvas.width !== w * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
        }
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        for (const s of set) {
          const px = s.x * w;
          let py = (s.y * h * 3 - sy * mul) % (h * 3);
          if (py < 0) py += h * 3;
          if (py > h + 10 || py < -10) continue;
          const tw = 0.5 + 0.5 * Math.sin(s.tw + t * s.twSpeed * 60);
          let color;
          if (s.hue === "near") color = `rgba(232, 233, 243, ${op * tw})`;
          else if (s.hue === "mid") color = `rgba(183, 187, 209, ${op * tw * 0.8})`;
          else color = `rgba(122, 127, 153, ${op * tw * 0.55})`;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fill();
          // occasional warm crop
          if (s.hue === "near" && s.x > 0.97 && s.y > 2.4) {
            ctx.fillStyle = `rgba(255, 107, 53, ${op * tw})`;
            ctx.fill();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const resize = () => {};
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [stars]);

  // nebula mouse-reactive transform
  const nebX = (mouse.x - 0.5) * 40;
  const nebY = (mouse.y - 0.5) * 40 + scrollY * 0.1;

  return (
    <div className="starfield">
      <div
        className="nebula"
        ref={nebRef}
        style={{ transform: `translate3d(${nebX}px, ${-nebY}px, 0)` }}
      />
      <canvas ref={c1} />
      <canvas ref={c2} />
      <canvas ref={c3} />
      <div className="grain" />
    </div>
  );
}

window.Starfield = Starfield;
