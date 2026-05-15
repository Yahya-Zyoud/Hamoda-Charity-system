const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function submitDonation(donationData) {
  const response = await fetch(`${BASE_URL}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || 'فشل الاتصال بالخادم');
    error.errors = result.errors || {};
    throw error;
  }

  return result;
}

export async function fetchRecentDonations() {
  const response = await fetch(`${BASE_URL}/donations/recent`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'تعذّر تحميل أحدث التبرعات');
  }

  return result.data || [];
}

export async function fetchDonationStats() {
  const response = await fetch(`${BASE_URL}/donations/stats`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'تعذّر تحميل إحصائيات التبرعات');
  }

  return result.data || {
    totalAmount: 0,
    totalDonors: 0,
    totalAmountFormatted: '$0',
  };
}