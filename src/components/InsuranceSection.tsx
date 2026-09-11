import React from 'react';
import { ShieldCheck, RefreshCw, FileSearch, ShieldAlert, ArrowRight, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneLink, PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER } from '../utils/contact';

interface InsuranceSectionProps {
  isTamil: boolean;
}

export const InsuranceSection: React.FC<InsuranceSectionProps> = ({ isTamil }) => {
  const insuranceServices = [
    {
      icon: RefreshCw,
      title: "Insurance Renewal Assistance",
      desc: "Fast renewal for expired or expiring third-party and comprehensive vehicle policies before RTO ownership transfer."
    },
    {
      icon: FileSearch,
      title: "Policy Verification",
      desc: "Checking previous claim track records, NCB (No Claim Bonus) status, and ensuring live coverage validity on Parivahan."
    },
    {
      icon: ShieldCheck,
      title: "Comprehensive vs TP Guidance",
      desc: "Clear explanation of own damage cover, commercial vehicle liability, passenger risk coverage, and driver insurance."
    },
    {
      icon: ShieldAlert,
      title: "Renewal Guidance & Reminders",
      desc: "Timely reminders before your annual policy expiry to avoid fines, vehicle seizure, and sudden lapsed policy inspections."
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Insurance & Documentation Consultancy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Vehicle Insurance Support
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Get assistance with live insurance renewal and vehicle documentation during your purchase process.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {insuranceServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-800 transition duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 tracking-tight">{service.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{service.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Why Live Insurance Matters in Ariyalur */}
        <div className="bg-slate-950 text-white rounded-xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-geometric-grid-dark shadow-sm">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Safe & Hassle-Free Transfer
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Buying or Selling a Pre-Owned Vehicle?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              In Tamil Nadu, an active and valid insurance policy is strictly mandatory for RTO ownership name transfer (Form 29/30). PM Cars coordinates with top general insurance providers so you receive instant online policy copies without visiting multiple broker offices.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-sans">Instant Soft Copy on WhatsApp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-sans">Private & T-Board Coverage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-sans">Clean Claims Verification</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <a
              id="insurance-contact-btn"
              href={generateGeneralWhatsAppLink('insurance')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Contact for Insurance Support</span>
            </a>

            <a
              href={getPhoneLink(PRIMARY_PHONE)}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 font-mono font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Insurance Desk: {PRIMARY_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
