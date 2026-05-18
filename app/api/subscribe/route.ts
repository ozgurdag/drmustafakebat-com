import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçersiz e-posta adresi.' }, { status: 400 })
    }

    const apiKey = process.env.MAILERLITE_API_KEY
    if (!apiKey) {
      console.error('MAILERLITE_API_KEY is not defined in environment variables')
      return NextResponse.json({ error: 'Sistem yapılandırma hatası. Lütfen daha sonra tekrar deneyin.' }, { status: 500 })
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        status: 'active'
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('MailerLite subscription error:', data)
      return NextResponse.json(
        { error: data.message || 'Abonelik işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin.' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Subscribe API error:', error)
    return NextResponse.json({ error: 'Sunucu tarafında bir hata oluştu.' }, { status: 500 })
  }
}
