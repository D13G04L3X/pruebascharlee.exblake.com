import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { brand, cards, gallery, hero, rooftop, spaces } from '../content'
import { EASE, INOUT, pad, useIsDesktop } from './ui'

// Fotos que pasan por la ventana mientras carga; la última es la del hero,
// así la ventana se abre directamente sobre la portada.
const FRAMES = [gallery.items[0].src, spaces.items[2].src, cards.items[0].src, rooftop.image, hero.image]

/* Carga: la marca cruza una ventana por la que pasan fotos del hotel.
   Al llegar a 100 la ventana se abre a pantalla completa y deja ver la página. */
export default function Preloader({ onDone }) {
  const desktop = useIsDesktop()
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState('load') // load → open → gone

  useEffect(() => {
    FRAMES.forEach((src) => {
      new Image().src = src
    })
    let timer
    const controls = animate(0, 100, {
      duration: 2.6,
      ease: INOUT,
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => (timer = setTimeout(() => setPhase('open'), 250)),
    })
    return () => {
      controls.stop()
      clearTimeout(timer)
    }
  }, [])

  const frame = Math.min(FRAMES.length - 1, Math.floor((n / 100) * FRAMES.length))
  const [insetY, insetX] = desktop ? [29, 36] : [33, 16]
  const closed = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round 14px)`
  const opening = phase !== 'load'

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-ink text-bone"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Ventana */}
          <motion.div
            className="absolute inset-0 will-change-[clip-path]"
            initial={{ clipPath: `inset(50% ${insetX}% 50% ${insetX}% round 14px)` }}
            animate={{ clipPath: opening ? 'inset(0% 0% 0% 0% round 0px)' : closed }}
            transition={{ duration: opening ? 1.2 : 1, ease: opening ? INOUT : EASE }}
            onAnimationComplete={() => {
              if (!opening) return
              onDone?.()
              setPhase('gone')
            }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.35 }}
              animate={{ scale: opening ? 1 : 1.35 }}
              transition={{ duration: 1.2, ease: INOUT }}
            >
              {FRAMES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: i <= frame ? 1 : 0 }}
                  onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                />
              ))}
            </motion.div>
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          {/* Marca cruzando la ventana */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-difference">
            <h1
              aria-label={brand}
              className="flex overflow-hidden whitespace-pre pb-[0.1em] text-[clamp(2.1rem,10.5vw,10rem)] font-semibold leading-none tracking-[-0.06em] text-white"
            >
              {[...brand].map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: opening ? '-115%' : '0%' }}
                  transition={
                    opening
                      ? { duration: 0.6, ease: [0.55, 0, 1, 0.45], delay: i * 0.015 }
                      : { duration: 1, ease: EASE, delay: 0.15 + i * 0.04 }
                  }
                >
                  {ch}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Pie: lema, contador y barra */}
          <motion.div
            className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-8"
            animate={{ opacity: opening ? 0 : 1, y: opening ? 20 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-end justify-between">
              <span className="text-[11px] uppercase tracking-[0.18em] text-bone/70">{hero.headline.join(' ')}</span>
              <span className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.85] tracking-[-0.05em] tabular-nums">
                {pad(n)}
              </span>
            </div>
            <div
              className="mt-5 h-px w-full bg-bone/15"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={n}
            >
              <div className="h-full origin-left bg-bone will-change-transform" style={{ transform: `scaleX(${n / 100})` }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
