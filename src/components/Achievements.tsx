import React from 'react';
import { Award, Shield, Users, TrendingUp, Star, Trophy } from 'lucide-react';

const Achievements: React.FC = () => {
  const achievements = [
    {
      icon: Shield,
      title: "Security Excellence",
      description: "Zero reportable security incidents throughout career",
      detail: "Maintained impeccable security record across all organizations, implementing comprehensive security programs from the ground up",
      impact: "100% Security Compliance"
    },
    {
      icon: TrendingUp,
      title: "Operational Efficiency",
      description: "85% improvement in operational efficiency through SAP ERP implementation",
      detail: "Successfully transitioned from AS/400 to SAP ERP while implementing Microsoft 365 across international operations",
      impact: "85% Efficiency Gain"
    },
    {
      icon: Users,
      title: "Team Development",
      description: "75% improvement in service delivery metrics through leadership and mentorship",
      detail: "Recognized as collaborative leader who has mentored numerous team members to promotions",
      impact: "75% Service Improvement"
    },
    {
      icon: Award,
      title: "FBI Security Audit",
      description: "Passed FBI security audit with zero deficiencies",
      detail: "Led municipal IT operations supporting critical services (health, fire, police, 911) through comprehensive security evaluation",
      impact: "Zero Deficiencies"
    },
    {
      icon: Star,
      title: "Innovation Leadership",
      description: "200% faster technology adoption rates in global organization",
      detail: "Pioneered technology deployments positioning US subsidiary as company's innovation leader",
      impact: "200% Adoption Rate"
    },
    {
      icon: Trophy,
      title: "Global Recognition",
      description: "Collaborated with C-suite executives, government officials, and global partners",
      detail: "Worked with FBI, emergency teams, and international stakeholders in high-stakes environments",
      impact: "Global Impact"
    }
  ];

  const metrics = [
    { value: '25+', suffix: 'years', label: 'IT Leadership Experience' },
    { value: '15+', suffix: 'projects', label: 'Successful Projects' },
    { value: '$1M+', suffix: 'savings', label: 'In Cost Savings' },
    { value: '99.9%', suffix: 'uptime', label: 'System Availability' },
    { value: '4', suffix: 'countries', label: 'Global Operations' }
  ];

  return (
    <section id="achievements" className="section-padding bg-slate-800/30 circuit-pattern">
      <div className="container-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-gradient">
            Key Achievements
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Quantifiable results demonstrating strategic impact and operational excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg card-shadow hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <achievement.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{achievement.title}</h3>
              <p className="text-slate-600 text-sm mb-3">{achievement.description}</p>
              <p className="text-xs text-slate-500 mb-3">{achievement.detail}</p>
              <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                {achievement.impact}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg card-shadow">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Career Impact Metrics</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center flex flex-col">
                <div className="mb-2">
                  <p className="text-3xl font-bold text-primary-600">{metric.value}</p>
                  <p className="text-xs text-slate-500 -mt-1">{metric.suffix}</p>
                </div>
                <p className="text-sm text-slate-600 mt-auto">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Recognition & Impact</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Industry Recognition</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Collaborative leader recognized by C-suite executives</li>
                <li>• Government partnerships with FBI and emergency teams</li>
                <li>• Global stakeholder collaboration across multiple countries</li>
                <li>• Innovation leader in multinational organizations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Organizational Impact</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Transformed IT departments with innovative changes</li>
                <li>• Bridged gaps between technical and non-technical stakeholders</li>
                <li>• Empowered team members to achieve promotions</li>
                <li>• Delivered scalable solutions across international operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
