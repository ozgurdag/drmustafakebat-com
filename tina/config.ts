import { defineConfig } from 'tinacms'

const commonFields = [
  { type: 'string' as const, name: 'title', label: 'Başlık', required: true, isTitle: true },
  { type: 'datetime' as const, name: 'date', label: 'Tarih' },
  { type: 'string' as const, name: 'excerpt', label: 'Özet', ui: { component: 'textarea' } },
  { type: 'image' as const, name: 'image', label: 'Kapak Görseli' },
  { type: 'string' as const, name: 'altBaslik2', label: 'Alt Başlık 2' },
  { type: 'rich-text' as const, name: 'body', label: 'İçerik', isBody: true },
]

export default defineConfig({
  branch: process.env.GITHUB_BRANCH ?? process.env.HEAD ?? 'main',
  clientId: process.env.TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'longevity',
        label: 'Longevity Makaleleri',
        path: 'content/articles/longevity',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: ['Doğal Antiaging', 'Yaşlılık & Kronik Hast.', 'Antioksidanlar'],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'beslenme',
        label: 'Beslenme & Metabolizma Makaleleri',
        path: 'content/articles/beslenme',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'Kan Tahlilleri & Biyokimya',
              'Vitaminler & Mineraller',
              'Beslenme & Diyet',
              'Sindirim Sistemi',
              'Diyabet & İnsülin Direnci',
              'İlaçlar & Farmakoloji',
            ],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'saglik',
        label: 'Genel Sağlık Makaleleri',
        path: 'content/articles/saglik',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'Genel Sağlık',
              'Kardiyovasküler',
              'Enfeksiyon & Bağışıklık',
              'Kozmetik Dermatoloji',
              'Solunum Sistemi',
              'Kanser & Onkoloji',
              'Tiroid Hastalıkları',
              'Hormonlar & Endokrin',
            ],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'neuroperformance',
        label: 'NeuroPerformance Makaleleri',
        path: 'content/articles/neuroperformance',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'Egzersiz & Fiziksel Aktivite',
              'Psikoloji & Ruh Sağlığı',
              'Uyku & Biyolojik Ritim',
              'Uyku & Vardiyalı Çalışma',
              'Nöroloji & Beyin',
              'Tükenmişlik & Stres',
              'Fiziksel Performans',
              'Nöroergonomi',
              'Bilişsel Performans',
            ],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'isg',
        label: 'İş Sağlığı & Güvenliği Makaleleri',
        path: 'content/articles/isg',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'İSG & Güvenlik',
              'Ekipman & Makine Güvenliği',
              'İş Kazaları',
              'Fiziksel Riskler & Ergonomi',
              'Risk & KKD',
              'Kurumsal Sağlık',
            ],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'acil',
        label: 'Acil & İlk Yardım Makaleleri',
        path: 'content/articles/acil',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: ['Acil Durum & İlk Yardım', 'Yangın Güvenliği'],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'mevzuat',
        label: 'Mevzuat & Eğitim Makaleleri',
        path: 'content/articles/mevzuat',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: ['Mevzuat & Yaptırımlar', 'Eğitim & Sertifikasyon'],
          },
          ...commonFields.slice(1),
        ],
      },
      {
        name: 'kimyasal',
        label: 'Kimyasal & Çevre Makaleleri',
        path: 'content/articles/kimyasal',
        format: 'mdx',
        fields: [
          ...commonFields.slice(0, 1),
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: ['Kimyasal & Toksikoloji'],
          },
          ...commonFields.slice(1),
        ],
      },
    ],
  },
})
