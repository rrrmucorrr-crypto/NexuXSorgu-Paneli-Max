import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, QUERIES, validateCatalog } from '../../lib/catalog';
import { UserRole } from '../../lib/types';

// Valid categories defined in the project specification (exactly 12 categories)
const EXPECTED_CATEGORY_IDS = [
  'KIMLIK',
  'AILE',
  'ADRES',
  'ILETISIM',
  'SAGLIK',
  'SEYAHAT',
  'FINANS',
  'ARAC',
  'TICARI',
  'EGITIM',
  'YASAL',
  'SISTEM',
] as const;

const VALID_ROLES: UserRole[] = ['FREE', 'PREMIUM', 'VIP', 'ULTRA', 'YONETICI', 'ADMIN'];

test('Query Catalog Verification Suite', async (t) => {
  await t.test('1. Catalog has exactly 101 entries', () => {
    assert.equal(
      QUERIES.length,
      101,
      `Expected exactly 101 queries in the catalog, but found ${QUERIES.length}`
    );
  });

  await t.test('2. All query IDs are unique (no duplicate IDs)', () => {
    const ids = QUERIES.map((q) => q.id);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== 101) {
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      assert.fail(`Found duplicate query IDs: ${JSON.stringify(duplicates)}`);
    }

    assert.equal(uniqueIds.size, 101, 'Every query ID must be unique');
  });

  await t.test('3. No duplicate naming across all query entries', () => {
    const names = QUERIES.map((q) => q.name);
    const uniqueNames = new Set(names);

    if (uniqueNames.size !== 101) {
      const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
      assert.fail(`Found duplicate query names: ${JSON.stringify(duplicates)}`);
    }

    assert.equal(uniqueNames.size, 101, 'Every query name must be unique and non-duplicated');
  });

  await t.test('4. All queries belong to valid categories per project specification', () => {
    assert.equal(
      CATEGORIES.length,
      12,
      `Expected exactly 12 categories, found ${CATEGORIES.length}`
    );

    const validCategorySet = new Set(EXPECTED_CATEGORY_IDS);

    // Verify category definitions
    for (const cat of CATEGORIES) {
      assert.ok(
        validCategorySet.has(cat.id as any),
        `Category ${cat.id} is not in expected category IDs`
      );
      assert.ok(cat.name && cat.name.trim().length > 0, `Category ${cat.id} has empty name`);
      assert.ok(cat.index && cat.index.trim().length > 0, `Category ${cat.id} has empty index`);
      assert.ok(cat.icon && cat.icon.trim().length > 0, `Category ${cat.id} has empty icon`);
    }

    // Verify all queries use one of the 12 valid categories
    const categoryCounts: Record<string, number> = {};
    for (const q of QUERIES) {
      assert.ok(
        validCategorySet.has(q.category as any),
        `Query ${q.id} ("${q.name}") has invalid category: ${q.category}`
      );
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    }

    // Every category must have at least one query
    for (const catId of EXPECTED_CATEGORY_IDS) {
      assert.ok(
        (categoryCounts[catId] || 0) > 0,
        `Category ${catId} does not have any queries mapped to it`
      );
    }
  });

  await t.test('5. Each query definition has all required structural properties', () => {
    for (const q of QUERIES) {
      assert.ok(q.id && q.id.startsWith('q-'), `Query ID must start with 'q-': ${q.id}`);
      assert.ok(q.name && q.name.trim().length > 0, `Query ${q.id} must have a name`);
      assert.ok(
        q.description && q.description.trim().length > 0,
        `Query ${q.id} must have a description`
      );
      assert.ok(
        VALID_ROLES.includes(q.minRole),
        `Query ${q.id} has invalid minRole: ${q.minRole}`
      );
      assert.ok(
        Array.isArray(q.fields) && q.fields.length > 0,
        `Query ${q.id} must have at least one input field`
      );
      assert.ok(
        q.layoutType && q.layoutType.trim().length > 0,
        `Query ${q.id} must specify layoutType`
      );

      // Verify fields structure
      for (const f of q.fields) {
        assert.ok(f.name && f.name.length > 0, `Field in query ${q.id} missing name`);
        assert.ok(f.label && f.label.length > 0, `Field in query ${q.id} missing label`);
        assert.ok(
          ['text', 'number', 'select', 'date'].includes(f.type),
          `Field ${f.name} in query ${q.id} has invalid type: ${f.type}`
        );
      }
    }
  });

  await t.test('6. Built-in validateCatalog() function passes validation', () => {
    const report = validateCatalog();
    assert.equal(report.isValid, true, 'validateCatalog() returned isValid: false');
    assert.equal(report.queryCount, 101, 'validateCatalog() report queryCount is not 101');
    assert.equal(report.categoryCount, 12, 'validateCatalog() report categoryCount is not 12');
    assert.equal(report.duplicateNames.length, 0, 'validateCatalog() detected duplicate names');
    assert.equal(report.duplicateIds.length, 0, 'validateCatalog() detected duplicate IDs');
  });
});
