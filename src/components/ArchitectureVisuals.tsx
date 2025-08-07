import React from 'react';
import { Network, ShieldCheck, Layers, Server } from 'lucide-react';

const Card: React.FC<{ title: string; Icon: React.ElementType; subtitle?: string; children?: React.ReactNode }>
  = ({ title, Icon, subtitle, children }) => (
  <div className="cyber-card p-6 rounded-lg hover-lift">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 text-primary-400 mr-2" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    {subtitle && <p className="text-slate-300 mt-1 mb-4">{subtitle}</p>}
    <div className="bg-slate-800/60 border border-slate-700 rounded-md p-4">
      {children}
    </div>
  </div>
);

const SimpleDiagram: React.FC<{ lines?: number }>= ({ lines = 3 }) => (
  <svg viewBox="0 0 400 160" className="w-full h-36 text-slate-400">
    <rect x="10" y="10" width="100" height="40" rx="6" className="fill-none stroke-current" />
    <rect x="150" y="10" width="100" height="40" rx="6" className="fill-none stroke-current" />
    <rect x="290" y="10" width="100" height="40" rx="6" className="fill-none stroke-current" />
    <line x1="60" y1="50" x2="200" y2="50" className="stroke-current" />
    <line x1="200" y1="50" x2="340" y2="50" className="stroke-current" />
    <rect x="80" y="100" width="240" height="40" rx="6" className="fill-none stroke-current" />
    {Array.from({ length: lines }).map((_, i) => (
      <line key={i} x1={95 + i*70} y1={120} x2={115 + i*70} y2={120} className="stroke-current" />
    ))}
  </svg>
);

const ArchitectureVisuals: React.FC = () => {
  return (
    <section id="architecture" className="section-padding bg-slate-800/30 circuit-pattern">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Architecture Visuals</h2>
          <p className="text-slate-300 mb-8 max-w-3xl">
            High-level diagrams illustrating secure, resilient enterprise designs.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Secure Multi‑Site Network" Icon={Network} subtitle="Segmentation, VPN/SD‑WAN, redundant edges">
              <SimpleDiagram />
            </Card>

            <Card title="Zero Trust Model" Icon={ShieldCheck} subtitle="Identity‑centric, least privilege, continuous validation">
              <SimpleDiagram lines={2} />
            </Card>

            <Card title="Microsoft 365 Hardening" Icon={Layers} subtitle="Conditional Access, MFA, DLP, baseline policies">
              <SimpleDiagram />
            </Card>

            <Card title="ERP High Availability" Icon={Server} subtitle="Active/Passive, backups, replication, failover testing">
              <SimpleDiagram lines={4} />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureVisuals;
