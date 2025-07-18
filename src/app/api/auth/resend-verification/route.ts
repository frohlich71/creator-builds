import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Here you would make the call to resend the verification email
    // For example, making a call to your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'Failed to resend email' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
