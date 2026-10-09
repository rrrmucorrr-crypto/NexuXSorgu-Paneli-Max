import { NextResponse } from 'next/server';
import { CATEGORIES, QUERIES, validateCatalog } from '@/lib/catalog';

export async function GET() {
  const validation = validateCatalog();
  return NextResponse.json({
    success: true,
    brand: 'NexuXTanrı 𖤟 SorguPaneli',
    categories: CATEGORIES,
    queries: QUERIES,
    summary: {
      totalCategories: CATEGORIES.length,
      totalQueries: QUERIES.length,
      isCatalogValid: validation.isValid,
      duplicateNames: validation.duplicateNames,
    },
    meta: {
      mode: 'DEMO',
      synthetic: true,
      timestamp: new Date().toISOString(),
    },
  });
}
