"use client";
import { useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { CreditCard, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}

export function UpdateCardDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");

  const digits = number.replace(/\s/g, "");
  const canSave = digits.length >= 13 && exp.length === 5 && cvc.length >= 3;

  const reset = () => {
    setName("");
    setNumber("");
    setExp("");
    setCvc("");
    setZip("");
  };

  const save = () => {
    if (!canSave) return;
    const last4 = digits.slice(-4);
    toast.success(`Card ending in ${last4} saved`);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] max-w-[96vw] bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
          <div className="flex items-start gap-3 px-5 pt-5 pb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Update payment method
              </Dialog.Title>
              <Dialog.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                We'll use this card for monthly invoices and seat add-ons.
              </Dialog.Description>
            </div>
            <Dialog.Close className="w-7 h-7 -mr-1 -mt-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </Dialog.Close>
          </div>

          <div className="px-5 pb-3 space-y-3">
            <Field
              label="Name on card"
              value={name}
              onChange={setName}
              placeholder="Maya Chen"
            />
            <Field
              label="Card number"
              value={number}
              onChange={(v) => setNumber(formatCardNumber(v))}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              autoComplete="cc-number"
            />
            <div className="grid grid-cols-3 gap-2">
              <Field
                label="Expiry"
                value={exp}
                onChange={(v) => setExp(formatExpiry(v))}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
              />
              <Field
                label="CVC"
                value={cvc}
                onChange={(v) => setCvc(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
              />
              <Field
                label="ZIP"
                value={zip}
                onChange={(v) => setZip(v.replace(/[^A-Za-z0-9]/g, "").slice(0, 10))}
                placeholder="10115"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <span className="text-[10.5px] text-gray-400 inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Encrypted & PCI-compliant
            </span>
            <div className="flex gap-2">
              <Dialog.Close className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={save}
                disabled={!canSave}
                className={cn(
                  "px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-colors",
                  canSave
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed",
                )}
              >
                Save card
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}

function Field({ label, value, onChange, placeholder, inputMode, autoComplete }: FieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
      />
    </div>
  );
}
