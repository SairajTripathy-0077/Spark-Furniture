import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/lib/session';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate the admin
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    // 3. Check if Cloudinary credentials are default/placeholder values
    const isCloudinaryDemo = 
      !process.env.CLOUDINARY_CLOUD_NAME || 
      process.env.CLOUDINARY_CLOUD_NAME === 'demo' || 
      process.env.CLOUDINARY_API_KEY === '1234567890';

    if (isCloudinaryDemo) {
      console.warn('Cloudinary not fully configured, returning high-quality placeholder image.');
      // Random premium furniture image from Unsplash for testing
      const mockImages = [
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800'
      ];
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      return NextResponse.json({
        success: true,
        url: randomImage,
        message: 'Cloudinary not configured. Fallback placeholder returned.'
      });
    }

    // 4. Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Upload to Cloudinary via stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'spark_furniture',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to upload image' 
      },
      { status: 500 }
    );
  }
}
