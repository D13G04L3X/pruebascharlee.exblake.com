// Todo el texto y las rutas de imágenes viven aquí.
// Las fotos van en /public/images con estos nombres (jpg o webp, cambia la extensión aquí).
const img = (name) => `/images/${name}.jpg`

export const brand = 'THE / CHARLEE'

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
  headline: ['Medellín,', 'elevada.'],
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
  tagline: 'Medellín, elevada.',
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
}

// ───────────────────────── Habitaciones ─────────────────────────
// Botón de reserva de todas las habitaciones: cambia el href por el enlace del motor de reservas.
export const booking = { label: 'Reservar ahora', href: '#contacto' }

export const roomsPage = {
  eyebrow: 'Habitaciones',
  title: ['Cuatro maneras', 'de quedarse.'],
  intro: 'Del estudio luminoso frente al parque al último piso con la ciudad entera a la vista. Elige la tuya.',
  cta: 'Ver habitación',
  // Carrusel al final de cada habitación
  more: { eyebrow: 'También te puede interesar', title: ['Otras maneras', 'de quedarse.'], all: 'Todas las habitaciones' },
}

// Una página por habitación en /habitaciones/<slug>.
// Video: /public/videos/<slug>.mp4 · Fotos: /public/images/rooms/<slug>-N.jpg (la primera es la portada).
const room = (slug, count, alts, data) => ({
  slug,
  video: `/videos/${slug}.mp4`,
  images: Array.from({ length: count }, (_, i) => ({
    src: `/images/rooms/${slug}-${i + 1}.jpg`,
    alt: alts[i] ?? data.name,
  })),
  ...data,
})

export const rooms = [
  room('deluxe', 5, ['Cama king de la Deluxe', 'Cabecera y mesa de noche', 'Rincón de lectura', 'Baño con ducha de vidrio', 'Ventana a la ciudad'], {
    name: 'Deluxe',
    kicker: 'Habitación',
    tagline: ['Todo lo esencial,', 'nada de sobra.'],
    meta: ['32 m²', '2 huéspedes', 'Cama king', 'Vista a la ciudad'],
    statement: 'Un refugio luminoso para llegar, soltar la maleta y bajar el ritmo.',
    description:
      'Líneas limpias, madera cálida y una cama que invita a quedarse. La Deluxe reúne lo necesario para una estadía sin esfuerzo, a pasos del Parque Lleras.',
    specs: [
      { label: 'Tamaño', value: '32 m²' },
      { label: 'Huéspedes', value: 'Hasta 2' },
      { label: 'Cama', value: 'King' },
      { label: 'Vista', value: 'Ciudad' },
    ],
    amenities: ['Wi-Fi de alta velocidad', 'Aire acondicionado', 'Smart TV', 'Minibar', 'Caja fuerte', 'Ducha tipo lluvia', 'Amenities de baño', 'Servicio a la habitación'],
  }),
  room('junior-suite', 5, ['Cama y zona de estar de la Junior Suite', 'Sala con luz natural', 'La habitación de día', 'Baño con tina', 'Detalle de la cama'], {
    name: 'Junior Suite',
    kicker: 'Suite',
    tagline: ['Más espacio,', 'la misma calma.'],
    meta: ['45 m²', '2 huéspedes', 'Cama king', 'Balcón al parque'],
    statement: 'Sala, balcón y una cama frente a la ventana: espacio de sobra para quedarse un día más.',
    description:
      'Una zona de estar separada, balcón abierto al verde del parque y un baño pensado para tomarse su tiempo. La Junior Suite es el punto medio perfecto.',
    specs: [
      { label: 'Tamaño', value: '45 m²' },
      { label: 'Huéspedes', value: 'Hasta 2' },
      { label: 'Cama', value: 'King' },
      { label: 'Vista', value: 'Parque Lleras' },
    ],
    amenities: ['Balcón privado', 'Sala de estar', 'Wi-Fi de alta velocidad', 'Aire acondicionado', 'Smart TV', 'Minibar', 'Tina', 'Servicio a la habitación'],
  }),
  room('suite-charlee', 5, ['La Suite Charlee', 'Sala de la suite', 'La habitación de noche', 'Tina exenta', 'Sala con luz de tarde'], {
    name: 'Suite Charlee',
    kicker: 'Suite',
    tagline: ['La ciudad,', 'desde tu sala.'],
    meta: ['68 m²', '3 huéspedes', 'Cama king', 'Vista panorámica'],
    statement: 'La suite que lleva el nombre del hotel: amplia, serena y abierta a Medellín.',
    description:
      'Sala independiente, comedor, una habitación que se cierra por completo y una tina frente a la luz. Arte en las paredes y la ciudad en cada ventana.',
    specs: [
      { label: 'Tamaño', value: '68 m²' },
      { label: 'Huéspedes', value: 'Hasta 3' },
      { label: 'Cama', value: 'King + sofá cama' },
      { label: 'Vista', value: 'Panorámica' },
    ],
    amenities: ['Sala y comedor', 'Balcón privado', 'Tina exenta', 'Wi-Fi de alta velocidad', 'Smart TV en sala y habitación', 'Minibar', 'Cafetera', 'Servicio a la habitación'],
  }),
  room('penthouse', 6, ['El Penthouse', 'Comedor del Penthouse', 'Terraza con vista', 'Baño principal', 'Habitación principal', 'Cocina abierta'], {
    name: 'Penthouse',
    kicker: 'Último piso',
    tagline: ['El último piso,', 'solo para ti.'],
    meta: ['120 m²', '4 huéspedes', '2 habitaciones', 'Terraza privada'],
    statement: 'Dos habitaciones, terraza privada y Medellín entera a tus pies.',
    description:
      'El espacio más alto del hotel: sala de doble altura, cocina abierta, comedor para recibir y una terraza donde el atardecer se queda más tiempo.',
    specs: [
      { label: 'Tamaño', value: '120 m²' },
      { label: 'Huéspedes', value: 'Hasta 4' },
      { label: 'Camas', value: '2 king' },
      { label: 'Vista', value: '360° sobre la ciudad' },
    ],
    amenities: ['Terraza privada', 'Dos habitaciones', 'Cocina abierta', 'Comedor', 'Tina', 'Wi-Fi de alta velocidad', 'Smart TV', 'Servicio a la habitación'],
  }),
]

// Restaurante, rooftop, experiencias, el hotel y galería
export * from './content-pages'
