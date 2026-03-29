"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SyncHealthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-2xl focus:outline-none">
          <div className="mb-4 flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-semibold">Apple Health &amp; Google Fit</Dialog.Title>
            <Dialog.Close className="rounded-xl p-1 text-white/60 transition hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="space-y-3 text-sm leading-relaxed text-white/75">
            <p>
              This web app runs in your browser. Native health APIs (HealthKit, Google Fit) are not available from a
              website the same way they are in a native app.
            </p>
            <p>
              Install Water as a PWA for a focused experience, and use manual step logging here — or update steps once
              a day from your phone&apos;s tracker.
            </p>
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="glass" type="button">
                Got it
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button type="button">Log steps manually</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
