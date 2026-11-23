import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { rooftop } from '../content'
import { EASE, Img, Piece, Roll, ez, lerp, seg, useIsDesktop } from './ui'

/* Una tarjeta redondeada que crece hasta llenar la pantalla; después entra el texto. */
export default function Rooftop() {
  const pin = useRef(null)
  const desktop = useIsDesktop()
  const [entered, setEntered] = useState(false)
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setEntered(v > 0.48))

  const from = desktop ? { left: 19, top: 14, width: 62, height: 72 } : { left: 4, top: 12, width: 92, height: 70 }
  const k = useTransform(scrollYProgress, (v) => seg(v, 0, 0.5, ez.p2io))
  const box = {
    left: useTransform(k, (t) => `${lerp(from.left, 0, t)}%`),
    top: useTransform(k, (t) => `${lerp(from.top, 0, t)}%`),
    width: useTransform(k, (t) => `${lerp(from.width, 100, t)}%`),
    height: useTransform(k, (t) => `${lerp(from.height, 100, t)}%`),
    borderRadius: useTransform(k, (t) => lerp(28, 0, t)),
  }
  const scale = useTransform(k, [0, 1], [1.2, 1])
  const state = entered ? 0 : -1

  return (
    <section id="rooftop" ref={pin} className="relative z-30 h-[300vh] w-full bg-bone text-white">
      <div className="sticky top-(--nav-h) h-[calc(100svh-var(--nav-h))] w-full overflow-hidden bg-bone">
        <motion.div className="absolute overflow-hidden" style={box}>
          <motion.div className="h-full w-full will-change-transform" style={{ scale }}>
            <Img src={rooftop.image} alt={rooftop.alt} dark className="h-full w-full" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />

          <div className="absolute inset-0 top-8 flex flex-col justify-between p-6 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <Piece state={state} as="p" className="text-xs uppercase tracking-[0.2em]">
                {rooftop.eyebrow}
              </Piece>
              <div className="hidden lg:block">
                <Piece state={state} delay={0.08} as="ul" className="!flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em]">
                  {rooftop.chips.map((c) => (
                    <li key={c} className="inline-flex h-7 items-center rounded-md border border-white/70 px-2.5">
                      {c}
                    </li>
                  ))}
                </Piece>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <h2 className="text-[clamp(2.4rem,10.5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.05em] lg:text-[6.2vw]">
                <Piece state={state} delay={0.16}>
                  {rooftop.title}
                </Piece>
              </h2>
              <div className="flex max-w-md flex-col items-start gap-5">
                <Piece state={state} delay={0.24} as="p" className="text-xs leading-[1.5] tracking-[-0.01em] md:text-sm">
                  {rooftop.text}
                </Piece>
                <motion.a
                  href={rooftop.button.href}
                  className="group inline-block rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  initial={false}
                  animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 16 }}
                  transition={{ duration: 0.7, ease: EASE, delay: entered ? 0.45 : 0 }}
                >
                  <Roll>{rooftop.button.label} →</Roll>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
