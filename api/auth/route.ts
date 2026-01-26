// app/api/auth/verify/route.ts
import { getCurrentUser } from '@api/actions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: result.user,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}