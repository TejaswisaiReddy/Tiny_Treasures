export type CheckoutContact = { name: string; address: string; phone: string };

export const sampleCheckoutContact: CheckoutContact = {
  name: "Aisha Dutta",
  address: "Rörgrunsvägen 22, 65300 Vaasa, Finland",
  phone: "+358 45 455 2318",
};

// A basic format check, not a check that the number exists or belongs to someone.
export function isValidPhoneNumber(value: string) {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");
  return /^\+?[\d\s()-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
}
