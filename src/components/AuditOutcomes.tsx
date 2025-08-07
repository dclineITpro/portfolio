import React from 'react';

const AuditOutcomes: React.FC = () => {
  return (
    <section id="audit-outcomes" className="section-padding bg-slate-900/50 network-bg">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Audit Outcomes</h2>
          <p className="text-slate-300 mb-8 max-w-3xl">
            Summary of SOX audit scope, control families, sampling, and findings across IT General Controls (ITGCs).
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Scope</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>ITGCs: Access, Change Management, Operations</li>
                <li>In-scope systems: ERP, M365, Directory, Network</li>
                <li>Key reports and interfaces reviewed</li>
              </ul>
            </div>

            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Sampling</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Role changes and access provisioning samples</li>
                <li>Change tickets and approvals sampling</li>
                <li>Backup/restore and job monitoring evidence</li>
              </ul>
            </div>

            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Findings</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Zero significant deficiencies across ITGCs</li>
                <li>Remediation SLAs met for minor observations</li>
                <li>Strengthened quarterly access review cadence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditOutcomes;
