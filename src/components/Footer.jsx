import { motion } from 'framer-motion'
import { booking, footer, nav } from '../content'
import { onlyEnabled } from '../site'
import { Chevron, EASE, INOUT, Img, Roll, SiteLink } from './ui'

/* Footer en una tarjeta oscura con profundidad:
   1. Bloque superior con foto de fondo: frase, subtítulo y botón de reserva.
   2. Columnas: el hotel (logo, dirección, estado) · Explorar (las páginas del menú) · Síguenos · Legal.
   3. Barra final: © y derechos · crédito a ExBlake · volver arriba.
   Detrás de todo, el nombre del hotel enorme y tenue. */

const frame = {
  hide: { clipPath: 'inset(0% 100% 0% 0%)' },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.2, ease: INOUT, delayChildren: 0.55, staggerChildren: 0.05 },
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

const Rule = ({ className = '' }) => <motion.div variants={rule} className={`h-px origin-left bg-bone/15 ${className}`} />

// Páginas del menú (sin "Contacto", que es este mismo footer)
const pages = onlyEnabled(nav).filter((l) => l.href !== '#contacto')

const icons = {
  Instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2H7.6v3.3h2.8V22H14V11.8h2.7l.4-3.3H14z" />
    </svg>
  ),
  TikTok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3.2v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.2 6.2 0 1 0 5.2 6.1V8.6a7.9 7.9 0 0 0 4.4 1.4V6.8A4.6 4.6 0 0 1 16.6 2z" />
    </svg>
  ),
}

function ColTitle({ children }) {
  return <Rev className="mb-4 text-[10px] uppercase tracking-[0.2em] text-sage md:mb-5 md:text-[11px]">{children}</Rev>
}

function LinkList({ title, links }) {
  return (
    <div>
      <ColTitle>{title}</ColTitle>
      <ul className="flex flex-col gap-2.5 md:gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Rev>
              <SiteLink href={l.href} className="group inline-block text-sm text-bone/85 transition-colors hover:text-white md:text-[15px]">
                <Roll>{l.label}</Roll>
              </SiteLink>
            </Rev>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <motion.footer
      id="contacto"
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative z-30 w-full bg-bone px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-5 md:pb-5 md:pt-5 lg:px-8 lg:pb-8"
    >
      <motion.div
        variants={frame}
        className="relative overflow-hidden rounded-[24px] bg-ink text-bone shadow-[0_30px_80px_-30px_rgba(69,70,60,0.6)] md:rounded-[36px]"
      >
        {/* 1 · Bloque superior con foto */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Img src={footer.image} alt="" className="h-full w-full scale-105 opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/55 to-ink" />
          </div>
          <div className="relative flex flex-col gap-8 px-5 pb-10 pt-8 md:px-10 md:pb-14 md:pt-10 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:pb-16 lg:pt-14">
            <div>
              <Rev className="mb-5 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-bone/70 md:text-[11px]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/70" />
                  <span aria-hidden className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
                </span>
                {footer.status}
              </Rev>
              <Rev wrap="overflow-hidden pb-[0.12em]">
                <h2 className="max-w-[12ch] text-[clamp(2.4rem,11vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em] lg:text-[clamp(3rem,6.5vw,6.5rem)]">
                  {footer.tagline}
                </h2>
              </Rev>
              <Rev className="mt-4 max-w-md text-base leading-[1.35] text-bone/75 md:mt-5 md:text-lg">{footer.sub}</Rev>
            </div>
            <Rev wrap="-m-6 overflow-hidden p-6 lg:-m-14 lg:mb-8 lg:p-14">
              <SiteLink
                href={booking.href}
                className="group inline-flex items-center gap-4 rounded-full bg-terracotta py-2 pl-6 pr-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-bone transition-[background-color,transform] duration-300 motion-safe:animate-halo hover:scale-[1.03] hover:bg-terracotta-dark md:text-[13px]"
              >
                <Roll>{booking.label}</Roll>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bone text-terracotta transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                  <Chevron dir={1} />
                </span>
              </SiteLink>
            </Rev>
          </div>
        </div>

        {/* 2 · Columnas */}
        <div className="relative px-5 md:px-10 lg:px-14">
          <Rule />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 md:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-10">
            {/* El hotel */}
            <div className="col-span-2 lg:col-span-1">
              <Rev>
                <SiteLink href="/" className="inline-block" aria-label="The Charlee, inicio">
                  <img
                    src="/images/logos/charlee-footer.svg"
                    alt="The Charlee, a joyful stay"
                    className="block h-10 w-auto brightness-0 invert md:h-12"
                  />
                </SiteLink>
              </Rev>
              <Rev className="mt-5 max-w-[16rem] text-sm leading-[1.5] text-bone/65">{footer.address}</Rev>
            </div>

            <LinkList title="Explorar" links={pages} />

            {/* Redes sociales */}
            <div>
              <ColTitle>Síguenos</ColTitle>
              <ul className="flex flex-col gap-2.5 md:gap-3">
                {footer.follow.map((f) => (
                  <li key={f.label}>
                    <Rev>
                      <a
                        href={f.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 text-sm text-bone/85 transition-colors hover:text-white md:text-[15px]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-bone/20 transition-colors duration-300 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                          {icons[f.label]}
                        </span>
                        <Roll>{f.label}</Roll>
                      </a>
                    </Rev>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <LinkList title="Legal" links={footer.legal} />
            </div>
          </div>

          {/* 3 · Barra final */}
          <Rule />
          <div className="relative z-10 flex flex-col gap-5 py-6 text-[11px] uppercase tracking-[0.14em] text-bone/55 md:flex-row md:items-center md:justify-between md:py-8">
            <Rev>
              © {year} The Charlee. {footer.rights}
            </Rev>
            <Rev>
              {footer.credit.prefix}{' '}
              <a
                href={footer.credit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-semibold text-bone transition-colors hover:text-white"
              >
                <Roll className="border-b border-bone/40 group-hover:border-white">{footer.credit.label}</Roll>
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </Rev>
            <Rev>
              <a href="#top" className="group inline-flex items-center gap-3 text-bone transition-colors hover:text-white">
                <Roll>Volver arriba</Roll>
                <span className="flex h-9 w-9 -rotate-90 items-center justify-center rounded-full border border-bone/25 transition-all duration-300 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                  <Chevron dir={1} />
                </span>
              </a>
            </Rev>
          </div>
        </div>

        {/* Nombre del hotel enorme y tenue, al fondo */}
        <div
          aria-hidden
          className="pointer-events-none -mt-[3vw] select-none overflow-hidden whitespace-nowrap px-5 text-center text-[14.5vw] font-semibold leading-[0.75] tracking-[-0.06em] text-bone/[0.05] md:px-10"
        >
          The Charlee
        </div>
      </motion.div>
    </motion.footer>
  )
}
