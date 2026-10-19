import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
}
