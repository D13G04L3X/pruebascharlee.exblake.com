import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { experiences } from '../content'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import { Band, CtaPanel, Heading, Pill, Rise, Statement, WideImage } from '../components/blocks'
import { EASE, FadeUp, INOUT, Img, pad } from '../components/ui'

/* Fila que se despliega: al abrirla aparecen la foto, el texto y los detalles. */
function Row({ item, i, open, onToggle, request }) {
  return (
    <FadeUp as="li" delay={(i % 3) * 0.05} className="border-b border-ink/20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group grid w-full cursor-pointer grid-cols-12 items-center gap-x-4 py-6 text-left lg:py-8"
      >
        <span className="col-span-2 text-[10px] tabular-nums tracking-[0.16em] text-ink/60 lg:col-span-1">{pad(i + 1)}</span>
        <span
          className={`col-span-8 text-[clamp(1.6rem,7vw,2.5rem)] font-medium leading-[1.02] tracking-[-0.05em] transition-transform duration-500 ease-out-expo lg:col-span-7 lg:text-[4.2vw] ${
            open ? 'lg:translate-x-4' : 'lg:group-hover:translate-x-4'
          }`}
        >
          {item.name}
        </span>
        <span className="col-span-3 hidden text-[11px] uppercase tracking-[0.18em] text-ink/60 lg:block">{item.tag}</span>
        <span className="col-span-2 flex justify-end lg:col-span-1">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 text-lg transition-all duration-500 ease-out-expo lg:h-12 lg:w-12 ${
              open ? 'rotate-45 bg-ink text-bone' : 'group-hover:bg-ink group-hover:text-bone'
            }`}
          >
            +
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.8, ease: INOUT }}
          >
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 pb-10 lg:pb-14">
              <motion.div
                className="col-span-12 h-[42svh] overflow-hidden rounded-[24px] lg:col-span-6 lg:col-start-2 lg:h-[62svh] lg:rounded-[32px]"
                initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1, ease: INOUT, delay: 0.1 }}
              >
                <motion.div className="h-full w-full" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: EASE }}>
                  <Img src={item.image} alt={item.name} className="h-full w-full" />
                </motion.div>
              </motion.div>
              <motion.div
                className="col-span-12 flex flex-col justify-between gap-8 lg:col-span-4 lg:col-start-9"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              >
                <div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink/60 lg:hidden">{item.tag}</span>
                  <p className="mt-3 text-sm leading-[1.5] tracking-[-0.01em] lg:mt-0 lg:text-lg lg:leading-[1.4]">{item.text}</p>
                  <ul className="mt-6">
                    {item.details.map((d) => (
                      <li key={d} className="border-t border-ink/20 py-3 text-[11px] uppercase tracking-[0.16em] last:border-b">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Pill href={request.href}>{request.label}</Pill>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeUp>
  )
}

export default function Experiences({ ready }) {
  const { hero, statement, list, steps, wide, cta } = experiences
  const [open, setOpen] = useState(0)

  return (
    <main id="top" className="overflow-x-clip">
      <PageHero ready={ready} {...hero} alt="Experiencias en The Charlee" />

      <Rise id="concepto">
        <Statement {...statement} />
      </Rise>

      <Band id="experiencias" className="px-6 pb-24 pt-4 md:px-10 lg:pb-36">
        <Heading eyebrow={list.eyebrow} title={list.title} className="mb-12 lg:mb-20">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
            {pad(list.items.length)} experiencias · toca para abrir
          </span>
        </Heading>
        <ul className="border-t border-ink/20">
          {list.items.map((item, i) => (
            <Row key={item.name} item={item} i={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} request={list.request} />
          ))}
        </ul>
      </Band>

      <Band className="pb-24 lg:pb-36">
        <WideImage {...wide} />
        <div className="px-6 pt-24 md:px-10 lg:pt-36">
          <Heading eyebrow={steps.eyebrow} title={steps.title} className="mb-12 lg:mb-20" />
          <ol className="grid gap-x-6 border-t border-ink/20 lg:grid-cols-3">
            {steps.items.map((s, i) => (
              <FadeUp as="li" key={s.title} delay={i * 0.1} className="border-b border-ink/20 py-8 lg:border-b-0 lg:py-10 lg:pr-10">
                <span className="text-[clamp(2.6rem,12vw,4.5rem)] font-medium leading-none tracking-[-0.06em] text-ink/25 lg:text-[5.5vw]">{pad(i + 1)}</span>
                <h3 className="mt-6 text-2xl font-medium tracking-[-0.04em] lg:text-[2.2vw]">{s.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-[1.5] tracking-[-0.01em] lg:text-lg lg:leading-[1.4]">{s.text}</p>
              </FadeUp>
            ))}
          </ol>
        </div>
      </Band>

      <CtaPanel {...cta} />
      <Footer />
    </main>
  )
}
