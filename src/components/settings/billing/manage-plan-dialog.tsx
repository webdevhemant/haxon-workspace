"use client";
import { useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, ChevronLeft, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PlanOption {
  id: "free" | "pro" | "enterprise";
  name: string;
  pricePerSeat: number;
  blurb: string;
  features: string[];
}

const PLANS: PlanOption[] = [
  { id: "free", name: "Free", pricePerSeat: 0, blurb: "For small teams trying things out.", features: ["3 members", "Basic AI"] },
  { id: "pro", name: "Pro", pricePerSeat: 12, blurb: "For growing teams that need more.", features: ["Unlimited members", "Advanced AI", "SSO"] },
  { id: "enterprise", name: "Enterprise", pricePerSeat: 22, blurb: "For orgs with security needs.", features: ["SCIM", "Audit log", "Dedicated CSM"] },
];

type Step = 1 | 2 | 3;

export function ManagePlanDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [planId, setPlanId] = useState<PlanOption["id"]>("pro");
  const [seats, setSeats] = useState(12);

  const plan = PLANS.find((p) => p.id === planId)!;
  const monthly = plan.pricePerSeat * seats;

  const reset = () => {
    setStep(1);
    setPlanId("pro");
    setSeats(12);
  };

  const confirm = () => {
    toast.success(`Switched to ${plan.name} · ${seats} seat${seats === 1 ? "" : "s"}`);
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
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-[96vw] bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
          <div className="flex items-start gap-3 px-5 pt-5 pb-2">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="w-7 h-7 -ml-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : null}
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Change plan
              </Dialog.Title>
              <Dialog.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {step === 1 && "Pick the plan that fits your team."}
                {step === 2 && "How many seats do you need?"}
                {step === 3 && "Review and confirm the change."}
              </Dialog.Description>
            </div>
            <Dialog.Close className="w-7 h-7 -mr-1 -mt-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </Dialog.Close>
          </div>

          <div className="px-5 pb-3 flex items-center gap-1.5">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  s <= step ? "bg-orange-500" : "bg-gray-100 dark:bg-gray-800",
                )}
              />
            ))}
          </div>

          <div className="px-5 pb-4 min-h-[220px]">
            {step === 1 && (
              <div className="space-y-2">
                {PLANS.map((p) => {
                  const selected = p.id === planId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={cn(
                        "w-full text-left rounded-xl border p-3 transition-all",
                        selected
                          ? "border-orange-400 ring-2 ring-orange-500/15 bg-orange-50/40 dark:bg-orange-950/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              selected ? "border-orange-500 bg-orange-500" : "border-gray-300 dark:border-gray-600",
                            )}
                          >
                            {selected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-sm font-semibold">{p.name}</span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          ${p.pricePerSeat}
                          <span className="text-xs text-gray-400 font-normal">/seat/mo</span>
                        </span>
                      </div>
                      <div className="text-[11.5px] text-gray-500 dark:text-gray-400 ml-6">{p.blurb}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Seats</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSeats((s) => Math.max(1, s - 1))}
                    disabled={seats <= 1}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    value={seats}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (!isNaN(n)) setSeats(Math.max(1, Math.min(500, n)));
                    }}
                    className="w-20 h-12 text-center text-2xl font-bold tabular-nums border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                  <button
                    onClick={() => setSeats((s) => Math.min(500, s + 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 text-[12px] text-gray-500">
                  {plan.name} · ${plan.pricePerSeat}/seat × {seats} ={" "}
                  <span className="font-semibold text-gray-900 dark:text-white">${monthly}</span>/mo
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <Row label="Plan" value={plan.name} />
                <Row label="Seats" value={String(seats)} />
                <Row label="Price per seat" value={`$${plan.pricePerSeat}/mo`} />
                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                <Row label="Total" value={`$${monthly}/mo`} bold />
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 p-3 text-[11.5px] text-orange-900 dark:text-orange-200">
                  Prorated for the rest of this billing period. Your next invoice will reflect the new amount.
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <Dialog.Close className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Cancel
            </Dialog.Close>
            {step < 3 ? (
              <button
                onClick={() => setStep((step + 1) as Step)}
                className="px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={confirm}
                className="px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                Confirm change
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={cn(bold ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300")}>
        {value}
      </span>
    </div>
  );
}
