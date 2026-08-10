/**
 * Oziqlantirish bo'yicha ma'lumotlar — statik JSON.
 * Har bir hayvon turi uchun tavsiya/taqiq va yosh guruhlari bo'yicha ratsion.
 */
export const nutritionData = {
  dog: {
    good: ['dogGood'],
    bad: ['dogBad'],
    ages: {
      puppy: 'Kuchukchalar kuniga 3-4 marta, kichik porsiyalarda ovqatlantiriladi. Ratsion oqsillarga boy bo\'lishi kerak.',
      adult: 'Kattalar itlari kuniga 1-2 marta ovqatlanadi. Muvozanatli quruq ozuqa + go\'sht + sabzavotlar.',
      senior: 'Keksa itlar oson hazm bo\'ladigan, kam kaloriyali, bo\'g\'imlarni qo\'llab-quvvatlovchi ratsionga muhtoj.',
    },
  },
  cat: {
    good: ['catGood'],
    bad: ['catBad'],
    ages: {
      puppy: 'Mushuk bolalari (kittens) kuniga 4 marta, maxsus kitten ozuqasi bilan ovqatlantiriladi.',
      adult: 'Kattalar mushuklari kuniga 2 marta ovqatlanadi. Oqsil boy, uglevodlar kam bo\'lgan ozuqa.',
      senior: 'Keksa mushuklarga buyraklarni qo\'llab-quvvatlovchi maxsus ozuqa tavsiya etiladi.',
    },
  },
  rabbit: {
    good: ['rabbitGood'],
    bad: ['rabbitBad'],
    ages: {
      puppy: 'Yosh quyonlarga alfalfa pichani va maxsus yosh quyon granulalari beriladi.',
      adult: 'Kattalar quyonlari asosan pichan, sabzavot va cheklangan granulalar bilan oziqlanadi.',
      senior: 'Keksa quyonlar yumshoq sabzavotlar va yuqori sifatli pichan bilan oziqlanadi.',
    },
  },
  bird: {
    good: ['birdGood'],
    bad: ['birdBad'],
    ages: {
      puppy: 'Yosh qushlarga mayda donlar va yumshoq mevalar oz miqdorda beriladi.',
      adult: 'Kattalar qushlari don aralashmasi, sabzavot va mevalar bilan oziqlanadi.',
      senior: 'Keksa qushlarga oson hazm bo\'ladigan, mayda to\'g\'ralgan ovqatlar beriladi.',
    },
  },
  hamster: {
    good: ['hamsterGood'],
    bad: ['hamsterBad'],
    ages: {
      puppy: 'Yosh hamsterlarga mayda granulalar va yumshoq sabzavotlar beriladi.',
      adult: 'Kattalar hamsterlari granulalar, sabzavot va kam miqdorda meva yeydi.',
      senior: 'Keksa hamsterlar oson chaynaladigan, yumshoq ovqatlarga muhtoj.',
    },
  },
}
