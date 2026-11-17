import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { cards, suitesIntro } from '../content'
import { Cloud, INOUT, Img, Piece, Roll, SiteLink, WASH_MASK, ez, lerp, pad, seg, useIsDesktop } from './ui'

/* Transición: nubes blancas cubren la sección anterior y aparece el titular centrado. */
function Transition() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.1'] })
  const t = useTransform(scrollYProgress, (v) => v * 1.56)
  const cloudA = {
    y: useTransform(t, (v) => `${lerp(20, -20, seg(v, 0, 0.5))}%`),
    opacity: useTransform(t, (v) => seg(v, 0, 0.5)),
  }
  const cloudB = {
    y: useTransform(t, (v) => `${lerp(10, -30, seg(v, 0, 0.3))}%`),
    opacity: useTransform(t, (v) => seg(v, 0, 0.3)),
  }
  const wash = useTransform(t, (v) => seg(v, 0.5, 0.3))
  const copyOpacity = useTransform(t, (v) => seg(v, 0.85, 0.55, ez.p3o))
  const copyY = useTransform(t, (v) => 36 * (1 - seg(v, 0.85, 0.55, ez.p3o)))

  return (
    <section ref={ref} className="relative z-30 -mt-[50vh] h-[80vh] w-full bg-white text-ink lg:h-[160vh]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-white"
        style={{ opacity: wash, WebkitMaskImage: WASH_MASK, maskImage: WASH_MASK }}
      />
      <div aria-hidden className="pointer-events-none absolute left-0 top-[-42vh] z-30 h-[112vh] w-full md:top-[-52vh]">
        <Cloud color="#ffffff" style={cloudA} className="top-[25%] lg:top-0" />
        <Cloud color="#ffffff" style={cloudB} className="top-[20%] lg:top-[8%]" />
      </div>
      <div className="sticky top-0 z-40 flex h-svh w-full items-center justify-center px-6">
        <motion.div className="flex flex-col items-center text-center" style={{ opacity: copyOpacity, y: copyY }}>
          <p className="label mb-4 tracking-[0.24em] lg:mb-5 lg:text-xs">{suitesIntro.eyebrow}</p>
          <h2 className="display text-[clamp(1.6rem,6.2vw,6rem)]">
            {suitesIntro.title[0]}
            <br />
            {suitesIntro.title[1]}
          </h2>
        </motion.div>
      </div>
    </section>
  )
}

// Posiciones (en %) de cada foto según su papel en el paso actual
const thumb = { borderRadius: 18 }
const PRESET = {
  desktop: {
    hero: { left: 0, top: 0, width: 100, height: 100, borderRadius: 0, opacity: 1 },
    main: { left: 27, top: 3.4, width: 45, height: 93.2, borderRadius: 28, opacity: 1 },
    prev: { left: 16.6, top: 3.4, width: 8.6, height: 18, ...thumb, opacity: 1 },
    next: { left: 74, top: 78.6, width: 8.6, height: 18, ...thumb, opacity: 1 },
    out: { left: 16.6, top: 3.4, width: 8.6, height: 18, ...thumb, opacity: 0 },
    wait: { left: 74, top: 78.6, width: 8.6, height: 18, ...thumb, opacity: 0 },
  },
  mobile: {
    hero: { left: 0, top: 0, width: 100, height: 100, borderRadius: 0, opacity: 1 },
    main: { left: 4, top: 3, width: 92, height: 50, borderRadius: 28, opacity: 1 },
    prev: { left: 4, top: 84, width: 22, height: 12, ...thumb, opacity: 1 },
    next: { left: 74, top: 84, width: 22, height: 12, ...thumb, opacity: 1 },
    out: { left: 4, top: 84, width: 22, height: 12, ...thumb, opacity: 0 },
    wait: { left: 74, top: 84, width: 22, height: 12, ...thumb, opacity: 0 },
  },
}
const roleOf = (i, step) => {
  if (step <= 0) return i === 0 ? 'hero' : 'wait'
  const d = i - (step - 1)
  return d <= -2 ? 'out' : d === -1 ? 'prev' : d === 0 ? 'main' : d === 1 ? 'next' : 'wait'
}
const toStyle = (p) => ({
  left: `${p.left}%`,
  top: `${p.top}%`,
  width: `${p.width}%`,
  height: `${p.height}%`,
  borderRadius: p.borderRadius,
  opacity: p.opacity,
})

/* La primera foto se abre a pantalla completa; después cada paso la convierte
   en tarjeta central, con la anterior y la siguiente como miniaturas. */
