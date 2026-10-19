import { NextResponse } from 'next/server';
import { createCustomer, getCustomerByPhoneOrEmail } from '@/lib/db';
import { signCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/customer-auth';

export async function POST(request) {
  try {
    const { name, phone, email, password, address, city, state, pincode } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, Phone number, and Password are required.'
      }, { status: 400 });
    }

    // Check existing
    const existing = await getCustomerByPhoneOrEmail(phone) || (email && await getCustomerByPhoneOrEmail(email));
    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'An account with this phone or email already exists. Please Sign In.'
      }, { status: 409 });
    }

    const savedAddresses = address ? [{
      id: `addr-${Date.now()}`,
      label: 'Home',
      address,
      city: city || 'Local',
      state: state || 'India',
      pincode: pincode || '110001'
    }] : [];

    const newCust = await createCustomer({
      name,
      phone,
      email: email || '',
      password, // In real deployment, bcrypt is used
      savedAddresses
    });

    const token = signCustomerToken({
      id: newCust.id,
      name: newCust.name,
      phone: newCust.phone,
      email: newCust.email
    });

    const { password: _, ...safeCustomer } = newCust;
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      customer: safeCustomer
    }, { status: 201 });

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
