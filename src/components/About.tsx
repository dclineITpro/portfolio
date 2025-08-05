import React from 'react';
import { Target, Users, Shield, Brain } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Strategic Vision',
      description: 'Aligning technology initiatives with business objectives to drive measurable outcomes and competitive advantage.'
    },
    {
      icon: Users,
      title: 'Team Leadership',
      description: 'Empowering teams through mentorship, professional development, and collaborative leadership across global organizations.'
    },
    {
      icon: Shield,
      title: 'Cybersecurity Excellence',
      description: 'Building comprehensive security programs from the ground up, achieving zero reportable security incidents.'
    },
    {
      icon: Brain,
      title: 'AI & Innovation',
      description: 'Leveraging AI and emerging technologies to enhance operational efficiency and maintain competitive edge.'
    }
  ];

  return (
    <section id="about" className="section-padding bg-slate-900/50 network-bg">
      <div className="container-padding">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-gradient">About Me</h2>
          <p className="text-xl text-slate-300">
            Strategic IT leader with 25+ years of experience driving digital transformation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg card-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Professional Philosophy</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                With over two decades of progressive IT leadership experience, I have transformed departments 
                by driving innovative changes and aligning technology with business goals. My expertise encompasses 
                strong technical skills while effectively bridging gaps between technical and non-technical stakeholders.
              </p>
              <p className="text-slate-600 leading-relaxed">
                I stay current on emerging technologies while prioritizing practical alignment with business needs, 
                balancing innovation and efficiency across diverse systems including network infrastructure, 
                data centers, ERP, and cybersecurity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg card-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Leadership Approach</h3>
              <p className="text-slate-600 leading-relaxed">
                I am committed to talent development, empowering team strengths in a collaborative environment. 
                Colleagues view me as a supportive, hands-on leader engaged at all levels, from C-suite executives 
                and government officials to global partners.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div 
                  key={value.title}
                  className="bg-white p-6 rounded-lg card-shadow hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white p-8 rounded-lg card-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Industries & Experience</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                Manufacturing
              </span>
              <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                Government
              </span>
              <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                Enterprise
              </span>
              <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                International Operations
              </span>
              <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                Emergency Services
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
