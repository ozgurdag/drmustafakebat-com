import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, phone, dateTime, service, message } = data

    // Turhost SMTP settings from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.drmustafakebat.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `Yüz Yüze Görüşme Talebi - ${service}`,
      text: `
Siteden yeni bir yüz yüze görüşme talebi aldınız.

Hizmet: ${service}
Ad Soyad: ${name}
E-posta: ${email}
Telefon: ${phone}
Tercih Edilen Zaman: ${dateTime || 'Belirtilmedi'}

Mesaj:
${message || 'Belirtilmedi'}
      `,
    }

    await transporter.sendMail(mailOptions)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Mail gönderilemedi.' }, { status: 500 })
  }
}
