import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE, Img, Lines, Roll, SiteLink, clamp01, ez, seg } from './ui'

/* Portada de las páginas interiores: mismo esquema del hero del inicio.
   Foto o video a pantalla completa, fijo al fondo mientras la página sube. */
export default function PageHero({ ready, image, alt = '', video, eyebrow, title, ctas = [], meta = [], tagline }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const { scrollY } = useScroll()
  const p = useTransform(scrollY, (y) => clamp01(y / (window.innerHeight * 0.9)))
  const scale = useTransform(p, [0, 1], [1, 1.12])
  const contentY = useTransform(p, (v) => -80 * seg(v, 0, 0.3, ez.p2i))
  const contentOpacity = useTransform(p, (v) => 1 - seg(v, 0, 0.3, ez.p2i))
  const hasVideo = video && !failed

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }
  const fade = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 14 },
    transition: { duration: 1, ease: EASE, delay },
  })

  return (
    <section className="sticky top-0 z-0 h-svh w-full select-none overflow-hidden bg-black text-white">
      <motion.div className="pointer-events-none absolute inset-0" style={{ scale }}>
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.2 }}
          animate={{ scale: ready ? 1 : 1.2 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          <Img src={image} alt={alt} dark eager className="h-full w-full" />
          {hasVideo && (
            <video
              ref={ref}
              src={video}
              poster={image}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setFailed(true)}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35" />
      </motion.div>

      <motion.div className="absolute inset-0 z-10" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="absolute left-6 top-[14%] md:left-10 lg:top-[9%]">
          {eyebrow && (
            <motion.p className="mb-4 text-[11px] uppercase tracking-[0.18em]" {...fade(0.2)}>
              {eyebrow}
            </motion.p>
          )}
          <Lines
            as="h1"
            lines={title}
            show={ready}
            delay={0.1}
            className="text-[clamp(2.3rem,11vw,5rem)] font-medium leading-[0.96] tracking-[-0.05em] md:text-[5.4rem] lg:text-[7vw]"
          />
          {ctas.length > 0 && (
            <motion.div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:gap-5" {...fade(0.7)}>
              {ctas.map((c) => (
                <SiteLink
                  key={c.label}
                  href={c.href}
                  className="group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg"
                >
                  <Roll className="border-b border-white">{c.label}</Roll>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </SiteLink>
              ))}
            </motion.div>
          )}
        </div>

        {meta.length > 0 && (
          <div className="pointer-events-none absolute bottom-[14%] left-0 right-0 px-6 md:px-10 lg:bottom-[16%]">
            <motion.ul
              className="grid w-full grid-cols-2 gap-x-6 gap-y-1 border-t border-white/30 pt-4 md:flex md:items-end md:justify-between"
              {...fade(0.9)}
            >
              {meta.map((m) => (
                <li key={m} className="text-[11px] uppercase tracking-[0.18em] md:text-sm lg:text-base">
                  {m}
                </li>
              ))}
            </motion.ul>
          </div>
        )}

        {tagline && (
          <motion.div className="absolute bottom-6 w-full px-6 text-center md:bottom-7" {...fade(1.1)}>
            <p className="text-sm leading-[120%] md:text-base lg:text-lg">
              {tagline[0]}
              <br />
              {tagline[1]}
            </p>
          </motion.div>
        )}

        {hasVideo && (
          <motion.button
            type="button"
            onClick={toggle}
            aria-label={paused ? 'Reproducir video' : 'Pausar video'}
            className="absolute bottom-5 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white hover:text-ink md:right-10"
            {...fade(1.2)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <path d={paused ? 'M2 1l9 5-9 5z' : 'M2 1h3v10H2zM7 1h3v10H7z'} />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </section>
  )
}