function Rooms() {
  const pin = useRef(null)
  const desktop = useIsDesktop()
  const items = cards.items
  const d = items.length
  const scrollLen = 130 + 110 * d + 40
  const [step, setStep] = useState(-1) // -1 oculto · 0 portada · 1..d habitaciones

  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  const vh = useTransform(scrollYProgress, (v) => v * scrollLen)

  useMotionValueEvent(vh, 'change', (v) => {
    const a = (v - 130) / 110
    setStep(a >= 0.6 ? Math.min(d, Math.floor(a - 0.6) + 1) : v >= 90 ? 0 : -1)
  })

  const clip = useTransform(vh, (v) => {
    const k = 1 - seg(v, 0, 100, ez.p2io)
    const [y, x] = desktop ? [24, 32] : [30, 8]
    return `inset(${y * k}% ${x * k}% ${y * k}% ${x * k}% round ${28 * k}px)`
  })
  const openScale = useTransform(vh, (v) => lerp(1.3, 1, seg(v, 0, 100, ez.p2io)))
  const bg = useTransform(vh, [60, 100], ['#ffffff', '#ede6d6'])

  const preset = desktop ? PRESET.desktop : PRESET.mobile
  const s = Math.max(0, step)
  const heroState = step < 0 ? -1 : step === 0 ? 0 : 1

  return (
    <section id="suites" ref={pin} className="relative z-30 w-full bg-bone text-ink" style={{ height: `${scrollLen + 100}vh` }}>
      <motion.div className="sticky top-0 h-svh w-full overflow-hidden" style={{ backgroundColor: bg }}>
        {items.map((it, i) => {
          const role = roleOf(i, s)
          const front = role === 'hero' || role === 'main'
          return (
            <motion.div
              key={it.src}
              className="absolute overflow-hidden"
              style={{ zIndex: front ? 3 : role === 'prev' ? 2 : 1, ...(i === 0 ? { clipPath: clip } : null) }}
              initial={false}
              animate={toStyle(preset[role])}
              transition={{ duration: 0.9, ease: INOUT, delay: s === 1 && role === 'next' ? 0.6 : 0 }}
            >
              <motion.div className="h-full w-full" style={i === 0 ? { scale: openScale } : undefined}>
                <motion.div
                  className="h-full w-full will-change-transform"
                  initial={false}
                  animate={{ scale: front ? 1 : 1.2 }}
                  transition={{ duration: 0.9, ease: INOUT }}
                >
                  <Img src={it.src} alt={it.kicker} eager={i === 0} className="h-full w-full" />
                </motion.div>
              </motion.div>
            </motion.div>
          )
        })}

        {/* Portada */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 p-6 text-white md:p-8 lg:gap-5 lg:p-12">
          <Piece state={heroState} as="p" className="label">
            {cards.eyebrow}
          </Piece>
          <h2 className="text-[clamp(2.4rem,10.5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.05em] lg:text-[6.4vw]">
            {cards.title.map((line, i) => (
              <Piece key={line} state={heroState} delay={0.09 * (i + 1)}>
                {line}
              </Piece>
            ))}
          </h2>
        </div>

        {/* Texto de cada habitación */}
        <div className="absolute bottom-[16%] left-[6%] right-[6%] top-[56%] lg:bottom-[24%] lg:left-[74%] lg:right-[3%] lg:top-[18%]">
          {items.map((it, i) => {
            const state = step < i + 1 ? -1 : step === i + 1 ? 0 : 1
            const base = i === 0 ? 0.55 : 0.35
            return (
              <div
                key={it.kicker}
                className={`absolute inset-0 flex flex-col justify-center gap-3 lg:gap-5 ${state === 0 ? '' : 'pointer-events-none'}`}
              >
                <Piece state={state} delay={base} as="p" className="label">
                  {it.kicker}
                </Piece>
                <h3 className="text-[clamp(1.75rem,6.5vw,2.75rem)] font-medium leading-[1.02] tracking-[-0.04em] lg:text-[2.5vw]">
                  <Piece state={state} delay={base + 0.06}>
                    {it.title}
                  </Piece>
                </h3>
                <Piece state={state} delay={base + 0.12} as="p" className="max-w-[24rem] text-xs leading-[1.5] tracking-[-0.01em] md:text-sm">
                  {it.text}
                </Piece>
                <Piece state={state} delay={base + 0.18} as="p" className="text-[10px] uppercase leading-[1.6] tracking-[0.16em] opacity-70">
                  {it.tags.join(' · ')}
                </Piece>
                <Piece state={state} delay={base + 0.24}>
                  <SiteLink href={cards.link.href} className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.12em]">
                    <Roll className="border-b border-current">{cards.link.label}</Roll>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </SiteLink>
                </Piece>
              </div>
            )
          })}
        </div>

        {/* Contador */}
        <motion.div
          className="absolute bottom-[3.4%] left-[2.6%] z-20 hidden items-center gap-4 text-[11px] uppercase tracking-[0.18em] lg:flex"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: step === 1 ? 0.6 : 0 }}
        >
          <span>{cards.caption}</span>
          <span className="flex items-center gap-1 tabular-nums">
            <span className="block h-[1.4em] overflow-hidden leading-[1.4em]">
              <motion.span
                className="flex flex-col"
                initial={false}
                animate={{ y: `${-(100 / d) * Math.max(0, step - 1)}%` }}
                transition={{ duration: 0.6, ease: INOUT }}
              >
                {items.map((_, i) => (
                  <span key={i} className="block h-[1.4em] leading-[1.4em]">
                    {pad(i + 1)}
                  </span>
                ))}
              </motion.span>
            </span>
            <span className="opacity-50">/ {pad(d)}</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default function Suites() {
  return (
    <>
      <Transition />
      <Rooms />
    </>
  )
}
