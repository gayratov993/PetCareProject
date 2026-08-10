/**
 * Hayvon turlari uchun haqiqiy rasmlar.
 * Rasmlar `public/images/pets/` papkasida lokal saqlanadi.
 */

const PET_IMAGES = {
  dog: '/images/pets/dog.jpg',
  cat: '/images/pets/cat.jpg',
  rabbit: '/images/pets/rabbit.jpg',
  bird: '/images/pets/bird.jpg',
  hamster: '/images/pets/hamster.jpg',
  fish: '/images/pets/fish.jpg',
  turtle: '/images/pets/turtle.jpg',
  horse: '/images/pets/horse.jpg',
}

// O'zbek tilidagi nomlarni standart kalitlarga moslash
const ALIASES = {
  it: 'dog',
  mushuk: 'cat',
  quyon: 'rabbit',
  qush: 'bird',
  baliq: 'fish',
  toshbaqa: 'turtle',
  ot: 'horse',
}

export const petTypeKeys = Object.keys(PET_IMAGES)

/**
 * Hayvon turi bo'yicha rasm yo'lini qaytaradi.
 * Agar topilmasa, dog rasmini qaytaradi.
 */
export function petImage(species) {
  const key = String(species || '').toLowerCase()
  return PET_IMAGES[ALIASES[key]] || PET_IMAGES[key] || PET_IMAGES.dog
}
