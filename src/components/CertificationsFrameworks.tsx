import React from 'react';

const CertificationsFrameworks: React.FC = () => {
  const nistFunctions = [
    'Identify', 'Protect', 'Detect', 'Respond', 'Recover'
  ];

  return (
    <section id="frameworks" className="section-padding bg-slate-800/30 circuit-pattern">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Frameworks
          </h2>
          <p className="text-slate-300 mb-8 max-w-3xl">
            Framework coverage and governance experience, including NIST CSF implementation across organizational domains.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* NIST CSF Coverage */}
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">NIST Cybersecurity Framework (CSF)</h3>
              <p className="text-slate-300 mb-4">End-to-end program alignment with the five core functions:</p>
              <div className="flex flex-wrap gap-2">
                {nistFunctions.map((fn) => (
                  <span
                    key={fn}
                    className="px-3 py-1 bg-slate-700 text-primary-400 rounded-full text-xs font-medium border border-slate-600"
                  >
                    {fn}
                  </span>
                ))}
              </div>
              <ul className="mt-4 list-disc list-inside text-slate-300 space-y-1">
                <li>Policy and control mapping to CSF categories and subcategories</li>
                <li>Risk assessments and gap remediation planning</li>
                <li>Continuous improvement and governance reporting</li>
              </ul>
            </div>

            {/* Other Frameworks/Standards */}
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Standards & Compliance</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-slate-700 text-primary-400 rounded-full text-xs font-medium border border-slate-600">SOX (ITGC)</span>
                <span className="px-3 py-1 bg-slate-700 text-primary-400 rounded-full text-xs font-medium border border-slate-600">Zero Trust</span>
                <span className="px-3 py-1 bg-slate-700 text-primary-400 rounded-full text-xs font-medium border border-slate-600">CIS Benchmarks</span>
                <span className="px-3 py-1 bg-slate-700 text-primary-400 rounded-full text-xs font-medium border border-slate-600">M365 Hardening</span>
              </div>
              <ul className="mt-2 list-disc list-inside text-slate-300 space-y-1">
                <li><span className="text-white font-medium">SOX (ITGC):</span> Access, change, and operations controls; evidence lifecycle and audit readiness.</li>
                <li><span className="text-white font-medium">Zero Trust:</span> Identity-first access, least privilege, Conditional Access, MFA, device posture.</li>
                <li><span className="text-white font-medium">CIS Benchmarks:</span> Baseline hardening for Windows, M365, browsers; configuration drift monitoring.</li>
                <li><span className="text-white font-medium">M365 Hardening:</span> Defender/XDR, Secure Score uplift, DLP/sensitivity labels, Safe Links/Attachments.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsFrameworks;
