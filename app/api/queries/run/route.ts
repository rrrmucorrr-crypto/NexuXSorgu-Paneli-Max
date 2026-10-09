import { NextRequest, NextResponse } from 'next/server';
import { QUERIES } from '@/lib/catalog';
import { generateSyntheticResult } from '@/lib/mock-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { queryId, inputs, userRole = 'FREE' } = body;

    if (!queryId) {
      return NextResponse.json(
        { success: false, error: 'queryId parametresi zorunludur.' },
        { status: 400 }
      );
    }

    const queryDef = QUERIES.find((q) => q.id === queryId);
    if (!queryDef) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz sorgu kimliği. Katalogda bulunamadı.' },
        { status: 404 }
      );
    }

    // Role check hierarchy
    const roleRank: Record<string, number> = {
      FREE: 1,
      PREMIUM: 2,
      VIP: 3,
      ULTRA: 4,
      YONETICI: 5,
      ADMIN: 6,
    };

    const userLevel = roleRank[userRole] || 1;
    const requiredLevel = roleRank[queryDef.minRole] || 1;

    if (userLevel < requiredLevel) {
      return NextResponse.json(
        {
          success: false,
          error: `Erişim Engellendi: Bu sorgu için en az [${queryDef.minRole}] yetkisi gereklidir. Mevcut yetkiniz: [${userRole}].`,
          requiredRole: queryDef.minRole,
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const result = await generateSyntheticResult(queryDef, inputs || {});

    return NextResponse.json({
      success: true,
      query: {
        id: queryDef.id,
        name: queryDef.name,
        category: queryDef.category,
      },
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Sorgu işlenirken sunucu tarafında sentetik simülasyon hatası oluştu.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
