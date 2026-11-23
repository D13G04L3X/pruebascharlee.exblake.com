// Todo el texto y las rutas de imágenes viven aquí.
// Las fotos van en /public/images con estos nombres (jpg o webp, cambia la extensión aquí).
const img = (name) => `/images/${name}.jpg`

export const brand = 'The Charlee'

export const nav = [
  // image: foto que acompaña al enlace en el menú a pantalla completa
  { label: 'Habitaciones', href: '/habitaciones', image: img('rooms/suite-charlee-1') },
  { label: 'Restaurante', href: '/restaurante', image: img('pages/resto-1') },
  { label: 'Rooftop', href: '/rooftop', image: img('pages/envy-1') },
  { label: 'Experiencias', href: '/experiencias', image: img('pages/exp-2') },
  { label: 'Galería', href: '/galeria', image: img('pages/hotel-2') },
  { label: 'El hotel', href: '/hotel', image: img('pages/hotel-1') },
  { label: 'Contacto', href: '#contacto', image: img('hero') },
]

export const hero = {
  image: img('hero'),
  labels: ['Hotel de diseño', 'Parque Lleras', 'Medellín', 'Explorar'],
  // Propósito de marca (manual, 1.8 “We exist to”)
  headline: ['Despierta el Charlee', 'que hay en ti.'],
  tagline: ['Un hotel es más que su edificio.', 'Es cómo la ciudad entra en él.'],
  ctas: [
    { label: 'Explorar el hotel', href: '#hotel' },
    { label: 'Vivir el rooftop', href: '/rooftop' },
  ],
}

// Collage de seis fotos alrededor del título
export const gallery = {
  title: 'Una forma más viva de quedarse',
  items: [
    { src: img('galeria-1'), alt: 'Fachada del hotel' },
    { src: img('galeria-2'), alt: 'Lobby' },
    { src: img('galeria-3'), alt: 'Suite' },
    { src: img('galeria-4'), alt: 'Piscina' },
    { src: img('galeria-5'), alt: 'Vista aérea' },
    { src: img('galeria-6'), alt: 'El hotel de noche' },
  ],
}

export const about = {
  title: 'Sobre',
  statement: 'Un hotel pensado para vivir Medellín desde adentro.',
  body: 'Frente al Parque Lleras, en el corazón de El Poblado, The Charlee reúne arte, diseño y hospitalidad en un mismo edificio. Espacios abiertos a la luz, materiales honestos y la ciudad siempre a la vista.',
  // Carrusel central (el que se expande y luego se encoge dentro del texto)
  slides: Array.from({ length: 7 }, (_, i) => ({
    src: img(`interior-${i + 1}`),
    alt: `The Charlee interior ${i + 1}`,
  })),
}

export const spaces = {
  eyebrow: 'Espacios',
  hint: 'Desliza para entrar',
  items: [
    { src: img('espacio-1'), title: 'Vista completa', text: 'El edificio frente al parque' },
    { src: img('espacio-2'), title: 'Lobby', text: 'Arte y llegada sin prisa' },
    { src: img('espacio-3'), title: 'Suites', text: 'Balcones abiertos a la ciudad' },
    { src: img('espacio-4'), title: 'Piscina', text: 'Agua, sol y horizonte' },
    { src: img('espacio-5'), title: 'Rooftop', text: 'La noche empieza arriba' },
  ],
}

// Paneles a pantalla completa: texto a un lado, foto al otro
export const features = [
  {
    title: 'Proporción antes que exceso.',
    text: 'Cada piso se abre hacia afuera. Balcones amplios, techos altos y una fachada que deja entrar el barrio sin perder la calma.',
    src: img('detalle-dia'),
    alt: 'El edificio de día',
  },
  {
    title: 'Cuando cae la tarde, cambia todo.',
    text: 'La luz baja por las montañas, el parque se enciende y el edificio se vuelve un mirador sobre la ciudad.',
    src: img('detalle-noche'),
    alt: 'El edificio al atardecer',
  },
]

export const suitesIntro = {
  eyebrow: 'Suites',
  title: ['No todo lujo necesita', 'hacer ruido.'],
}

export const cards = {
  eyebrow: 'Suites',
  title: ['Otra manera', 'de quedarse.'],
  caption: 'Dentro de la suite',
  link: { label: 'Ver habitaciones', href: '/habitaciones' },
  items: [
    {
      kicker: 'La sala',
      title: 'Todo al alcance.',
      text: 'Un espacio para llegar, soltar la maleta y quedarse un rato más.',
      tags: ['Sala', 'Balcón', 'Minibar', 'Wi-Fi'],
      src: img('card-1'),
    },
    {
      kicker: 'La habitación',
      title: 'Mañanas lentas, luz suave.',
      text: 'Cama king, lencería de pluma y cortinas que deciden cuándo empieza el día.',
      tags: ['Vista al parque', 'Cama king'],
      src: img('card-2'),
    },
    {
      kicker: 'El baño',
      title: 'Un respiro propio.',
      text: 'Tina, piedra y vapor: el final perfecto para un día en la ciudad.',
      tags: ['Tina', 'Luz natural'],
      src: img('card-3'),
    },
  ],
}

