import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// Helper to check if request is from authenticated admin
async function isAuthenticated() {
  const session = await getSession();
  return session && session.admin;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Format product colors back to array of objects
    const formatted = products.map((p) => {
      let colorsParsed = [];
      try {
        colorsParsed = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
      } catch (e) {
        console.error(`Failed to parse colors for product ${p.id}:`, e);
      }
      return {
        ...p,
        colors: colorsParsed
      };
    });
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, price, originalPrice, category, description, colors, imageType, imageUrl, badge } = body;
    
    if (!name || price === undefined || !category || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        description,
        colors: Array.isArray(colors) ? JSON.stringify(colors) : JSON.stringify([]),
        imageType: imageType || 'chair',
        imageUrl: imageUrl || null,
        badge: badge || null,
        rating: 4.8, // default rating for new products
        reviewsCount: Math.floor(Math.random() * 20) + 1, // seed reviews count
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, name, price, originalPrice, category, description, colors, imageType, imageUrl, badge } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: price ? parseFloat(price) : undefined,
        originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
        category,
        description,
        colors: colors ? (Array.isArray(colors) ? JSON.stringify(colors) : colors) : undefined,
        imageType,
        imageUrl,
        badge,
      }
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
