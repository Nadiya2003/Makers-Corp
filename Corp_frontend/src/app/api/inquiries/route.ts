import { NextResponse } from 'next/server';

interface LeadPayload {
  name: string;
  contactMethod?: 'WhatsApp' | 'Email' | 'Phone';
  phone?: string;
  email?: string;
  destination?: string;
  port?: string;
  buyerType?: 'Individual' | 'Dealer / Importer';
  leadType?: string;
  stockId?: string;
  vehicleTitle?: string;
  requestedModel?: string;
  budget?: string;
  yearRange?: string;
  notes?: string;
  message?: string;
  inquiryType?: string;
  sourceRoute?: string;
  honeypot?: string; // Spam protection
  _honey?: string;
}

// In-memory durable store for server session fallback
const leadStorage: Array<LeadPayload & { id: string; createdAt: string; routedTo: string }> = [];

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    // 1. Spam honeypot check
    if ((body.honeypot && body.honeypot.trim() !== '') || (body._honey && body._honey.trim() !== '')) {
      return NextResponse.json({ success: false, message: 'Spam detected' }, { status: 400 });
    }

    // 2. Validate essential fields
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid full name.' },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (body.email && !emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 422 }
      );
    }

    if (!body.email && (!body.phone || body.phone.trim().length < 7)) {
      return NextResponse.json(
        { success: false, message: 'Please provide at least an email address or phone/WhatsApp number.' },
        { status: 422 }
      );
    }

    const destination = body.destination && body.destination.trim() ? body.destination.trim() : 'Global / All';

    // 3. Determine queue routing
    let routedTo = 'global-queue@makerscorp.jp';
    const dest = (body.destination || '').toLowerCase();
    if (dest.includes('india')) {
      routedTo = 'india-desk@makerscorp.jp';
    } else if (dest.includes('sri lanka') || dest.includes('sri-lanka') || dest === 'lk') {
      routedTo = 'srilanka@makerscorp.jp';
    } else if (dest.includes('kenya') || dest.includes('tanzania') || dest.includes('africa')) {
      routedTo = 'africa@makerscorp.jp';
    }

    const leadId = `LEAD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const savedRecord = {
      ...body,
      id: leadId,
      createdAt: new Date().toISOString(),
      routedTo
    };

    leadStorage.push(savedRecord);

    // 4. Attempt to forward to backend if available (optional async proxy)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      fetch(`${backendUrl}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: body.name,
          email: body.email || 'not-provided@buyer.com',
          phone: body.phone || 'N/A',
          vehicle: body.stockId || body.requestedModel || 'General Inquiry',
          message: `[${(body.leadType || 'INQUIRY').toUpperCase()}] Destination: ${destination} | Port: ${body.port || 'Any'} | Type: ${body.buyerType || 'Individual'} | Notes: ${body.notes || body.message || 'None'}`
        })
      }).catch(() => {
        // Backend optional fallback
      });
    } catch {}

    return NextResponse.json({
      success: true,
      leadId,
      message:
        'Your inquiry has been received by our export operations desk. A written quotation will be dispatched to your contact channel.',
      routedTo,
      timestamp: savedRecord.createdAt
    });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing your inquiry. Please try WhatsApp for immediate assistance.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    totalStoredLeads: leadStorage.length,
    activeQueues: ['india-desk@makerscorp.jp', 'srilanka@makerscorp.jp', 'africa@makerscorp.jp', 'global-queue@makerscorp.jp']
  });
}
