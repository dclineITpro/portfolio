import React from 'react';
import { Calendar, MapPin, TrendingUp, Shield, Users, Globe } from 'lucide-react';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: "IT Director - Cybersecurity/Infrastructure/Support/AI",
      company: "Flexsteel Industries, Inc.",
      location: "Dubuque, IA",
      period: "September 2015 – Present",
      achievements: [
        "Lead IT operations for a 24/7 international manufacturer, overseeing infrastructure, support, compliance, and security for teams across the US, Mexico, and Asia",
        "Spearheaded the technical infrastructure transition from AS/400 to SAP and implemented Microsoft 365, enhancing operational efficiency by 85%",
        "Developed and enforced a comprehensive security program from the ground up, reducing vulnerabilities through policy standardization and advanced tools",
        "Collaborate with global stakeholders to deliver scalable solutions, including SDWAN/SASE and cloud infrastructure upgrades",
        "AI expert utilizing locally hosted AI to both customize the technology and keep proprietary data under control"
      ],
      technologies: ["SAP ERP", "Microsoft 365", "SDWAN/SASE", "XDR", "Cloud Infrastructure", "AI/ML"],
      icon: Globe
    },
    {
      title: "Enterprise Architect & Client Support Team Leader",
      company: "Roquette America, Inc.",
      location: "Keokuk, IA",
      period: "May 2012 – September 2015",
      achievements: [
        "Directed technical operations for North America's division of a global starch manufacturer, serving as the liaison between IT and business units",
        "Pioneered technology deployments, positioning the US subsidiary as the company's innovation leader, with 200% faster adoption rates",
        "Managed ITIL/ITSM processes and helpdesk operations, improving service delivery metrics by 75% across 4 sites with over 10,000 users"
      ],
      technologies: ["ITIL/ITSM", "Enterprise Architecture", "Global Operations", "Process Improvement"],
      icon: TrendingUp
    },
    {
      title: "IT Director",
      company: "City of Branson, Missouri",
      location: "Branson, MO",
      period: "October 2007 – May 2012",
      achievements: [
        "Oversaw IT strategy for municipal operations, supporting critical services (health, fire, police, 911) and passing an FBI security audit with zero deficiencies",
        "Revamped network infrastructure (LAN/WAN, Cisco, Aruba), boosting system reliability for emergency operations",
        "Partnered with government agencies and C-level leaders to align IT with organizational goals, managing a team of 4 professionals"
      ],
      technologies: ["Municipal IT", "Emergency Services", "Network Infrastructure", "Security Compliance"],
      icon: Shield
    },
    {
      title: "Systems Administrator",
      company: "City of Branson, Missouri",
      location: "Branson, MO",
      period: "September 2005 – October 2007",
      achievements: [
        "Managed enterprise systems and helpdesk, earning promotion to IT Director due to exceptional leadership and performance",
        "Enhanced IT service delivery through process improvements, reducing downtime by 75%"
      ],
      technologies: ["Enterprise Systems", "Helpdesk Management", "Process Improvement"],
      icon: Users
    },
    {
      title: "LAN Technician",
      company: "City of Branson, Missouri",
      location: "Branson, MO",
      period: "April 2004 – September 2005",
      achievements: [
        "Provided hardware/software support and network troubleshooting, earning promotion to Systems Administrator for demonstrated expertise"
      ],
      technologies: ["Hardware Support", "Network Troubleshooting", "Technical Support"],
      icon: Calendar
    }
  ];

  return (
    <section id="experience" className="section-padding bg-slate-800/30 circuit-pattern">
      <div className="container-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-gradient">
            Professional Experience
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Progressive leadership roles demonstrating strategic IT management and business impact
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                <div className="cyber-card p-6 rounded-lg hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                      <p className="text-primary-400 font-semibold">{exp.company}</p>
                      <p className="text-slate-300">{exp.location}</p>
                      <p className="text-sm text-slate-400">{exp.period}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      <exp.icon className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-slate-300 flex items-start">
                        <span className="text-primary-400 mr-2 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-700 text-primary-400 rounded-full text-xs font-medium border border-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Career Progression</h3>
            <p className="text-slate-600">
              Consistent advancement from technical roles to strategic leadership, 
              demonstrating adaptability and growth across diverse industries and organizational scales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
