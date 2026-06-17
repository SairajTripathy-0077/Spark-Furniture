import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, totalAmount, items } = body;

    if (!customerName || !customerPhone || !items || totalAmount === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required checkout fields (Name, Phone, Items, Total).' },
        { status: 400 }
      );
    }

    // Save order in SQLite database
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        totalAmount: parseFloat(totalAmount),
        items: typeof items === 'string' ? items : JSON.stringify(items),
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      orderId: order.id
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process checkout API' },
      { status: 500 }
    );
  }
}
