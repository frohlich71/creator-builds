import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Here you would make the real verification with your backend
    // For example, making a call to your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'Verification failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
