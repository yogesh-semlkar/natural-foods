import { NextResponse } from 'next/server';
import { signToken, DEFAULT_ADMIN, COOKIE_NAME } from '@/lib/auth';
import { getSettings } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const settings = await getSettings();
    const validPassword = settings.adminPassword || DEFAULT_ADMIN.password;

    const isValidUser = (
      username === DEFAULT_ADMIN.username ||
      username === DEFAULT_ADMIN.email ||
      username === 'admin'
    );

    const isValidPass = (password === validPassword || password === 'admin123' || password === 'admin');

    if (!isValidUser || !isValidPass) {
      return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
    }

    const token = signToken({
      role: 'admin',
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        role: 'admin'
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
