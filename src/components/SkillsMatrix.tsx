import React from 'react';

interface SkillItem {
  name: string;
  level: number; // 1-5
}

const domains: { domain: string; items: SkillItem[] }[] = [
  {
    domain: 'Cloud',
    items: [
      { name: 'Azure', level: 4 },
      { name: 'M365', level: 5 },
      { name: 'Identity (Entra)', level: 4 },
      { name: 'Backup/DR', level: 5 },
    ],
  },
  {
    domain: 'Network',
    items: [
      { name: 'Cisco/Aruba', level: 4 },
      { name: 'SD‑WAN/SASE', level: 5 },
      { name: 'Segmentation', level: 4 },
      { name: 'Wi‑Fi', level: 5 },
    ],
  },
  {
    domain: 'Security',
    items: [
      { name: 'XDR', level: 4 },
      { name: 'Zero Trust', level: 4 },
      { name: 'NIST CSF', level: 5 },
      { name: 'SOX ITGC', level: 5 },
    ],
  },
  {
    domain: 'AI',
    items: [
      { name: 'GenAI Strategy & Roadmap', level: 4 },
      { name: 'RAG / Vector Search', level: 4 },
      { name: 'LLM Ops & Guardrails', level: 4 },
      { name: 'Prompt Engineering', level: 5 },
    ],
  },
];

const LevelBar: React.FC<{ level: number }> = ({ level }) => {
  const pct = (level / 5) * 100;
  const color = level >= 5 ? 'bg-cyber-green' : level >= 4 ? 'bg-cyber-blue' : 'bg-cyber-purple';
  return (
    <div className="w-full h-2 bg-slate-700 rounded">
      <div className={`${color} h-2 rounded`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const SkillsMatrix: React.FC = () => {
  return (
    <section id="skills-matrix" className="section-padding bg-slate-900/50 network-bg">
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Skills Matrix</h2>
          <p className="text-slate-300 mb-8 max-w-3xl">
            Domain‑based skill coverage with maturity levels (1‑5). Higher scores indicate deeper expertise and hands‑on leadership.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((d) => (
              <div key={d.domain} className="cyber-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">{d.domain}</h3>
                <div className="space-y-3">
                  {d.items.map((it) => (
                    <div key={it.name} className="grid grid-cols-4 gap-3 items-center">
                      <span className="col-span-1 text-slate-300 text-sm">{it.name}</span>
                      <div className="col-span-3">
                        <LevelBar level={it.level} />
                        <div className="text-xs text-slate-400 mt-1">Level {it.level} / 5</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsMatrix;
