// app/api/vcard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const profileDoc = await getDoc(doc(db, 'profiles', userId));
    
    if (!profileDoc.exists()) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profileDoc.data();

    // Generate vCard content
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName || ''}
${profile.designation ? `TITLE:${profile.designation}` : ''}
${profile.company ? `ORG:${profile.company}` : ''}
${profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : ''}
${profile.email ? `EMAIL:${profile.email}` : ''}
${profile.website ? `URL:${profile.website}` : ''}
${profile.bio ? `NOTE:${profile.bio}` : ''}
${profile.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}` : ''}
${profile.twitter ? `X-SOCIALPROFILE;TYPE=twitter:${profile.twitter}` : ''}
${profile.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${profile.instagram}` : ''}
${profile.facebook ? `X-SOCIALPROFILE;TYPE=facebook:${profile.facebook}` : ''}
END:VCARD`;

    // Return vCard file
    return new NextResponse(vCard, {
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename="${profile.slug || 'contact'}.vcf"`,
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json({ error: 'Failed to generate vCard' }, { status: 500 });
  }
}