const assert = require('assert');
const { calculateBookPenalty } = require('../utils/penalty');

console.log('🧪 Running Server Penalty Logic Unit Tests...\n');

const refDate = '2026-08-20';

const testCases = [
  {
    name: 'Safe Book (Checked out 2 days ago -> Due in 5 days)',
    checkoutDate: '2026-08-18',
    expectedStatus: 'SAFE',
    expectedBadge: 'green',
    expectedOverdue: 0,
    expectedPenalty: 0
  },
  {
    name: 'Due Tomorrow Book (Checked out 6 days ago -> Due 2026-08-21)',
    checkoutDate: '2026-08-14',
    expectedStatus: 'DUE_TOMORROW',
    expectedBadge: 'yellow',
    expectedOverdue: 0,
    expectedPenalty: 0
  },
  {
    name: 'Overdue 1 Day ($1 penalty)',
    checkoutDate: '2026-08-12', // Due Aug 19, ref Aug 20 -> 1 day overdue
    expectedStatus: 'OVERDUE',
    expectedBadge: 'red',
    expectedOverdue: 1,
    expectedPenalty: 1
  },
  {
    name: 'Overdue 3 Days ($3 penalty - full tier 1)',
    checkoutDate: '2026-08-10', // Due Aug 17, ref Aug 20 -> 3 days overdue
    expectedStatus: 'OVERDUE',
    expectedBadge: 'red',
    expectedOverdue: 3,
    expectedPenalty: 3
  },
  {
    name: 'Overdue 4 Days ($5 penalty - $3 tier1 + $2 tier2)',
    checkoutDate: '2026-08-09', // Due Aug 16, ref Aug 20 -> 4 days overdue
    expectedStatus: 'OVERDUE',
    expectedBadge: 'red',
    expectedOverdue: 4,
    expectedPenalty: 5
  },
  {
    name: 'Overdue 8 Days ($13 penalty - $3 tier1 + $10 tier2)',
    checkoutDate: '2026-08-05', // Due Aug 12, ref Aug 20 -> 8 days overdue
    expectedStatus: 'OVERDUE',
    expectedBadge: 'red',
    expectedOverdue: 8,
    expectedPenalty: 13
  },
  {
    name: 'Overdue 20 Days ($15 penalty - Max Penalty Cap reached)',
    checkoutDate: '2026-07-24', // Due Jul 31, ref Aug 20 -> 20 days overdue
    expectedStatus: 'OVERDUE',
    expectedBadge: 'red',
    expectedOverdue: 20,
    expectedPenalty: 15
  }
];

let passed = 0;
let failed = 0;

testCases.forEach((tc, idx) => {
  try {
    const result = calculateBookPenalty(tc.checkoutDate, refDate);
    assert.strictEqual(result.status, tc.expectedStatus, `Status mismatch for test "${tc.name}"`);
    assert.strictEqual(result.badgeColor, tc.expectedBadge, `Badge color mismatch for test "${tc.name}"`);
    assert.strictEqual(result.daysOverdue, tc.expectedOverdue, `Days overdue mismatch for test "${tc.name}"`);
    assert.strictEqual(result.penalty, tc.expectedPenalty, `Penalty mismatch for test "${tc.name}"`);
    
    console.log(`✅ [PASS] Test ${idx + 1}: ${tc.name}`);
    console.log(`   Checkout: ${tc.checkoutDate} | Due: ${result.dueDate} | Days Overdue: ${result.daysOverdue} | Penalty: $${result.penalty}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] Test ${idx + 1}: ${tc.name}`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
});

console.log(`\nResults: ${passed} Passed, ${failed} Failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All penalty calculation tests passed successfully! 🎉');
}
