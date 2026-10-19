import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await getSettings();
    // Do not leak admin password in public response
    const { adminPassword, ...safeSettings } = settings;
    return NextResponse.json({ success: true, data: safeSettings });
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
    const updated = await updateSettings(body);
    const { adminPassword, ...safeSettings } = updated;
    return NextResponse.json({ success: true, data: safeSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
