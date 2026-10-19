import { NextResponse } from 'next/server';
import { getProductById, updateProduct } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let updates = {};

    if (typeof body.inStock === 'boolean') {
      updates.inStock = body.inStock;
    }

    if (body.price && typeof body.variantIndex === 'number') {
      const variants = [...product.variants];
      if (variants[body.variantIndex]) {
        variants[body.variantIndex].price = Number(body.price);
        updates.variants = variants;
      }
    }

    const updated = await updateProduct(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
