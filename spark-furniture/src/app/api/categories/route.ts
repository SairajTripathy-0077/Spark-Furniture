import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

// Helper to verify admin authentication
async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  if (!sessionCookie) return false;
  const decrypted = decrypt(sessionCookie);
  if (!decrypted) return false;
  try {
    const data = JSON.parse(decrypted);
    const expires = new Date(data.expires);
    if (expires < new Date()) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { name } = await request.json();
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    const trimmedName = name.trim();
    
    // Check if category already exists
    const existing = await prisma.category.findUnique({
      where: { name: trimmedName },
    });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }
    
    const category = await prisma.category.create({
      data: { name: trimmedName },
    });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    // Find category to get its name
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if any products use this category (case-insensitive or exact check depending on DB storage)
    const productCount = await prisma.product.count({
      where: { category: category.name },
    });
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category "${category.name}". ${productCount} product(s) are still assigned to this category.` 
      }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
