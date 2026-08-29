'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Check, 
  Crown, 
  Zap, 
  ArrowLeft,
  Coins
} from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const subscriptionPlans = [
    {
      name: 'Free',
      description: 'Perfect for trying out basic generation',
      priceMonthly: '$0',
      priceYearly: '$0',
      credits: '5 Initial Credits',
      popular: false,
      features: [
        'Standard Generation Speed',
        '720p Resolution Output',
        'Community Support',
        'Basic Aspect Ratios (1:1)'
      ],
      ctaText: 'Current Plan',
      isCurrent: true,
    },
    {
      name: 'Pro Creator',
      description: 'For power creators needing high speed & resolution',
      priceMonthly: '$19',
      priceYearly: '$15',
      credits: '1,000 Credits / month',
      popular: true,
      features: [
        'Ultra Fast Edge Generation',
        '4K Ultra HD Resolution',
        'AI Video & Image Access',
        'All Aspect Ratios (16:9, 9:16, 1:1)',
        'Commercial License',
        'Priority 24/7 Support'
      ],
      ctaText: 'Upgrade to Pro',
      isCurrent: false,
    },
    {
      name: 'Agency Studio',
      description: 'Maximum performance for teams & heavy usage',
      priceMonthly: '$49',
      priceYearly: '$39',
      credits: '3,500 Credits / month',
      popular: false,
      features: [
        'Dedicated Rendering Pipeline',
        'Unlimited Parallel Generations',
        'Custom AI Model Fine-tuning',
        'API Access & Webhooks',
        'Dedicated Account Manager'
      ],
      ctaText: 'Get Studio',
      isCurrent: false,
    }
  ];

  const creditPacks = [
    { credits: 50, price: '$5', costPerCredit: '$0.10 / credit' },
    { credits: 200, price: '$15', costPerCredit: '$0.07 / credit', badge: 'Most Popular' },
    { credits: 500, price: '$30', costPerCredit: '$0.06 / credit' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#070712] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* BACKGROUND ACCENT GLOWS */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="w-full border-b border-purple-900/40 bg-[#0c0c1e]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between z-20 sticky top-0">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-amber-300 text-xs font-bold transition">
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-amber-400 to-purple-600 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-purple-400 bg-clip-text text-transparent">
            CreatorStack <span className="text-amber-400">AI</span>
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 relative z-10 flex flex-col items-center gap-12">
        {/* TITLE & TOGGLE */}
        <div className="text-center space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-black uppercase">
            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Choose Your Power
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Flexible Plans for Every Creator
          </h1>
          <p className="text-sm text-slate-400">
            Upgrade for instant unlimited-speed AI generations, or top up credits as you go.
          </p>

          {/* MONTHLY / YEARLY TOGGLE */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="bg-[#0f0f24] border border-purple-800/30 p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-md border border-amber-400/30">
                  20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          {subscriptionPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-[#0f0f24]/90 border rounded-3xl p-6 flex flex-col justify-between backdrop-blur-2xl transition-all hover:border-amber-400/50 ${
                plan.popular
                  ? 'border-amber-400 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-400/30 md:-translate-y-2 z-10'
                  : 'border-purple-800/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-amber-300">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="bg-[#070712] border border-purple-800/30 rounded-xl p-2.5 flex items-center gap-2 text-xs font-extrabold text-amber-400">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  {plan.credits}
                </div>

                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={plan.isCurrent}
                className={`w-full mt-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg active:scale-95 cursor-pointer ${
                  plan.isCurrent
                    ? 'bg-[#070712] border border-purple-800/40 text-slate-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:brightness-110 shadow-purple-500/20'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* PAY PER CREDIT SECTION */}
        <div className="w-full bg-[#0f0f24]/90 border border-purple-800/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-800/30 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Coins className="w-4 h-4" /> Pay-As-You-Go
              </div>
              <h2 className="text-2xl font-black text-white mt-1">Need Extra Credits Only?</h2>
              <p className="text-xs text-slate-400">No monthly commitment. Credits never expire.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creditPacks.map((pack, idx) => (
              <div
                key={idx}
                className="relative bg-[#070712] border border-purple-800/40 hover:border-amber-400/60 rounded-2xl p-5 flex flex-col justify-between transition"
              >
                {pack.badge && (
                  <span className="absolute top-3 right-3 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pack.badge}
                  </span>
                )}
                <div>
                  <div className="text-2xl font-black text-amber-400">{pack.credits} Credits</div>
                  <div className="text-xs text-slate-400 mt-1">{pack.costPerCredit}</div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-900/30">
                  <span className="text-2xl font-black text-white">{pack.price}</span>
                  <button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
