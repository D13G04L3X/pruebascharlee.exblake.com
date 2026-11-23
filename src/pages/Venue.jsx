import { envy, restaurant } from '../content'
import BookBar from '../components/BookBar'
import Footer from '../components/Footer'
import MastheadHero from '../components/MastheadHero'
import PageHero from '../components/PageHero'
import Slides from '../components/Slides'
import { Band, Bento, CtaPanel, Heading, HoverList, InfoBand, PhotoBanner, Pill, Rise, Statement, Strip } from '../components/blocks'

/* Plantilla de los dos espacios del hotel: restaurante (clara) y rooftop (oscura).
   Portada → concepto y horarios → paneles → carta con foto flotante → fotos → reservar. */
function Venue({ data, ready, dark = false, listId }) {
  return (
    <main id="top" className="overflow-x-clip">
      {data.hero.layout === 'cabecera' ? (
        <MastheadHero ready={ready} {...data.hero} alt={data.name} />
      ) : (
        <PageHero ready={ready} {...data.hero} alt={data.name} />
      )}

      <Rise dark={dark} id="concepto">
        <Statement dark={dark} {...data.statement} />
      </Rise>

      <Slides items={data.panels} id="detalle" dark={dark} />

      <Band dark={dark} id={listId} className="px-6 py-24 md:px-10 lg:py-36">
        <Heading eyebrow={data.menu.eyebrow} title={data.menu.title} className="mb-12 lg:mb-20">
          <Pill href={data.cta.panel === false ? data.cta.button.href : '#reservar'} dark={dark}>
            {data.cta.button.label}
          </Pill>
        </Heading>
        <HoverList dark={dark} items={data.menu.items} />
      </Band>

      {data.music && <PhotoBanner id="musica" {...data.music} />}
      {data.events && <InfoBand id="eventos" {...data.events} />}

      {data.strip.layout === 'bento' ? <Bento id="ambiente" {...data.strip} /> : <Strip dark={dark} id="ambiente" {...data.strip} />}
      {data.cta.panel !== false && <CtaPanel dark={dark} {...data.cta} />}
      <Footer />
      {data.bookBar && <BookBar {...data.bookBar} />}
    </main>
  )
}

export const Restaurant = ({ ready }) => <Venue data={restaurant} ready={ready} listId="carta" />
export const EnvyRooftop = ({ ready }) => <Venue data={envy} ready={ready} dark listId="barra" />
