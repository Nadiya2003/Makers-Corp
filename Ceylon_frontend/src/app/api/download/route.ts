import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    
    // Extract filename from URL or use a default
    const filename = url.split('/').pop() || 'downloaded-image.jpg';

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');

    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
  }
}
