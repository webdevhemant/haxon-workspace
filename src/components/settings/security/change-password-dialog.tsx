"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Strength {
  score: number;
  label: string;
  color: string;
}

function scorePassword(pw: string): Strength {
  if (!pw) return { score: 0, label: "Empty", color: "#E5E7EB" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Too short", "Weak", "Okay", "Good", "Strong", "Excellent"];
  const colors = ["#EF4444", "#F97316", "#EAB308", "#84CC16", "#10B981", "#059669"];
  return { score: s, label: labels[s], color: colors[s] };
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const strength = useMemo(() => scorePassword(next), [next]);
  const mismatch = confirm.length > 0 && confirm !== next;
  const canSave = current.length > 0 && next.length >= 8 && !mismatch;

  const handleSave = () => {
    if (!canSave) return;
    toast.success("Password updated");
    setCurrent("");
    setNext("");
    setConfirm("");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[96vw] bg-white dark:bg-gray-950 rounded-md shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
          <div className="flex items-start gap-3 px-5 pt-5 pb-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Change password
              </Dialog.Title>
              <Dialog.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Use 8+ characters. A mix of letters, numbers and symbols is best.
              </Dialog.Description>
            </div>
            <Dialog.Close className="w-7 h-7 -mr-1 -mt-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </Dialog.Close>
          </div>

          <div className="px-5 pb-4 space-y-3">
            <PasswordField
              label="Current password"
              value={current}
              onChange={setCurrent}
              show={showCurrent}
              setShow={setShowCurrent}
              autoFocus
            />
            <PasswordField
              label="New password"
              value={next}
              onChange={setNext}
              show={showNext}
              setShow={setShowNext}
            />
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }}
                />
              </div>
              <span className="text-[10.5px] font-semibold tabular-nums" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
            <PasswordField
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              show={showNext}
              setShow={setShowNext}
              error={mismatch ? "Passwords don't match" : undefined}
            />
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <Dialog.Close className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={cn(
                "px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-colors",
                canSave
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed",
              )}
            >
              Save password
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  error?: string;
  autoFocus?: boolean;
}

function PasswordField({ label, value, onChange, show, setShow, error, autoFocus }: PasswordFieldProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
      <div className="relative">
        <input
          autoFocus={autoFocus}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2 pr-9 text-sm border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 transition-colors",
            error
              ? "border-rose-400 focus:ring-rose-500/30 focus:border-rose-500"
              : "border-gray-200 dark:border-gray-700 focus:ring-orange-500/30 focus:border-orange-400",
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(!show)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
      {error && <div className="mt-1 text-[11px] text-rose-500">{error}</div>}
    </div>
  );
}
