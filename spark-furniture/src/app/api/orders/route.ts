import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    // 1. Authenticate the admin
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch all leads from SQLite
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customer leads' },
      { status: 500 }
    );
  }
}
