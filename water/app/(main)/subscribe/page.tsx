"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useWaterStore } from "@/lib/store";
import { GlassCard } from "@/components/GlassCard";
import { toast } from "sonner";

const features = [
  { icon: "📊", title: "Advanced Analytics", desc: "Deep insights into your hydration patterns" },
  { icon: "🔔", title: "Smart Reminders", desc: "Personalized hydration and movement alerts" },
  { icon: "🎯", title: "Custom Goals", desc: "Set multiple health goals and track them all" },
  { icon: "📈", title: "Trend Analysis", desc: "See your progress over weeks and months" },
  { icon: "🌙", title: "Dark & Light Mode", desc: "Beautiful themes that match your preference" },
  { icon: "☁️", title: "Cloud Sync", desc: "Backup and sync data across all devices" },
  { icon: "🏆", title: "Achievements", desc: "Unlock badges and celebrate milestones" },
  { icon: "⚡", title: "Priority Support", desc: "Get help from our support team anytime" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Basic tracking",
    features: [
      "Daily water logging",
      "Step tracking",
      "Basic progress view",
      "Local data storage",
    ],
    cta: "Your Plan",
    current: true,
    disabled: true,
  },
  {
    name: "Premium",
    price: "19.99",
    period: "/year",
    description: "Everything you need",
    features: [
      "Everything in Free",
      "Advanced analytics",
      "Smart reminders",
      "Cloud sync & backup",
      "Multiple health goals",
      "Trend analysis",
      "Achievements",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
];

export default function SubscribePage() {
  const store = useWaterStore();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");

  const handleStartTrial = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    store.activateSubscription();
    setLoading(false);
    toast.success("Welcome to Premium! 🎉");
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-[#1E3A8A] via-[#312E81] to-[#4F46E5] p-4">
      <div className="mx-auto max-w-md pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Link
            href="/"
            className="rounded-full bg-white/10 p-2 backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Premium</h1>
          <div className="w-10" />
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Sparkles className="mx-auto mb-3 h-12 w-12 text-yellow-300" />
          <h2 className="text-3xl font-bold text-white">
            Unlock Your Full<br />Potential
          </h2>
          <p className="mt-2 text-gray-300">
            Get advanced features to master your hydration and wellness journey.
          </p>
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-full transition-all ${
              billingPeriod === "monthly"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-white/60 hover:text-white/80"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-4 py-2 rounded-full transition-all ${
              billingPeriod === "annual"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-white/60 hover:text-white/80"
            }`}
          >
            Annual (Save 40%)
          </button>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-3"
        >
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              whileHover={!plan.disabled ? { scale: 1.02 } : {}}
              className={`rounded-2xl border p-6 transition-all ${
                plan.highlight
                  ? "border-cyan-500/50 bg-linear-to-br from-cyan-500/10 to-blue-500/10 ring-2 ring-cyan-500/20"
                  : "border-white/10 bg-white/5"
              } ${plan.disabled ? "pointer-events-none opacity-60" : ""}`}
            >
              {plan.highlight && (
                <div className="mb-2 inline-block rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{plan.description}</p>

              <div className="mt-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-sm text-gray-400">{plan.period}</span>
              </div>

              <div className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyan-300 shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={plan.name === "Premium" ? handleStartTrial : undefined}
                disabled={plan.disabled || loading}
                className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold transition-all ${
                  plan.highlight
                    ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50"
                    : "bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
                }`}
              >
                {loading && plan.highlight ? "Processing..." : plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="mb-4 text-lg font-bold text-white">Premium Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <GlassCard key={feature.title} className="p-4 text-center">
                <div className="text-3xl">{feature.icon}</div>
                <h4 className="mt-2 text-sm font-semibold text-white">{feature.title}</h4>
                <p className="mt-1 text-xs text-gray-400">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="mb-4 text-lg font-bold text-white">FAQ</h3>
          <div className="space-y-3">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your subscription anytime with no questions asked.",
              },
              {
                q: "Is there a free trial?",
                a: "Absolutely! Get 7 days free, then $19.99/year. No credit card required.",
              },
              {
                q: "What about my data?",
                a: "Your data is always yours. Export it anytime or delete it completely.",
              },
              {
                q: "Do you offer refunds?",
                a: "If you're not happy within 30 days, we'll refund you fully.",
              },
            ].map((faq) => (
              <GlassCard key={faq.q} className="p-4">
                <h4 className="font-semibold text-white">{faq.q}</h4>
                <p className="mt-1 text-sm text-gray-400">{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500"
        >
          Water is free. Premium is optional—tracks work the same either way. ✨
        </motion.p>
      </div>
    </div>
  );
}
