import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  // Protect orders query with Admin auth
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin login required.' }, { status: 401 });
  }

  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, totals, paymentMethod } = body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.pincode) {
      return NextResponse.json({
        success: false,
        error: 'Incomplete customer details (Name, Phone, Address, Pincode required).'
      }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Order must contain at least one item.'
      }, { status: 400 });
    }

    const order = await createOrder({
      customer,
      items,
      totals,
      paymentMethod: paymentMethod || 'Instant UPI'
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
