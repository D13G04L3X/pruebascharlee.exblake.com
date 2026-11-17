import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { about, gallery } from '../content'
import { Chevron, Cloud, EASE, Img, WASH_MASK, clamp01, ez, lerp, seg, useIsDesktop } from './ui'

// Posición y giro de las seis fotos del collage (solo escritorio)
const TILES = [
  { box: 'left-[-1%] top-[14%] h-[43%] w-[26%]', rot: -4, side: -1 },
  { box: 'left-[2%] top-[61%] h-[22%] w-[20%]', rot: 3, side: -1 },
  { box: 'left-[25%] top-[70%] h-[26%] w-[22%]', rot: -2, side: -1 },
  { box: 'left-[51%] top-[1%] h-[21%] w-[16%]', rot: -6, side: 1 },
  { box: 'left-[73%] top-[15%] h-[29%] w-[27%]', rot: 8, side: 1 },
  { box: 'left-[74%] top-[54%] h-[39%] w-[25%]', rot: -4, side: 1 },
]

/* Entra con un pequeño salto al llegar la sección y, ya fijada, sale hacia su lado. */
function Tile({ pre, tl, i, side = 0, rot = 0, className, children }) {
  const enter = (v) => seg(v, 0.85 + i * 0.07, 0.55, ez.expoOut)
  const exit = (v) => (side ? seg(v, ((i - 1) % 3) * 0.03, 0.2, ez.p2i) : 0)
  const opacity = useTransform(pre, enter)
  const y = useTransform(pre, (v) => 56 * (1 - enter(v)))
  const x = useTransform(tl, (v) => `${side * 48 * exit(v)}vw`)
  const scale = useTransform([pre, tl], ([a, b]) => lerp(0.86, 1, enter(a)) * lerp(1, 0.9, exit(b)))
  return (
    <motion.div style={{ opacity, x, y, scale, rotate: rot }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  )
}

function Word({ tl, start, children }) {
  const y = useTransform(tl, (v) => `${110 * (1 - seg(v, start, 0.5, ez.p3o))}%`)
  return (
    <span className="-mb-[0.1em] mr-[0.25em] inline-block overflow-hidden pb-[0.2em] pt-[0.1em] align-bottom">
      <motion.span style={{ y }} className="inline-block will-change-transform">
        {children}
      </motion.span>
    </span>
  )
}

/* Carrusel: la foto nueva entra desde un lado mientras la anterior se desplaza un poco. */
function Slideshow({ arrows }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2 })
  const [[cur, dir], setCur] = useState([0, 1])
  const n = about.slides.length
  const go = (d) => setCur(([c]) => [(c + d + n) % n, d])

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => go(1), 2000)
    return () => clearInterval(id)
  }, [inView, cur])

  const slide = about.slides[cur]
  return (
    <div ref={ref} className="absolute inset-0">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={cur}
          custom={dir}
          variants={{
            enter: (d) => ({ x: `${100 * d}%`, zIndex: 2 }),
            center: { x: '0%', zIndex: 2 },
            exit: (d) => ({ x: `${-30 * d}%`, zIndex: 1 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1, ease: EASE }}
          className="absolute inset-0"
        >
          <Img src={slide.src} alt={slide.alt} eager className="h-full w-full" />
        </motion.div>
      </AnimatePresence>
      <motion.div style={{ opacity: arrows }} className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            aria-label={d < 0 ? 'Imagen anterior' : 'Imagen siguiente'}
            onClick={() => go(d)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-bone text-ink transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <Chevron dir={d} />
          </button>
        ))}
      </motion.div>
    </div>
  )
}

