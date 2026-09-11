import React from 'react';
import { Banknote, CircleDollarSign, FileCheck, ArrowRight } from 'lucide-react';

interface ValuePropositionProps {
  onSelectAction: (tab: string) => void;
  isTamil?: boolean;
}

export const ValueProposition: React.FC<ValuePropositionProps> = ({
  onSelectAction
}) => {
  const pillars = [
    {
      num: "01",
      title: "SIMPLIFIED FINANCE OPTIONS",
      desc: "Tailored local loan support with flexible EMI guidance and fast paperwork coordination.",
      icon: Banknote,
      tab: 'finance',
      btnText: 'Explore Finance'
    },
    {
      num: "02",
      title: "ON-SITE PARKING SALES",
      desc: "Park your old vehicle with PM Cars and connect directly with verified local buyers.",
      icon: CircleDollarSign,
      tab: 'sell',
      btnText: 'Sell Your Car'
    },
    {
      num: "03",
      title: "LIVE INSURANCE & VERIFICATION",
      desc: "Assistance with official RTO documentation checks and instant insurance policy renewal.",
      icon: FileCheck,
      tab: 'insurance',
      btnText: 'Insurance Support'
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-slate-50 text-slate-900 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest block mb-2">
            Dealership Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The PM Cars Advantage for Ariyalur Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-amber-600">
                      {pillar.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center transition">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 mb-2 tracking-tight group-hover:text-amber-700 transition">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100">
                  <button
                    onClick={() => onSelectAction(pillar.tab)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer font-mono"
                  >
                    <span>{pillar.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
