import { NextResponse } from 'next/server';
import { getCustomerOrders, getCustomerById } from '@/lib/db';
import { getCustomerFromRequest } from '@/lib/customer-auth';

export async function GET(request) {
  const session = getCustomerFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
  }

  const customer = await getCustomerById(session.id);
  if (!customer) {
    return NextResponse.json({ success: false, error: 'Customer not found.' }, { status: 404 });
  }

  try {
    // Find orders placed with customer's phone or email
    const ordersByPhone = await getCustomerOrders(customer.phone);
    const ordersByEmail = customer.email ? await getCustomerOrders(customer.email) : [];

    // Deduplicate
    const map = new Map();
    [...ordersByPhone, ...ordersByEmail].forEach(o => map.set(o.orderId, o));
    const orders = Array.from(map.values());

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