export default function About() {
  const desktop = useIsDesktop()
  const section = useRef(null)
  const pin = useRef(null)
  const stage = useRef(null)
  const slotCenter = useRef(null)
  const slotInline = useRef(null)
  const slots = useRef(null)
  const tick = useMotionValue(0)

  // Tiempos (en "segundos" de línea de tiempo) según el ancho de pantalla
  const T = desktop
    ? { total: 3.2, text: 1.7, words: 1.9, stagger: 0.03, rule: 2.4, ruleDur: 0.5, copy: 2.8, gallery: 0.25, arrows: 1.5 }
    : { total: 1.95, text: 0.5, words: 0.7, stagger: 0.025, rule: 1.3, ruleDur: 0.4, copy: 1.55, gallery: 0.3, arrows: 0 }

  // Llegada: desde el inicio de la página hasta que la sección toca arriba
  const { scrollY } = useScroll()
  const pre = useTransform(scrollY, (y) => {
    const top = section.current?.offsetTop ?? window.innerHeight
    return 1.56 * clamp01(y / Math.max(1, top - window.innerHeight * 0.1))
  })
  // Sección fijada
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  const tl = useTransform(scrollYProgress, (v) => v * T.total)

  // Medir los dos huecos (centro del collage y hueco dentro del texto)
  useEffect(() => {
    const measure = () => {
      if (!stage.current) return
      const s = stage.current.getBoundingClientRect()
      const rel = (el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }
      }
      slots.current = { c: rel(slotCenter.current), i: rel(slotInline.current), W: s.width, H: s.height }
      tick.set(tick.get() + 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [desktop, tick])

  // La caja: hueco central → casi pantalla completa → hueco dentro del texto
  const rect = useTransform([tl, tick], ([t]) => {
    const s = slots.current
    if (!s) return { x: 0, y: 0, w: 0, h: 0, r: 12 }
    const mix = (a, b, k) => ({
      x: lerp(a.x, b.x, k),
      y: lerp(a.y, b.y, k),
      w: lerp(a.w, b.w, k),
      h: lerp(a.h, b.h, k),
      r: lerp(a.r, b.r, k),
    })
    const center = { ...s.c, r: 12 }
    if (!desktop) return mix(center, { ...s.i, r: 4 }, seg(t, 0, 1.1, ez.p3io))
    const full = { x: 0.03 * s.W, y: 0.03 * s.H, w: 0.94 * s.W, h: 0.94 * s.H, r: 24 }
    const shrink = seg(t, 1.5, 1.2, ez.p3io)
    return shrink > 0 ? mix(full, { ...s.i, r: 8 }, shrink) : mix(center, full, seg(t, 0, 1, ez.p2io))
  })
  const boxStyle = {
    left: useTransform(rect, (r) => r.x),
    top: useTransform(rect, (r) => r.y),
    width: useTransform(rect, (r) => r.w),
    height: useTransform(rect, (r) => r.h),
    borderRadius: useTransform(rect, (r) => r.r),
    opacity: useTransform(pre, (v) => seg(v, 0.85, 0.3)),
  }

  const cloudA = {
    y: useTransform(pre, (v) => `${lerp(20, -20, seg(v, 0, 0.5))}%`),
    opacity: useTransform(pre, (v) => seg(v, 0, 0.5)),
  }
  const cloudB = {
    y: useTransform(pre, (v) => `${lerp(10, -30, seg(v, 0, 0.3))}%`),
    opacity: useTransform(pre, (v) => seg(v, 0, 0.3)),
  }
  const wash = useTransform(pre, (v) => seg(v, 0.5, 0.3))
  const galleryOpacity = useTransform(tl, (v) => 1 - seg(v, 0, T.gallery))
  const arrows = useTransform(tl, (v) => 1 - seg(v, T.arrows, 0.2))
  const textOpacity = useTransform(tl, (v) => seg(v, T.text, 0.3))
  const ruleScale = useTransform(tl, (v) => seg(v, T.rule, T.ruleDur))
  const copyOpacity = useTransform(tl, (v) => seg(v, T.copy, 0.4, ez.p3o))
  const copyY = useTransform(tl, (v) => 20 * (1 - seg(v, T.copy, 0.4, ez.p3o)))

  const words = about.statement.split(' ')

  return (
    <section id="sobre" ref={section} className="relative z-20 bg-bone text-ink">
      {/* Nubes y velo que funden el beige sobre el hero */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-[-42vh] z-30 h-[112vh] w-full md:top-[-52vh]">
        <Cloud color="var(--color-bone)" style={cloudA} className="top-[25%] lg:top-0" />
        <Cloud color="var(--color-bone)" style={cloudB} className="top-[20%] lg:top-[8%]" />
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-bone"
        style={{ opacity: wash, WebkitMaskImage: WASH_MASK, maskImage: WASH_MASK }}
      />

      <div ref={pin} className="relative z-40" style={{ height: desktop ? '420vh' : '260vh' }}>
        <div ref={stage} className="sticky top-0 h-svh w-full overflow-hidden">
          <div
            ref={slotCenter}
            aria-hidden
            className="pointer-events-none invisible absolute left-[6%] top-[24%] h-[40%] w-[88%] md:left-[10%] md:top-[26%] md:h-[38%] md:w-[80%] lg:left-[26%] lg:top-[24%] lg:h-[38%] lg:w-[46%]"
          />

          {/* Collage */}
          <motion.div className="absolute inset-0" style={{ opacity: galleryOpacity }}>
            <Tile
              pre={pre}
              tl={tl}
              i={0}
              className="inset-x-0 top-[12%] px-6 text-center lg:inset-x-auto lg:left-[26%] lg:top-[3%] lg:w-[23%] lg:px-0 lg:text-left"
            >
              <p className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.04em] lg:text-[2.5vw] lg:leading-[1.08]">{gallery.title}</p>
            </Tile>
            {gallery.items.map((it, i) => (
              <Tile
                key={it.src}
                pre={pre}
                tl={tl}
                i={i + 1}
                side={TILES[i].side}
                rot={TILES[i].rot}
                className={`hidden overflow-hidden rounded-xl lg:block ${TILES[i].box}`}
              >
                <Img src={it.src} alt={it.alt} className="h-full w-full" />
              </Tile>
            ))}
          </motion.div>

          {/* Texto: aparece cuando la caja se encoge dentro de la frase */}
          <motion.div className="absolute inset-0 flex items-center px-6 lg:px-10" style={{ opacity: textOpacity }}>
            <div className="grid w-full grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12 lg:col-span-2">
                <div className="label tracking-[0.18em]">{about.title}</div>
              </div>
              <div className="col-span-12 lg:col-span-10">
                <p className="text-[clamp(1.75rem,7vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.05em] lg:text-[4.6vw] lg:leading-[1]">
                  <span
                    ref={slotInline}
                    aria-hidden
                    className="mb-[0.14em] mr-[0.18em] inline-block h-[0.82em] w-[1.7em] align-bottom"
                  />
                  {words.map((w, i) => (
                    <Word key={i} tl={tl} start={T.words + i * T.stagger}>
                      {w}
                    </Word>
                  ))}
                </p>
                <motion.div className="mt-4 h-px w-full origin-left bg-ink lg:mt-6" style={{ scaleX: ruleScale }} />
                <motion.p
                  className="mt-4 max-w-[350px] text-sm leading-[1.35] tracking-[-0.01em] lg:mt-6 lg:text-lg"
                  style={{ opacity: copyOpacity, y: copyY }}
                >
                  {about.body}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div className="absolute z-50 overflow-hidden" style={boxStyle}>
            <Slideshow arrows={arrows} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
