import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (role !== 'TUTOR') {
      return NextResponse.json({ error: 'Invalid role requested' }, { status: 400 });
    }

    // Update user to Tutor if they aren't already
    const [updatedCount] = await User.update(
      { 
        role: 'TUTOR',
        // If they switch to tutor via Google Auth, they must still await admin approval
        isApproved: false 
      },
      { where: { email: session.user.email } }
    );
    
    if (updatedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const user = await User.findOne({ where: { email: session.user.email }});
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: { role: user.role, isApproved: user.isApproved } });
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
