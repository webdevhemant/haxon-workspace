"use client";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { ShieldCheck, X, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECRET = "JBSWY3DPEHPK3PXPGZK4WERA";

function pseudoQrCells(seed: string): boolean[] {
  const out: boolean[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 21 * 21; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    out.push((h & 1) === 1);
  }
  return out;
}

export function Enable2faDialog({ open, onOpenChange }: Props) {
  const cells = useMemo(() => pseudoQrCells(SECRET), []);
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const reset = () => {
    setCode(Array(6).fill(""));
  };

  const setDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6).fill("").map((_, i) => text[i] ?? "");
    setCode(next);
    const focusIdx = Math.min(text.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  const full = code.join("");
  const canVerify = full.length === 6;

  const verify = () => {
    if (!canVerify) return;
    toast.success("Two-factor authentication enabled");
    onOpenChange(false);
    reset();
  };

  const copySecret = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(SECRET).catch(() => undefined);
    }
    toast("Setup key copied");
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
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Enable two-factor authentication
              </Dialog.Title>
              <Dialog.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Scan the code with an authenticator app, then enter the 6-digit code.
              </Dialog.Description>
            </div>
            <Dialog.Close className="w-7 h-7 -mr-1 -mt-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </Dialog.Close>
          </div>

          <div className="px-5 pb-4 grid grid-cols-[152px_1fr] gap-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-2 bg-white flex items-center justify-center">
              <div
                className="grid gap-[1px] w-full"
                style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }}
              >
                {cells.map((on, idx) => (
                  <span
                    key={idx}
                    className="aspect-square"
                    style={{ background: on ? "#0A0A0A" : "#FFFFFF" }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 min-w-0">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Setup key</div>
                <button
                  onClick={copySecret}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-200 dark:border-gray-800 rounded-md text-[12px] font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <span className="truncate">{SECRET}</span>
                  <Copy className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
                </button>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">6-digit code</div>
                <div className="flex items-center gap-1.5">
                  {code.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputs.current[i] = el;
                      }}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onKeyDown(i, e)}
                      onPaste={onPaste}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-9 h-10 text-center text-[15px] font-semibold tabular-nums border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <span className="text-[11px] text-gray-400">Recovery codes will be shown after verification.</span>
            <div className="flex gap-2">
              <Dialog.Close className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={verify}
                disabled={!canVerify}
                className={cn(
                  "px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-colors",
                  canVerify
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed",
                )}
              >
                Verify and enable
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
