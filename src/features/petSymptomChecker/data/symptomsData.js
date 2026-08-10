/**
 * Muammo (symptom) ma'lumotlari — statik JSON.
 * Keyinchalik bu ma'lumotlar Supabase'dagi `symptoms` jadvalidan olinishi mumkin.
 * Har bir yozuv: species (hayvon turi), symptom (muammo),
 * causes (ehtimoliy sabablar), recommendations (tavsiyalar).
 */
export const symptomsData = {
  dog: [
    {
      symptom: 'ishtahasi yo\'q',
      causes: [
        'Ovqat o\'zgarishi yoki yangi ozuqa',
        'Stomatologik muammolar (tish og\'rig\'i)',
        'Stress yoki muhit o\'zgarishi',
        'Oshqozon-ichak muammolari',
      ],
      recommendations: [
        'Ovqatni iliq va oz miqdorda taklif qiling',
        'O\'zgarish bo\'lsa, yangi ozuqaga asta-sekin o\'ting',
        'Og\'iz bo\'shlig\'ini tekshiring, yallig\'lanish bo\'lsa shifokorga murojaat qiling',
        '1-2 kundan ortiq davom etsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'qusyapti',
      causes: [
        'Tez ovqatlanish yoki ortiqcha ovqatlanish',
        'Zaharlanish (zaharli moddalar yoki o\'simliklar)',
        'Oshqozon begona jism',
        'Yuqumli kasallik',
      ],
      recommendations: [
        'Qisqa muddat och qoldiring (12 soat) va ko\'p suv bering',
        'Zaharli narsa yeganidan shubhalansangiz darhol shifokorga murojaat qiling',
        'Qusish 24 soatdan ortiq davom etsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'terisida qichishish bor',
      causes: [
        'Burgalar yoki parazitlar',
        'Allergiya (ovqat yoki atrof-muhit)',
        'Terining quruqligi',
        'Teri kasalligi (dermatit)',
      ],
      recommendations: [
        'Burgalarga qarshi vositalardan foydalaning',
        'Haftada bir marta maxsus shampun bilan yuving',
        'Oziqaga allergiya bo\'lsa, ratsionni o\'zgartiring',
        'Qizarish va yara paydo bo\'lsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'letargik (harakatsiz)',
      causes: [
        'Jismoniy faollikning kamayishi',
        'Oziqlanish yetishmovchiligi',
        'Og\'riq yoki noqulaylik',
        'Kasallikning boshlang\'ich belgisi',
      ],
      recommendations: [
        'Haroratni o\'lchang (it uchun normal: 37.5-39.2°C)',
        'Suv va ovqat mavjudligini tekshiring',
        'Kuniga 30 daqiqa sayr qilishni ta\'minlang',
        'Holat yomonlashsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'diareya (ich ketishi)',
      causes: [
        'Ovqat o\'zgarishi',
        'Yomon ovqat yoki iflos suv',
        'Parazitlar',
        'Oshqozon-ichak infektsiyasi',
      ],
      recommendations: [
        'Ovqatni to\'xtatib, faqat suv bering (12-24 soat)',
        'Keyin oson hazm bo\'ladigan ovqat (guruch, qaynatilgan tovuq) bering',
        'Qonli ich ketish yoki 24 soatdan ortiq davom etsa, veterinarga murojaat qiling',
      ],
    },
  ],
  cat: [
    {
      symptom: 'ishtahasi yo\'q',
      causes: [
        'Ovqatning yoqmasligi',
        'Stomatologik muammolar',
        'Stress yoki o\'zgarishlar',
        'Oshqozon-ichak muammolari',
      ],
      recommendations: [
        'Issiq, yangi ovqat taklif qiling',
        'Toza suv har doim bo\'lishini ta\'minlang',
        'Agar mushuk 2 kundan ortiq ovqat yemasa — jiddiy muammo, darhol veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'qusyapti',
      causes: [
        'Jun to\'pi (hairball)',
        'Tez ovqatlanish',
        'O\'t oshqozon bezovtaligi',
        'Zaharlanish',
      ],
      recommendations: [
        'Jun to\'plari uchun maxsus pasta bering',
        'Yashil o\'simlik (mushuk o\'ti) taklif qiling',
        'Qusish tez-tez va kuchli bo\'lsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'terisida qichishish bor',
      causes: [
        'Burgalar (mushuklarda juda keng tarqalgan)',
        'Ovqat allergiyasi',
        'Quruq teri',
        'Qo\'ziqorin kasalliklari',
      ],
      recommendations: [
        'Burgalarga qarshi tomchi yoki yoqa qo\'llang',
        'Ovqatni bitta turdagi (monoprotein) bilan sinab ko\'ring',
        'Terida yallig\'lanish bo\'lsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'ich ketishi',
      causes: [
        'Ovqat o\'zgarishi',
        'Parazitlar',
        'Laktoza (sut) intoleransi',
        'Stress',
      ],
      recommendations: [
        'Sut va sut mahsulotlarini bermang',
        'Ovqatni asta-sekin o\'zgartiring',
        'Ich ketishi 48 soatdan ortiq davom etsa, veterinarga murojaat qiling',
      ],
    },
  ],
  rabbit: [
    {
      symptom: 'ovqat yemaydi',
      causes: [
        'Stomatologik muammolar (tish o\'sishi)',
        'Oshqozon-ichak stazisi (GI stasis)',
        'Stress yoki issiq ob-havo',
      ],
      recommendations: [
        'Pichan har doim mavjud bo\'lishini tekshiring',
        'Issiqdan saqlang, salqin joyda tuting',
        '12 soatdan ortiq ovqat yemasa, darhol veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'letargik',
      causes: [
        'Issiqlik urishi',
        'Oziqlanish yetishmovchiligi',
        'Infeksiya',
      ],
      recommendations: [
        'Salqin joyga olib boring, suv bering',
        'Haroratini kuzating',
        'Holati o\'zgarmasa, veterinarga murojaat qiling',
      ],
    },
  ],
  bird: [
    {
      symptom: 'patlari to\'kilyapti',
      causes: [
        'Erish davri (molting)',
        'Stress',
        'Vitamin yetishmovchiligi',
        'Teri parazitlari',
      ],
      recommendations: [
        'Toza va vitaminli ovqat bering',
        'Qafas muhitini tinchlantiring',
        'Haddan tashqari to\'kilish davom etsa, veterinarga murojaat qiling',
      ],
    },
    {
      symptom: 'ishtahasi yo\'q',
      causes: [
        'Ovqat turining o\'zgarishi',
        'Kasallik',
        'Stress',
      ],
      recommendations: [
        'Doimiy ovqat jadvaliga qayting',
        'Toza suv va qafas tozaligini ta\'minlang',
        '48 soat ichida ovqat yemaslik xavfli — veterinarga murojaat qiling',
      ],
    },
  ],
  hamster: [
    {
      symptom: 'qishdan keyin harakatsiz',
      causes: [
        'Qish uyqusi (torpor) holati',
        'Sovuq muhit',
        'Stress',
      ],
      recommendations: [
        'Qafasni issiq va quruq joyga o\'tkazing',
        'Ozgina va tez-tez ovqat bering',
        'Holati qaytmasa, veterinarga murojaat qiling',
      ],
    },
  ],
  fish: [
    {
      symptom: 'yuqoriga suzib qolgan',
      causes: [
        'Suv parametrlari buzilgan (ammiak)',
        'Suv harorati o\'zgarishi',
        'Ovgatlanishdagi xato',
      ],
      recommendations: [
        'Suvni test qiling va o\'zgartiring (30%)',
        'Haroratni bir xil ushlang',
        'Ovqat miqdorini kamaytiring',
      ],
    },
  ],
  turtle: [
    {
      symptom: 'letargik',
      causes: [
        'Harorat yetishmasligi',
        'Noto\'g\'ri ovqatlanish',
        'Vitamin D yetishmovchiligi',
      ],
      recommendations: [
        'UVB chiroq bilan yoritishni ta\'minlang',
        'Suv va muhit haroratini tekshiring',
        'Davom etsa, veterinarga murojaat qiling',
      ],
    },
  ],
}
