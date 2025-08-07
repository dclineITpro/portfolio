import React from 'react';
import { 
  Target, 
  Shield, 
  Users, 
  Database, 
  Cloud, 
  Cpu, 
  Network, 
  DollarSign,
  Globe,
  Zap,
  Settings,
  TrendingUp
} from 'lucide-react';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "IT Leadership & Strategy",
      icon: Users,
      skills: [
        "Strategic IT Planning",
        "Executive Leadership",
        "Cross-functional Team Leadership",
        "Change Management",
        "Performance Management"
      ]
    },
    {
      title: "Enterprise Architecture & ERP",
      icon: Database,
      skills: [
        "SAP ERP Implementation",
        "AS/400 to SAP Migration",
        "Enterprise Systems Integration",
        "Process Optimization",
        "System Architecture Design"
      ]
    },
    {
      title: "Infrastructure Management",
      icon: Cloud,
      skills: [
        "Cloud Infrastructure (AWS/Azure)",
        "Virtualization Technologies",
        "Network Architecture (LAN/WAN)",
        "Data Center Operations",
        "SDWAN/SASE Implementation"
      ]
    },
    {
      title: "AI & Emerging Technologies",
      icon: Cpu,
      skills: [
        "AI/ML Implementation",
        "Locally Hosted AI Solutions",
        "Technology Innovation",
        "Emerging Tech Evaluation",
        "Proprietary Data Protection"
      ]
    },
    {
      title: "Cybersecurity & Risk Management",
      icon: Shield,
      skills: [
        "Cybersecurity Program Development",
        "Risk Assessment & Mitigation",
        "Security Architecture",
        "Compliance & Governance",
        "Incident Response"
      ]
    },
    {
      title: "Business Technology",
      icon: TrendingUp,
      skills: [
        "Microsoft 365 Administration",
        "Business Process Automation",
        "Digital Transformation",
        "Vendor Management",
        "Budget Management"
      ]
    }
  ];

  const technicalSkills = [
    {
      category: "Enterprise Systems",
      items: ["SAP ERP", "Microsoft 365", "AS/400", "Oracle", "Salesforce"]
    },
    {
      category: "Security & Compliance",
      items: ["XDR", "Penetration Testing", "Vulnerability Management", "FBI Security Audits", "SOX Audits", "NIST Framework", "Zero Trust"]
    },
    {
      category: "Infrastructure",
      items: ["Cisco", "Aruba", "SDWAN/SASE", "Cloud Migration", "Virtualization"]
    },
    {
      category: "Methodologies",
      items: ["ITIL/ITSM", "Agile/Scrum", "Change Management", "Project Management", "Vendor Management"]
    }
  ];

  return (
    <section id="skills" className="section-padding bg-slate-900/50 network-bg">
      <div className="container-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-gradient">
            Core Competencies
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive expertise across technology leadership, cybersecurity, and strategic planning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <div 
              key={category.title}
              className="bg-white p-6 rounded-lg card-shadow hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 border-2 border-primary-500`}>
                  <category.icon className={`w-6 h-6 text-primary-600`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold text-primary-700`}>{category.title}</h3>
                </div>
              </div>
              <ul className="space-y-2">
                {category.skills.map((skill, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-center hover:text-slate-800 transition-colors">
                    <span className={`w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0`}></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg card-shadow">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Technical Expertise</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalSkills.map((category) => (
              <div key={category.category}>
                <h4 className={`font-bold text-primary-700 mb-3`}>{category.category}</h4>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-center hover:text-slate-900 transition-colors">
                      <span className={`w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg card-shadow text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Operational Excellence</h4>
            <p className="text-3xl font-bold text-primary-600 mb-1">85%</p>
            <p className="text-sm text-slate-600">Average efficiency improvement</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg card-shadow text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Security Leadership</h4>
            <p className="text-3xl font-bold text-primary-600 mb-1">0</p>
            <p className="text-sm text-slate-600">Reportable security incidents</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg card-shadow text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Team Development</h4>
            <p className="text-3xl font-bold text-primary-600 mb-1">75%</p>
            <p className="text-sm text-slate-600">Average service improvement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
