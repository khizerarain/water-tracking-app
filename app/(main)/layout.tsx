import { BottomNav } from "@/components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-linear-to-br from-[#1E3A8A] via-[#312E81] to-[#4F46E5]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-28 pt-safe text-white">{children}</div>
      <BottomNav />
    </div>
  );
}
