import { NextResponse } from 'next/server';
import { getCustomerByPhoneOrEmail } from '@/lib/db';
import { signCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/customer-auth';

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({
        success: false,
        error: 'Phone/Email and Password are required.'
      }, { status: 400 });
    }

    const customer = await getCustomerByPhoneOrEmail(identifier);
    if (!customer || customer.password !== password) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials. Please check your phone/email and password.'
      }, { status: 401 });
    }

    const token = signCustomerToken({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    });

    const { password: _, ...safeCustomer } = customer;
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      customer: safeCustomer
    });

    response.cookies.set({
      name: CUSTOMER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
