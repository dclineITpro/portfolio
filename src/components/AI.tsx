import React from 'react';
import { Brain, Cpu, Rocket, ShieldCheck, Server, Settings, Link, Palette } from 'lucide-react';

const AI: React.FC = () => {
  const cards = [
    {
      title: 'LLM Applications',
      icon: Brain,
      points: [
        'Summarization, Q&A, and content generation',
        'Prompt engineering + evaluation',
        'RAG for grounded, factual responses',
      ],
    },
    {
      title: 'NLP Pipelines',
      icon: Cpu,
      points: [
        'Transformers, spaCy, LangChain',
        'NER, classification, retrieval',
        'Embeddings + tokenization best practices',
      ],
    },
    {
      title: 'Rapid Prototyping → Scale',
      icon: Rocket,
      points: [
        'Partner with teams to identify use cases',
        'Build POCs quickly, iterate with feedback',
        'Harden to production with testing/monitoring',
      ],
    },
    {
      title: 'Cybersecurity Automation',
      icon: Settings,
      points: [
        'SIEM/SOAR playbooks and enrichments',
        'Incident response workflows and auto‑remediation',
        'Vulnerability scanning and policy enforcement',
      ],
    },
    {
      title: 'APIs & Services',
      icon: Link,
      points: [
        'Connect models to real apps via APIs',
        'FastAPI/Node integrations',
        'Auth, rate limits, observability',
      ],
    },
    {
      title: 'MLOps (Cloud‑neutral)',
      icon: Server,
      points: [
        'MLflow for tracking/registry',
        'SageMaker/Vertex AI supported',
        'A/B tests, drift, model monitoring',
      ],
    },
    {
      title: 'Governance & Safety',
      icon: ShieldCheck,
      points: [
        'Security, compliance, explainability',
        'Bias checks and auditability',
        'Responsible AI practices',
      ],
    },
    {
      title: 'Vibe Coding',
      icon: Palette,
      points: [
        'Flow‑state prototyping and rapid UI spikes',
        'Micro‑interactions and tasteful animations',
        'Ambient visuals (Particles, Letter Rain)',
      ],
    },
    {
      title: 'DevOps',
      icon: Settings,
      points: [
        'Docker containerization',
        'Kubernetes + CI/CD',
        'Production reliability patterns',
      ],
    },
  ];

  const tools = [
    'Ollama', 'LM Studio', 'Chroma (preferred)', 'FAISS', 'Transformers', 'spaCy',
    'LangChain', 'MLflow', 'SIEM/SOAR', 'Docker', 'Kubernetes', 'CI/CD',
  ];

  return (
    <section id="ai" className="section-padding bg-slate-900/50">
      <div className="container-padding">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 border border-primary-300 text-primary-700 text-xs font-semibold">
              Local‑first AI • Ollama + LM Studio
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold">
              <Palette className="w-3 h-3 mr-1" />
              Vibe Coding
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3 text-gradient">AI</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            AI focused on LLMs, Generative AI, and NLP, with cybersecurity automation. Cloud‑neutral solutions with a strong
            local‑first stance for privacy and control, leveraging Ollama and LM Studio where appropriate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white p-6 rounded-lg card-shadow hover-lift"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 border-2 border-primary-500">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-700">{card.title}</h3>
                </div>
                <ul className="space-y-2">
                  {card.points.map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-center hover:text-slate-900 transition-colors">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-lg card-shadow">
          <h3 className="text-lg font-bold text-slate-900 mb-3 text-center">Tools & Platforms</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {tools.map((t) => (
              <span key={t} className="px-3 py-1 text-sm rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#contact" className="inline-block px-5 py-2 bg-primary-600 text-white rounded-md shadow hover:bg-primary-700 transition">
            Contact to discuss AI use cases
          </a>
        </div>
      </div>
    </section>
  );
};

export default AI;
