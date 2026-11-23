import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Chevron, EASE, Img, Roll, SiteLink, clamp01, seg } from './ui'

/* Portada "cabecera": video a pantalla completa (fijo al fondo, como las demás portadas) y el
   nombre enorme abajo, ajustado para llenar exactamente el ancho de la pantalla.
   Arriba: etiqueta y frase a la izquierda, botones a la derecha. Sobre el nombre: una línea
   con los datos y el botón de pausa. Al bajar, el nombre baja y todo se desvanece. */
export default function MastheadHero({ ready, image, video, alt = '', eyebrow, title, ctas = [], meta = [], tagline }) {
  const player = useRef(null)
  const box = useRef(null)
  const word = useRef(null)
  const [size, setSize] = useState(null)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const name = title.join(' ')

  // Tamaño de letra para que el nombre ocupe todo el ancho disponible
  useLayoutEffect(() => {
    const fit = () => {
      if (!box.current || !word.current) return
      // Escala a partir del tamaño actual (sin tocar el DOM): ancho medido → ancho disponible
      const current = parseFloat(getComputedStyle(word.current).fontSize)
      const w = word.current.offsetWidth
      if (w && current) setSize((s) => {
        const next = (current * box.current.clientWidth) / w
        return s && Math.abs(next - s) < 0.5 ? s : next
      })
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [name])

  const { scrollY } = useScroll()
  const p = useTransform(scrollY, (y) => clamp01(y / (window.innerHeight * 0.9)))
  const scale = useTransform(p, [0, 1], [1, 1.12])
  const titleY = useTransform(p, (v) => `${45 * seg(v, 0, 0.5)}%`)
  const fadeOut = useTransform(p, (v) => 1 - seg(v, 0, 0.35))
  const hasVideo = video && !failed

  const toggle = () => {
    const v = player.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }
  const fade = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 14 },
    transition: { duration: 1, ease: EASE, delay },
  })
  const [primary, ...others] = ctas

  return (
    <section className="sticky top-0 z-0 h-svh w-full select-none overflow-hidden bg-black text-bone">
      {/* Video */}
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
              ref={player}
              src={video}
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
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
      </motion.div>

      <div className="absolute inset-0 z-10 flex flex-col px-5 pb-0 pt-[calc(var(--nav-h)+1.5rem)] md:px-10">
        {/* Arriba: etiqueta + frase · botones */}
        <motion.div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between" style={{ opacity: fadeOut }}>
          <div className="max-w-md">
            {eyebrow && (
              <motion.p className="text-[10px] uppercase tracking-[0.24em] text-bone/80 md:text-[11px]" {...fade(0.2)}>
                {eyebrow}
              </motion.p>
            )}
            {tagline && (
              <motion.p className="mt-3 font-display text-[clamp(1.5rem,6vw,2.4rem)] leading-[1.1]" {...fade(0.35)}>
                {tagline.join(' ')}
              </motion.p>
            )}
          </div>
          <motion.div className="flex flex-wrap gap-2.5 lg:flex-col lg:items-stretch" {...fade(0.5)}>
            {primary && (
              <SiteLink
                href={primary.href}
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-terracotta py-1.5 pl-5 pr-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone transition-[background-color,transform] duration-300 motion-safe:animate-halo hover:scale-[1.02] hover:bg-terracotta-dark md:py-2 md:pl-6 md:pr-2 md:text-[12px]"
              >
                <Roll>{primary.label}</Roll>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bone text-terracotta transition-transform duration-500 ease-out-expo group-hover:translate-x-1 md:h-9 md:w-9">
                  <Chevron dir={1} />
                </span>
              </SiteLink>
            )}
            {others.map((c) => (
              <SiteLink
                key={c.label}
                href={c.href}
                className="group inline-flex items-center justify-between gap-3 rounded-full border border-bone/50 bg-white/10 py-1.5 pl-5 pr-1.5 text-[11px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition-colors hover:border-bone hover:bg-bone hover:text-ink md:py-2 md:pl-6 md:pr-2 md:text-[12px]"
              >
                <Roll>{c.label}</Roll>
                <span className="flex h-8 w-8 rotate-90 items-center justify-center rounded-full border border-current/30 md:h-9 md:w-9">
                  <Chevron dir={1} />
                </span>
              </SiteLink>
            ))}
          </motion.div>
        </motion.div>

        {/* Abajo: datos + pausa, y el nombre enorme */}
        <div className="mt-auto">
          <motion.div
            className="flex items-center justify-between gap-4 border-b border-bone/30 pb-3"
            style={{ opacity: fadeOut }}
          >
            <motion.ul className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] uppercase tracking-[0.18em] text-bone/85 md:text-[11px]" {...fade(0.7)}>
              {meta.map((m, i) => (
                <li key={m} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-sage" />}
                  {m}
                </li>
              ))}
            </motion.ul>
            {hasVideo && (
              <motion.button
                type="button"
                onClick={toggle}
                aria-label={paused ? 'Reproducir video' : 'Pausar video'}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-bone/50 transition-colors hover:bg-bone hover:text-ink"
                {...fade(0.8)}
              >
                {paused ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                    <path d="M2 1l9 5-9 5z" />
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                    <path d="M2 1h3v10H2zM7 1h3v10H7z" />
                  </svg>
                )}
              </motion.button>
            )}
          </motion.div>

          <div ref={box} className="overflow-hidden">
            <motion.h1 style={{ y: titleY, opacity: fadeOut }} className="whitespace-nowrap leading-[0.86]">
              <motion.span
                ref={word}
                className="inline-block pb-[0.06em] pt-[0.12em] font-display"
                style={size ? { fontSize: size } : { fontSize: '16vw', visibility: 'hidden' }}
                initial={{ y: '100%' }}
                animate={{ y: ready ? '0%' : '100%' }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
              >
                {name}
              </motion.span>
            </motion.h1>
          </div>
        </div>
      </div>
    </section>
  )
}
