/**
 * Penalty Calculation Utility
 * 
 * Rules:
 * 1. Standard borrowing period: 7 days from checkout date.
 * 2. Overdue Penalties:
 *    - $1/day for the first 3 days overdue (days 1..3).
 *    - $2/day for every day after that (days 4+).
 *    - Capped at maximum $15 per book.
 * 3. Status Classifications:
 *    - Red ("OVERDUE"): overdue by 1 or more days.
 *    - Yellow ("DUE_TOMORROW"): due date is exactly tomorrow (1 day remaining).
 *    - Green ("SAFE"): not due yet (2+ days remaining or due today).
 */

const STANDARD_BORROW_DAYS = 7;
const MAX_PENALTY = 15;

/**
 * Format a Date object to YYYY-MM-DD string in local/UTC normalized format
 */
function formatDate(dateObj) {
  const d = new Date(dateObj);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate due date given a checkout date (YYYY-MM-DD or Date object)
 */
function calculateDueDate(checkoutDateStr) {
  const checkoutDate = new Date(checkoutDateStr);
  const dueDate = new Date(checkoutDate.getTime() + STANDARD_BORROW_DAYS * 24 * 60 * 60 * 1000);
  return formatDate(dueDate);
}

/**
 * Calculate penalty and status for a book
 * 
 * @param {string} checkoutDateStr - YYYY-MM-DD
 * @param {string|Date} [referenceDate] - YYYY-MM-DD or Date object for evaluation (defaults to today)
 */
function calculateBookPenalty(checkoutDateStr, referenceDate = new Date()) {
  // Normalize dates to midnight UTC to prevent time zone offset errors
  const refDateObj = new Date(referenceDate);
  const refMs = Date.UTC(refDateObj.getFullYear(), refDateObj.getMonth(), refDateObj.getDate());

  const checkoutDateObj = new Date(checkoutDateStr);
  const checkoutMs = Date.UTC(checkoutDateObj.getFullYear(), checkoutDateObj.getMonth(), checkoutDateObj.getDate());

  const dueMs = checkoutMs + (STANDARD_BORROW_DAYS * 24 * 60 * 60 * 1000);
  const dueDateStr = formatDate(new Date(dueMs));

  // Difference in whole calendar days (refMs - dueMs)
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor((refMs - dueMs) / msPerDay);
  const daysRemaining = Math.floor((dueMs - refMs) / msPerDay);

  let status = 'SAFE'; // SAFE | DUE_TOMORROW | OVERDUE
  let badgeColor = 'green'; // green | yellow | red
  let daysOverdue = 0;
  let tier1Fee = 0; // Days 1..3 @ $1/day
  let tier2Fee = 0; // Days 4+ @ $2/day
  let rawPenalty = 0;
  let finalPenalty = 0;
  let isCapped = false;

  if (daysDiff > 0) {
    // Overdue
    status = 'OVERDUE';
    badgeColor = 'red';
    daysOverdue = daysDiff;

    const tier1Days = Math.min(daysOverdue, 3);
    const tier2Days = Math.max(0, daysOverdue - 3);

    tier1Fee = tier1Days * 1;
    tier2Fee = tier2Days * 2;
    rawPenalty = tier1Fee + tier2Fee;
    
    if (rawPenalty >= MAX_PENALTY) {
      finalPenalty = MAX_PENALTY;
      isCapped = true;
    } else {
      finalPenalty = rawPenalty;
    }
  } else if (daysRemaining === 1) {
    // Due tomorrow
    status = 'DUE_TOMORROW';
    badgeColor = 'yellow';
  } else {
    // Safe (not due yet or due today)
    status = 'SAFE';
    badgeColor = 'green';
  }

  return {
    checkoutDate: formatDate(checkoutDateObj),
    dueDate: dueDateStr,
    evaluationDate: formatDate(new Date(refMs)),
    status,
    badgeColor,
    daysOverdue,
    daysRemaining: daysRemaining >= 0 ? daysRemaining : 0,
    penalty: finalPenalty,
    breakdown: {
      tier1Days: daysOverdue > 0 ? Math.min(daysOverdue, 3) : 0,
      tier1Fee,
      tier2Days: daysOverdue > 3 ? daysOverdue - 3 : 0,
      tier2Fee,
      rawPenalty,
      maxCap: MAX_PENALTY,
      isCapped
    }
  };
}

module.exports = {
  STANDARD_BORROW_DAYS,
  MAX_PENALTY,
  formatDate,
  calculateDueDate,
  calculateBookPenalty
};
