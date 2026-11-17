import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { aboutPage } from '../content'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Slides from '../components/Slides'
import { Band, CtaPanel, Heading, Rise, Statement, Stats, Strip, WideImage } from '../components/blocks'
import { FadeUp, Img, Roll, SiteLink, pad } from '../components/ui'

/* Ubicación: texto y distancias a un lado, foto con parallax al otro. */
function Location({ data }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <Band id="ubicacion" className="px-6 py-24 md:px-10 lg:py-36">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-6">
          <Heading eyebrow={data.eyebrow} title={data.title} />
          <FadeUp as="p" className="mt-8 max-w-md text-sm leading-[1.5] tracking-[-0.01em] lg:text-lg lg:leading-[1.4]">
            {data.text}
          </FadeUp>
          <dl className="mt-10 lg:mt-14">
            {data.items.map((it, i) => (
              <FadeUp key={it.name} delay={i * 0.05} className="flex items-baseline justify-between gap-6 border-t border-ink/20 py-4 last:border-b">
                <dt className="text-base font-medium tracking-[-0.03em] lg:text-xl">{it.name}</dt>
                <dd className="text-right text-[11px] uppercase tracking-[0.18em] text-ink/60">{it.value}</dd>
              </FadeUp>
            ))}
          </dl>
          <FadeUp as="p" className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink/60">
            {data.address}
          </FadeUp>
        </div>
        <div ref={ref} className="col-span-12 h-[60svh] overflow-hidden rounded-[28px] lg:col-span-5 lg:col-start-8 lg:h-auto lg:min-h-[80svh] lg:rounded-[36px]">
          <motion.div style={{ y }} className="h-[118%] w-full -translate-y-[8%]">
            <Img src={data.image.src} alt={data.image.alt} className="h-full w-full" />
          </motion.div>
        </div>
      </div>
    </Band>
  )
}

/* Tres tarjetas hacia el resto del sitio */
function Explore({ data }) {
  return (
    <Band className="px-6 pb-24 md:px-10 lg:pb-36">
      <Heading eyebrow={data.eyebrow} title={data.title} className="mb-12 lg:mb-20" />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {data.items.map((l, i) => (
          <FadeUp key={l.href} delay={i * 0.1}>
            <SiteLink href={l.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink text-white md:rounded-[32px] lg:aspect-[4/5]">
                <Img src={l.image} alt={l.label} className="h-full w-full transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
                <div className="absolute inset-x-0 top-0 flex justify-between p-5 text-[11px] uppercase tracking-[0.18em] md:p-7">
                  <span>{l.kicker}</span>
                  <span className="tabular-nums">{pad(i + 1)}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <h3 className="text-[clamp(1.8rem,7.5vw,2.5rem)] font-medium leading-none tracking-[-0.05em] lg:text-[2.8vw]">
                    <Roll>{l.label}</Roll>
                  </h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                    →
                  </span>
                </div>
              </div>
            </SiteLink>
          </FadeUp>
        ))}
      </div>
    </Band>
  )
}

export default function About({ ready }) {
  const { hero, statement, stats, wide, panels, location, strip, links, cta } = aboutPage
  return (
    <main id="top" className="overflow-x-clip">
      <PageHero ready={ready} {...hero} alt="The Charlee, Medellín" />

      <Rise id="historia">
        <Statement {...statement} />
        <Stats items={stats} />
        <WideImage {...wide} className="pb-24 pt-20 lg:pb-36 lg:pt-32" />
      </Rise>

      <Slides items={panels} id="detalle" />
      <Location data={location} />
      <Strip id="edificio" {...strip} />
      <Explore data={links} />
      <CtaPanel {...cta} />
      <Footer />
    </main>
  )
}
