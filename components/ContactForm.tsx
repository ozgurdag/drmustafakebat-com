'use client'

import { useState } from 'react'

const TOPICS = [
  { value: 'longevity', label: 'Longevity' },
  { value: 'systems', label: 'Systems (İSG)' },
  { value: 'neuroperformance', label: 'NeuroPerformance' },
  { value: 'genel', label: 'Genel' },
]

interface FormState {
  name: string
  email: string
  topic: string
  message: string
}

const INITIAL: FormState = { name: '', email: '', topic: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputBase =
    'w-full rounded-lg border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-white focus:ring-2 focus:ring-gold focus:outline-none transition'

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]">
        <span className="text-5xl">✅</span>
        <p className="font-serif text-2xl text-navy">Mesajınız Alındı</p>
        <p className="font-sans text-navy/70 text-sm max-w-sm leading-relaxed">
          En kısa sürede geri dönüş yapacağım.
        </p>
        <button
          onClick={() => { setForm(INITIAL); setSubmitted(false) }}
          className="mt-4 text-xs font-sans text-navy/50 underline underline-offset-2 hover:text-gold transition-colors"
        >
          Yeni mesaj gönder
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-8 md:p-10 space-y-6"
    >
      <h2 className="font-serif text-2xl text-navy">Mesaj Gönderin</h2>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Adınız Soyadınız"
          className={inputBase}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="ornek@eposta.com"
          className={inputBase}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="topic" className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">
          Konu
        </label>
        <select
          id="topic"
          name="topic"
          required
          value={form.topic}
          onChange={handleChange}
          className={inputBase}
        >
          <option value="" disabled>Konu seçin...</option>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="message" className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">
          Mesaj
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Mesajınızı buraya yazın..."
          className={`${inputBase} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-navy text-white font-sans font-semibold text-sm py-3 rounded-lg hover:bg-navy/80 transition-colors"
      >
        Gönder
      </button>
    </form>
  )
}
