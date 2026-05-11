import { defineConfig } from 'tinacms'

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
          { type: 'string', name: 'title', label: 'Başlık', required: true, isTitle: true },
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'Vitaminler & Mineraller',
              'Bitkisel Tıp',
              'Beslenme & Diyet',
              'Genel Sağlık',
              'Doğal Antiaging',
              'Kozmetik Dermatoloji',
              'Enfeksiyon & Bağışıklık',
            ],
          },
          { type: 'string', name: 'altBaslik2', label: 'Alt Başlık 2' },
          { type: 'datetime', name: 'date', label: 'Tarih' },
          { type: 'string', name: 'excerpt', label: 'Özet', ui: { component: 'textarea' } },
          { type: 'image', name: 'image', label: 'Kapak Görseli' },
          { type: 'rich-text', name: 'body', label: 'İçerik', isBody: true },
        ],
      },
      {
        name: 'systems',
        label: 'Corporate Bio-Integrity Makaleleri',
        path: 'content/articles/systems',
        format: 'mdx',
        fields: [
          { type: 'string', name: 'title', label: 'Başlık', required: true, isTitle: true },
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'Ekipman & Makine Güvenliği',
              'Mevzuat & Yaptırımlar',
              'Uyku & Vardiyalı Çalışma',
              'Genel İSG',
            ],
          },
          { type: 'string', name: 'altBaslik2', label: 'Alt Başlık 2' },
          { type: 'datetime', name: 'date', label: 'Tarih' },
          { type: 'string', name: 'excerpt', label: 'Özet', ui: { component: 'textarea' } },
          { type: 'image', name: 'image', label: 'Kapak Görseli' },
          { type: 'rich-text', name: 'body', label: 'İçerik', isBody: true },
        ],
      },
      {
        name: 'neuroperformance',
        label: 'NeuroPerformance Makaleleri',
        path: 'content/articles/neuroperformance',
        format: 'mdx',
        fields: [
          { type: 'string', name: 'title', label: 'Başlık', required: true, isTitle: true },
          {
            type: 'string',
            name: 'altBaslik1',
            label: 'Alt Başlık',
            options: [
              'Nöroergonomi',
              'Propriyosepsiyon',
              'Bilişsel Performans',
              'Uyku & Vardiyalı Çalışma',
              'Hareket & Postür',
            ],
          },
          { type: 'string', name: 'altBaslik2', label: 'Alt Başlık 2' },
          { type: 'datetime', name: 'date', label: 'Tarih' },
          { type: 'string', name: 'excerpt', label: 'Özet', ui: { component: 'textarea' } },
          { type: 'image', name: 'image', label: 'Kapak Görseli' },
          { type: 'rich-text', name: 'body', label: 'İçerik', isBody: true },
        ],
      },
    ],
  },
})
