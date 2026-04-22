/* ============================================================
   hooks & utilities
   ============================================================ */

const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;
// expose to window so components in other scripts can use them
Object.assign(window, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback });

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setY(window.scrollY || 0);
        raf = 0;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return y;
}

function useMousePos() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const on = (e) => {
      setPos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, []);
  return pos;
}

function useInView(opts = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

function useTick(ms = 1000) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}

/* live clock */
function useUTC() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* reveal on scroll utility: stamps .in when element enters viewport */
function Reveal({ children, delay = 0, as = "div", className = "", ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.08 });
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* parallax: translateY based on element's distance from viewport center */
function useParallax(strength = 0.1) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      setOffset(mid * strength);
    };
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = 0; });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [strength]);
  return [ref, offset];
}

Object.assign(window, { useScrollY, useMousePos, useInView, useTick, useUTC, Reveal, useParallax, useIsMobile });

function useIsMobile(bp = 720) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.innerWidth <= bp);
  useEffect(() => {
    const on = () => setM(window.innerWidth <= bp);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}
