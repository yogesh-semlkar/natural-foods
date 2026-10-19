import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin login required.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.variants || body.variants.length === 0) {
      return NextResponse.json({ success: false, error: 'Product name and variants are required.' }, { status: 400 });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      badge: 'Fresh Sourced',
      badgeType: 'badge-organic',
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      ...body
    };

    const saved = await saveProduct(newProduct);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