export const rooftop = {
  image: img('rooftop'),
  alt: 'Rooftop de The Charlee al atardecer',
  eyebrow: 'Explora el Rooftop',
  chips: ['Piscina', 'Bar', 'Atardecer', 'Ciudad'],
  title: 'Pasa adelante.',
  text: 'Reserva tu estadía y vive Medellín desde su mejor altura: piscina, bar y la ciudad entera a tus pies.',
  button: { label: 'Reservar', href: '#contacto' },
}

export const footer = {
  // Frase de marca (manual, 2.4 Elementos complementarios)
  tagline: 'Todo lo que imaginas, pero mejor.',
  sub: 'Arte, diseño y hospitalidad frente al Parque Lleras.',
  explore: [
    { label: 'Habitaciones', href: '/habitaciones' },
    { label: 'Real Eatery', href: '/restaurante' },
    { label: 'Envy Rooftop', href: '/rooftop' },
    { label: 'Experiencias', href: '/experiencias' },
    { label: 'Galería', href: '/galeria' },
    { label: 'El hotel', href: '/hotel' },
  ],
  // Reemplaza los "#" por los enlaces reales
  follow: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'TikTok', href: '#' },
  ],
  address: 'Calle 9A #37-16 · El Poblado, Medellín',
  status: 'Reservas abiertas',
  image: img('rooftop'), // foto de fondo del bloque superior del footer
  // Reemplaza los "#" por las páginas legales reales
  legal: [
    { label: 'Términos y condiciones', href: '#' },
    { label: 'Política de privacidad', href: '#' },
    { label: 'Tratamiento de datos', href: '#' },
    { label: 'Política de cookies', href: '#' },
  ],
  rights: 'Todos los derechos reservados.',
  credit: { prefix: 'Diseño y desarrollo por', label: 'ExBlake', href: 'https://exblake.com' },
}

// ───────────────────────── Habitaciones ─────────────────────────
// Botón de reserva de todas las habitaciones: cambia el href por el enlace del motor de reservas.
export const booking = { label: 'Reservar ahora', href: '#contacto' }

export const roomsPage = {
  eyebrow: 'Hotel The Charlee · El Poblado, Medellín',
  title: ['Habitaciones'],
  cta: 'Ver habitación',
  // Carrusel al final de cada habitación
  more: { eyebrow: 'También te puede interesar', title: ['Otras', 'habitaciones.'], all: 'Todas las habitaciones' },
}

// Generales (para todas las habitaciones)
export const roomGeneral = {
  eyebrow: 'Generales',
  title: 'Todas nuestras habitaciones cuentan con',
}
const roomGeneralItems = [
  'Vista al Parque Lleras',
  'Aire acondicionado',
  'Cama con pillow tops de plumas',
  'Sábanas 100% algodón importadas',
  'Duvets premium',
  'Toallas de algodón',
  'Amenities de lujo',
  'Conexión WiFi',
  'Telefonía IP',
  'Direct TV',
  'Caja de seguridad',
  'Exclusivo Maxibar',
  'Mobiliario importado de Malasia y Bali',
  'Baños con enchapes y pisos en piedra natural',
  'Exposición de arte única en el piso de tu habitación',
]

// Notas de importancia (todas las habitaciones)
export const roomNotes = {
  eyebrow: 'Para todas las habitaciones',
  title: 'Notas de importancia',
  items: [
    'No se permiten camas adicionales o extras.',
    'Por políticas establecidas en nuestro hotel y de acuerdo a la ley 3535, está prohibido fumar en espacios cerrados.',
    'Se admiten mascotas, con un máximo de 2 por habitación y sin límite de tamaño. Tiene un cargo de COP 150.000 por mascota, por noche, que se paga en el hotel. Por favor infórmenos al reservar. Las mascotas no pueden quedarse solas en la habitación y deben ir con correa en las áreas comunes. No se permite su ingreso a la piscina ni al restaurante. Los daños ocasionados se cobrarán al huésped.',
  ],
}

// Una página por habitación en /habitaciones/<slug>.
// media: nombre de los archivos en /public/videos/<media>.mp4 y /public/images/rooms/<media>-N.jpg (la primera es la portada).
const room = (slug, media, count, data) => ({
  slug,
  video: `/videos/${media}.mp4`,
  images: Array.from({ length: count }, (_, i) => ({
    src: `/images/rooms/${media}-${i + 1}.jpg`,
    alt: `${data.name}, foto ${i + 1}`,
  })),
  ...data,
  amenities: roomGeneralItems,
})

const specs = (size, beds) => [
  { label: 'Tamaño', value: size },
  { label: 'Huéspedes', value: '2' },
  { label: 'Camas', value: beds },
  { label: 'Baño', value: '1' },
]

