/**
 * Calculates borrowing status, due date, days overdue, and late fees for a book.
 * 
 * Rules:
 * - Borrowing period: 7 days
 * - Days 1 to 3 overdue: $1 per day
 * - Days 4+ overdue: $2 per day
 * - Maximum penalty cap: $15
 * 
 * @param {string|Date} checkoutDateInput - The checkout date of the book
 * @param {Date} [currentDate=new Date()] - Optional parameter to inject reference date (useful for testing)
 * @returns {Object} { dueDate, daysOverdue, penalty, status }
 */
function calculatePenaltyAndStatus(checkoutDateInput, currentDate = new Date()) {
  const BORROW_PERIOD_DAYS = 7;
  const TIER1_RATE = 1;   // $1/day for days 1-3 overdue
  const TIER2_RATE = 2;   // $2/day for days 4+ overdue
  const MAX_PENALTY = 15;  // $15 cap per book

  // Normalize checkout date
  const checkoutDate = new Date(checkoutDateInput);
  
  // Calculate Due Date (Checkout Date + 7 Days)
  const dueDate = new Date(checkoutDate);
  dueDate.setDate(dueDate.getDate() + BORROW_PERIOD_DAYS);

  // Normalize dates to midnight to ignore time differences
  const todayNormalized = new Date(currentDate);
  todayNormalized.setHours(0, 0, 0, 0);

  const dueDateNormalized = new Date(dueDate);
  dueDateNormalized.setHours(0, 0, 0, 0);

  // Calculate difference in calendar days
  const diffInMs = todayNormalized.getTime() - dueDateNormalized.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  let status = 'SAFE';
  let daysOverdue = 0;
  let penalty = 0;

  if (diffInDays > 0) {
    // Book is Overdue
    status = 'OVERDUE';
    daysOverdue = diffInDays;

    if (daysOverdue <= 3) {
      penalty = daysOverdue * TIER1_RATE;
    } else {
      penalty = (3 * TIER1_RATE) + ((daysOverdue - 3) * TIER2_RATE);
    }

    // Apply penalty cap
    penalty = Math.min(penalty, MAX_PENALTY);

  } else if (diffInDays === -1) {
    // Exactly 1 day before due date -> Due Tomorrow
    status = 'DUE_TOMORROW';
  } else {
    // Due today or in the future -> Safe
    status = 'SAFE';
  }

  // Format due date as YYYY-MM-DD for clean JSON output
  const formattedDueDate = dueDate.toISOString().split('T')[0];

  return {
    dueDate: formattedDueDate,
    daysOverdue,
    penalty,
    status
  };
}

module.exports = { calculatePenaltyAndStatus };
