import React, { useState } from 'react';
import { Banknote, Calculator, FileCheck, Users, ArrowRight, MessageCircle, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateGeneralWhatsAppLink, getPhoneLink, PRIMARY_PHONE, PRIMARY_PHONE_DISPLAY, WHATSAPP_NUMBER } from '../utils/contact';

interface FinanceSectionProps {
  isTamil: boolean;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ isTamil }) => {
  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(350000);
  const [interestRate, setInterestRate] = useState(11.5);
  const [tenureYears, setTenureYears] = useState(3);

  // Monthly EMI calculation formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return Math.round(p / n);
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI();
  const totalPayment = monthlyEMI * (tenureYears * 12);
  const totalInterest = totalPayment - loanAmount;

  const financeServices = [
    {
      icon: Banknote,
      title: "Finance Assistance",
      desc: "Partnerships with trusted vehicle finance banks and NBFCs active across Ariyalur, Perambalur, and Trichy districts."
    },
    {
      icon: Calculator,
      title: "Flexible EMI Guidance",
      desc: "Customized loan tenure from 12 to 60 months tailored to your monthly income and business cashflow."
    },
    {
      icon: FileCheck,
      title: "Documentation Support",
      desc: "Complete help with Aadhaar, PAN card, bank statements, salary slips, or agricultural land records for rural buyers."
    },
    {
      icon: Users,
      title: "Local Customer Assistance",
      desc: "Personalized doorstep guidance by local staff with zero hidden fees and clear breakdown of loan terms."
    }
  ];

  const requiredDocuments = [
    "Aadhaar Card & PAN Card Copy",
    "Latest 6 Months Bank Statement",
    "Electricity Bill / Ration Card (Address Proof)",
    "Passport Size Photos (2 Nos)",
    "Salary Slip (Salaried) or Business Proof / Patta (Self-Employed / Agriculture)"
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Banknote className="w-3.5 h-3.5 text-amber-600" />
            <span>Pre-Owned Vehicle Loan Guidance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Simplified Finance Assistance
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Get assistance with suitable financing options and flexible EMI planning for your pre-owned vehicle purchase.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {financeServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-800 transition duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5 tracking-tight">{service.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{service.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Interactive EMI Calculator Card */}
        <div className="bg-slate-950 rounded-xl text-white p-6 sm:p-8 shadow-lg border border-slate-800 mb-12 bg-geometric-grid-dark">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  Interactive Planner
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">Pre-Owned Car EMI Calculator</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Estimate your approximate monthly installment based on current market interest rates.
                </p>
              </div>

              {/* Slider 1: Loan Amount */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono font-semibold mb-2">
                  <span className="text-slate-300 font-sans">Required Loan Amount</span>
                  <span className="text-amber-400 text-sm font-bold font-mono">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-none appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>₹50,000</span>
                  <span>₹10,00,000</span>
                  <span>₹20,00,000</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono font-semibold mb-2">
                  <span className="text-slate-300 font-sans">Estimated Interest Rate (p.a.)</span>
                  <span className="text-amber-400 text-sm font-bold font-mono">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="18"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-none appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>9% (Prime)</span>
                  <span>13.5% (Standard)</span>
                  <span>18% (Commercial)</span>
                </div>
              </div>

              {/* Slider 3: Tenure */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono font-semibold mb-2">
                  <span className="text-slate-300 font-sans">Loan Tenure</span>
                  <span className="text-amber-400 text-sm font-bold font-mono">
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setTenureYears(year)}
                      className={`py-2 rounded-md text-xs font-mono font-bold transition border cursor-pointer ${
                        tenureYears === year
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {year} {year === 1 ? 'Yr' : 'Yrs'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Display Box */}
            <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <span className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider block">
                  Estimated Monthly EMI
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                  ₹{monthlyEMI.toLocaleString('en-IN')}
                  <span className="text-xs text-slate-400 font-sans font-normal block mt-1">/ month</span>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-sans">Principal Loan:</span>
                    <span className="text-white font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span className="font-sans">Total Interest:</span>
                    <span className="text-white font-bold">₹{totalInterest.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold pt-2 border-t border-slate-800">
                    <span className="font-sans">Total Payable:</span>
                    <span className="text-amber-400">₹{totalPayment.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href={generateGeneralWhatsAppLink('finance', `Hello PM Cars Ariyalur, I want to discuss car loan options for an estimated loan amount of ₹${loanAmount.toLocaleString('en-IN')}. Please help me with required documents.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Discuss This Loan on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Checklist & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-6 rounded-xl border border-slate-200/90">
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>Standard Documentation Checklist</span>
            </h4>
            <div className="space-y-1.5">
              {requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-white p-5 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-900">Important Notice:</strong> PM Cars provides loan consultation and documentation coordination. Final loan approval, interest rate, and eligibility are determined solely by lending institutions and financial partners based on your profile and vehicle verification.
              </p>
            </div>

            <a
              id="finance-talk-btn"
              href={getPhoneLink(PRIMARY_PHONE)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition border border-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Talk to PM Cars ({PRIMARY_PHONE_DISPLAY})</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
