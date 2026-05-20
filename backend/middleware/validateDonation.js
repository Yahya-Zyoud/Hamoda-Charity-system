const VALID_TYPES    = ['sadaqah', 'zakat', 'relief', 'housing', 'medical', 'education'];
const VALID_PAYMENTS = ['stripe', 'paypal', 'cash'];

function validateDonation(req, res, next) {
  const { donationType, amount, donorName, donorEmail, donorPhone, paymentMethod } = req.body;
  const errors = {};

  if (!donationType) {
    errors.donationType = 'Donation type is required';
  } else if (!VALID_TYPES.includes(donationType)) {
    errors.donationType = 'Invalid donation type';
  }

  const numAmount = Number(amount);
  if (!amount && amount !== 0) {
    errors.amount = 'Amount is required';
  } else if (isNaN(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a positive number';
  }

  if (!donorName || String(donorName).trim() === '') {
    errors.donorName = 'Donor name is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!donorEmail || String(donorEmail).trim() === '') {
    errors.donorEmail = 'Email is required';
  } else if (!emailRegex.test(donorEmail)) {
    errors.donorEmail = 'Invalid email address';
  }

  if (!donorPhone || String(donorPhone).trim() === '') {
    errors.donorPhone = 'Phone number is required';
  }

  if (!paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  } else if (!VALID_PAYMENTS.includes(paymentMethod)) {
    errors.paymentMethod = 'Invalid payment method';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Invalid input data', errors });
  }

  next();
}

module.exports = validateDonation;