export const rooms = [
  room('king', 'deluxe', 5, {
    name: 'King',
    tagline: ['Una habitación para', 'una estancia prestigiosa.'],
    meta: ['45 m²', '2 huéspedes', '1 cama', '1 baño', 'WiFi gratis', 'Aire acondicionado', 'Maxi bar'],
    statement: 'Una habitación para una estancia prestigiosa.',
    description:
      'En el Hotel The Charlee en Medellín, situado en el exclusivo barrio El Poblado, cerca de Provenza, descubre la comodidad suprema en nuestras Habitaciones King. Con 45 m² de espacio, estas habitaciones están entre las más amplias en Medellín. Cada detalle ha sido cuidadosamente seleccionado, desde la decoración contemporánea hasta las comodidades como internet de alta velocidad y televisión de pantalla plana, garantizando una estancia inigualable. Además, todas nuestras habitaciones cuentan con un balcón privado para que disfrutes de impresionantes vistas urbanas.',
    specs: specs('45 m²', '1'),
  }),
  room('doble', 'junior-suite', 5, {
    name: 'Doble',
    tagline: ['Una estancia diseñada', 'para compartir momentos.'],
    meta: ['45 m²', '2 huéspedes', '2 camas', '1 baño', 'WiFi gratis', 'Aire acondicionado', 'Maxi bar'],
    statement: 'Una estancia diseñada para compartir momentos.',
    description:
      'Con una opción de dos camas en un espacio de 45 m², nuestras Habitaciones Dobles ofrecen una experiencia inigualable en el exclusivo barrio El Poblado, cerca de Provenza. Cada detalle, desde la decoración moderna hasta las comodidades como internet de alta velocidad y televisión de pantalla plana, ha sido cuidadosamente diseñado para garantizar tu confort. Además, todas nuestras habitaciones cuentan con un balcón privado para disfrutar de las vistas de Medellín.',
    specs: specs('45 m²', '2'),
  }),
  room('spice-bedrooms', 'suite-charlee', 5, {
    name: 'Spice Bedrooms',
    tagline: ['Un espacio que fusiona', 'sabor y buen gusto.'],
    meta: ['54 m²', '2 huéspedes', '1 cama', '1 baño', 'WiFi gratis', 'Aire acondicionado', 'Maxi bar'],
    statement: 'Un espacio que fusiona sabor y buen gusto.',
    description:
      'En el Hotel The Charlee en Medellín, situado en el exclusivo barrio El Poblado, cerca de Provenza, sumérgete en una experiencia culinaria única en nuestras Habitaciones Spice. Estas habitaciones de 54 m² cuentan con un exclusivo teppanyaki grill privado, ofreciendo un ambiente de sofisticación y entretenimiento. Disfruta de la cocina japonesa preparada por un chef experto en tu propio espacio privado. Con balcón y un diseño que invita al relax, esta es una experiencia que no te puedes perder.',
    specs: specs('54 m²', '1'),
  }),
  room('acqua', 'junior-suite', 5, {
    name: 'Acqua',
    tagline: ['Una estancia llena de armonía,', 'calma y relajación.'],
    meta: ['60 m²', '2 huéspedes', '1 cama', '1 baño', 'WiFi gratis', 'Aire acondicionado', 'Maxi bar'],
    statement: 'Una estancia llena de armonía, calma y relajación.',
    description:
      'En el Hotel The Charlee en Medellín, situado en el exclusivo barrio El Poblado, cerca de Provenza, relájate y revitaliza tus sentidos en nuestras Habitaciones Acqua. Con 60 m² de espacio, estas habitaciones, entre las más amplias de Medellín, te ofrecen un jacuzzi de hidromasaje con cromoterapia para una experiencia de bienestar total. Cada habitación cuenta con un balcón privado y ha sido diseñada para que disfrutes de una estancia en total armonía con tu entorno.',
    specs: specs('60 m²', '1'),
  }),
  room('envy', 'penthouse', 6, {
    name: 'Envy',
    tagline: ['Una estancia creada para', 'despertar tus sentidos.'],
    meta: ['100 m²', '2 huéspedes', '1 cama', '1 baño', 'WiFi gratis', 'Aire acondicionado', 'Maxi bar'],
    statement: 'Una estancia creada para despertar tus sentidos.',
    description:
      'En el Hotel The Charlee en Medellín, situado en el exclusivo barrio El Poblado, cerca de Provenza, vive el lujo en su máxima expresión en nuestras Habitaciones Envy, las suites más grandes de Medellín con 100 m² de espacio. Estas habitaciones te ofrecen la oportunidad de disfrutar de platos preparados en tu propio teppanyaki grill y relajarte en un jacuzzi privado. Con un diseño elegante y comodidades exclusivas, cada detalle ha sido pensado para ofrecerte una estancia inolvidable.',
    specs: specs('100 m²', '1'),
  }),
]

// Restaurante, rooftop, experiencias, el hotel y galería
export * from './content-pages'
