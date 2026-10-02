"use client";

import { useState, type FormEvent } from "react";
import { ItemDialog } from "@/components/item-dialog";
import type { DeliveryMethod } from "@/lib/cart";
import { isValidPhoneNumber, type CheckoutContact } from "@/lib/checkout-contact";

export { sampleCheckoutContact, type CheckoutContact } from "@/lib/checkout-contact";

export function CheckoutContactDialog({ initial, deliveryMethod, onSave, onClose, description = "These details are used for this preview only and reset when you leave the payment page." }: {
  initial: CheckoutContact;
  deliveryMethod: DeliveryMethod;
  onSave: (contact: CheckoutContact) => void;
  onClose: () => void;
  description?: string;
}) {
  const [contact, setContact] = useState(initial);
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const fields = [
    { name: "name", label: "Full name", maxLength: 80, type: "text" },
    ...(deliveryMethod === "delivery" ? [{ name: "address", label: "Delivery address", maxLength: 200, type: "text" }] : []),
    { name: "phone", label: "Phone number", maxLength: 30, type: "tel" },
  ];

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = fields.find(field => !contact[field.name as keyof CheckoutContact].trim());
    if (missing) {
      setError(`Enter your ${missing.label.toLowerCase()}.`);
      setInvalidField(missing.name);
      document.getElementById(`checkout-${missing.name}`)?.focus();
      return;
    }
    if (!isValidPhoneNumber(contact.phone)) {
      setError("Enter a valid phone number with 7–15 digits, for example +358 45 455 2318.");
      setInvalidField("phone");
      document.getElementById("checkout-phone")?.focus();
      return;
    }
    onSave({ name: contact.name.trim(), address: contact.address.trim(), phone: contact.phone.trim() });
  }

  return (
    <ItemDialog title={deliveryMethod === "delivery" ? "Edit delivery details" : "Edit pickup contact"} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <p className="text-sm leading-5 text-gray-600">{description}</p>
        {fields.map(field => <div key={field.name} className="space-y-2">
          <label htmlFor={`checkout-${field.name}`} className="block text-sm font-medium">{field.label}</label>
          <input id={`checkout-${field.name}`} name={field.name} type={field.type} required maxLength={field.maxLength} autoComplete="off" aria-invalid={invalidField === field.name || undefined} aria-describedby={invalidField === field.name ? "contact-error" : undefined} value={contact[field.name as keyof CheckoutContact]} onChange={event => { setContact(current => ({ ...current, [field.name]: event.target.value })); setError(""); setInvalidField(""); }} className="min-h-12 w-full rounded-xl border border-filter-border bg-white px-3 py-2 text-base aria-invalid:border-red-600" />
        </div>)}
        {error && <p id="contact-error" role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="min-h-12 w-full rounded-xl bg-brand px-4 py-3 font-medium text-white hover:bg-brand/90">Save details</button>
      </form>
    </ItemDialog>
  );
}
