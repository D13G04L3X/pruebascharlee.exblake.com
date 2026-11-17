import { motion, useScroll, useTransform } from 'framer-motion'
import { hero } from '../content'
import { EASE, Img, Lines, Roll, SiteLink, clamp01, ez, seg } from './ui'

/* Hero fijo al fondo: el resto de la página sube por encima.
   Mientras llega la siguiente sección, la foto hace zoom y el texto se va. */
export default function Hero({ ready }) {
  const { scrollY } = useScroll()
  const p = useTransform(scrollY, (y) => clamp01(y / (window.innerHeight * 0.9)))
  const scale = useTransform(p, [0, 1], [1, 1.12])
  const contentY = useTransform(p, (v) => -80 * seg(v, 0, 0.3, ez.p2i))
  const contentOpacity = useTransform(p, (v) => 1 - seg(v, 0, 0.3, ez.p2i))

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
          <Img src={hero.image} alt="The Charlee, Medellín" dark eager className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </motion.div>

      <motion.div className="absolute inset-0 z-10" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="absolute left-6 top-[16%] md:left-10 lg:top-[7%]">
          <Lines
            as="h1"
            lines={hero.headline}
            show={ready}
            delay={0.1}
            className="display text-[clamp(2.75rem,12vw,4.5rem)] md:text-[5rem] lg:text-[5.64rem]"
          />
          <motion.div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:gap-5" {...fade(0.7)}>
            {hero.ctas.map((c) => (
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
        </div>

        <div className="pointer-events-none absolute bottom-[13%] left-0 right-0 px-6 md:px-10 lg:inset-0 lg:flex lg:items-center">
          <motion.div
            className="grid w-full grid-cols-2 gap-x-6 gap-y-1 md:flex md:items-end md:justify-between"
            {...fade(0.9)}
          >
            {hero.labels.map((l) => (
              <p key={l} className="text-[11px] uppercase tracking-[0.18em] md:text-sm lg:text-lg">
                {l}
              </p>
            ))}
          </motion.div>
        </div>

        <motion.div className="absolute bottom-6 w-full px-6 text-center md:bottom-7" {...fade(1.1)}>
          <p className="text-sm leading-[120%] md:text-base lg:text-lg">
            {hero.tagline[0]}
            <br />
            {hero.tagline[1]}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
