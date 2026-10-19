import { NextResponse } from 'next/server';
import { getCustomerById, updateCustomer } from '@/lib/db';
import { getCustomerFromRequest } from '@/lib/customer-auth';

export async function GET(request) {
  const session = getCustomerFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const customer = await getCustomerById(session.id);
  if (!customer) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 404 });
  }

  const { password: _, ...safeCustomer } = customer;
  return NextResponse.json({
    success: true,
    authenticated: true,
    customer: safeCustomer
  });
}

export async function PATCH(request) {
  const session = getCustomerFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await request.json();
    delete updates.password; // Prevent password change via this route
    delete updates.id;

    const updated = await updateCustomer(session.id, updates);
    const { password: _, ...safeCustomer } = updated;

    return NextResponse.json({ success: true, customer: safeCustomer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
