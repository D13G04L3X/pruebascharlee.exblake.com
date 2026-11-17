import { motion } from 'framer-motion'
import { footer } from '../content'
import { EASE, INOUT, Roll, SiteLink } from './ui'

const frame = {
  hide: { clipPath: 'inset(0% 100% 0% 0%)' },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.2, ease: INOUT, delayChildren: 0.55, staggerChildren: 0.06 },
  },
}
const rise = {
  hide: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: EASE } },
}
const rule = {
  hide: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
}

function Rev({ children, className = '', wrap = 'overflow-hidden' }) {
  return (
    <div className={wrap}>
      <motion.div variants={rise} className={className}>
        {children}
      </motion.div>
    </div>
  )
}

const Rule = () => <motion.div variants={rule} className="my-8 h-px origin-left bg-ink/20 md:my-16" />

function Col({ title, links }) {
  return (
    <div className="flex flex-col gap-4">
      <Rev className="text-xs uppercase tracking-[0.12em] text-ink/65">{title}</Rev>
      {links.map((l) => (
        <Rev key={l.label}>
          <SiteLink href={l.href} className="group block py-1 transition-opacity hover:opacity-60 lg:py-0">
            <Roll>{l.label}</Roll>
          </SiteLink>
        </Rev>
      ))}
    </div>
  )
}

export default function Footer() {
  return (
    <motion.footer
      id="contacto"
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative z-30 flex min-h-svh w-full flex-col bg-bone px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-ink md:px-10 md:py-6 lg:py-16"
    >
      <motion.div
        variants={frame}
        className="flex flex-1 flex-col justify-between rounded-[20px] border border-ink/20 px-5 py-6 md:rounded-[30px] md:px-10 md:py-10"
      >
        <div className="flex items-start justify-between gap-8 text-xs uppercase tracking-[0.12em] md:text-sm">
          <Rev>
            <SiteLink href="/" className="block" aria-label="The Charlee, inicio">
              <img src="/images/logos/charlee-footer.svg" alt="The Charlee, a joyful stay" className="block h-10 w-auto md:h-14" />
            </SiteLink>
          </Rev>
          <Rev wrap="hidden overflow-hidden md:block" className="text-right">
            {footer.tagline}
          </Rev>
        </div>

        <Rule />

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Rev wrap="overflow-hidden pb-[0.12em]">
              <h2 className="max-w-[12ch] font-display text-[clamp(2.5rem,11.5vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em] lg:text-[clamp(2.75rem,7vw,6.5rem)]">
                {footer.tagline}
              </h2>
            </Rev>
            <Rev className="mt-6 max-w-xl text-lg leading-[1.2] md:text-xl">{footer.sub}</Rev>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm md:gap-12 lg:min-w-[360px] lg:gap-20 lg:text-base">
            <Col title="Explorar" links={footer.explore} />
            <Col title="Seguir" links={footer.follow} />
          </div>
        </div>

        <Rule />

        <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.12em] lg:flex-row lg:items-center lg:justify-between lg:text-sm">
          <div className="flex flex-col gap-1.5">
            <Rev>© The Charlee {new Date().getFullYear()}</Rev>
            <Rev className="text-[10px] text-ink/55 md:text-[11px]">{footer.address}</Rev>
          </div>
          <Rev wrap="-m-2 overflow-hidden p-2" className="flex items-center gap-2.5 py-1 text-[11px] text-ink/70 lg:py-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf/70" />
              <span aria-hidden className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
            </span>
            {footer.status}
          </Rev>
          <Rev>
            <a href="#top" className="group block py-1 transition-opacity hover:opacity-60 lg:py-0">
              <Roll>Volver arriba</Roll>
            </a>
          </Rev>
        </div>
      </motion.div>
    </motion.footer>
  )
}
