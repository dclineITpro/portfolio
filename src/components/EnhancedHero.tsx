import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Highlights from './Highlights';
import ParticlesBackground from './ParticlesBackground';
import PDFResume from './PDFResume';
import { ChevronDown, Mail, Linkedin, Cpu, Network, Shield, Zap, Download, FileText } from 'lucide-react';

const EnhancedHero: React.FC = () => {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-start justify-center pt-24 md:pt-24">
      <ParticlesBackground />

      {/* Main Content */}
      <div className="relative z-10 container-padding text-center">
        <div className="max-w-4xl mx-auto">
          {/* Photo */}
          <motion.img
            src="/portfolio/dj.jpg"
            alt="DJ Cline"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-8 border-4 border-cyber-blue/50 shadow-lg z-40 relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Animated Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-gradient">DJ Cline</span>
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Cpu className="w-8 h-8 text-cyber-blue animate-neural" />
              <Network className="w-8 h-8 text-cyber-green animate-neural" style={{ animationDelay: '0.5s' }} />
              <Shield className="w-8 h-8 text-cyber-purple animate-neural" style={{ animationDelay: '1s' }} />
            </div>
            <TypeAnimation
              sequence={[
                'IT Director & Technology Leader',
                2000,
                'Cybersecurity Strategist',
                2000,
                'AI-Driven Innovator',
                2000,
                'Digital Transformation Expert',
                2000,
              ]}
              wrapper="p"
              speed={50}
              className="text-2xl md:text-3xl text-slate-300 mb-2 h-20 md:h-auto"
              repeat={Infinity}
            />
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transforming organizations through strategic IT leadership, cybersecurity excellence, and AI-driven innovation
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <Highlights />
          </div>

          {/* Animated CTA Buttons */}
          <div className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Get In Touch
            </button>
            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  const resumeHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>DJ Cline - Resume</title>
                      <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
                        .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
                        .name { font-size: 32px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
                        .title { font-size: 20px; color: #475569; margin-bottom: 10px; font-weight: 500; }
                        .contact { font-size: 14px; color: #64748b; }
                        .section { margin-bottom: 30px; }
                        .section-title { font-size: 20px; font-weight: bold; color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
                        .experience-item { margin-bottom: 25px; page-break-inside: avoid; }
                        .experience-title { font-weight: bold; font-size: 18px; color: #1e40af; }
                        .experience-company { color: #475569; font-weight: 600; margin: 4px 0; }
                        .experience-location { color: #64748b; font-size: 14px; }
                        .experience-duration { color: #64748b; font-size: 14px; font-style: italic; }
                        ul { margin: 8px 0 0 0; padding-left: 20px; }
                        li { margin-bottom: 4px; font-size: 14px; }
                        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0; }
                        .skills-category { margin-bottom: 15px; }
                        .skills-title { font-weight: bold; color: #1e40af; margin-bottom: 5px; }
                        .achievement { margin-bottom: 8px; padding-left: 15px; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div class="name">DJ Cline</div>
                        <div class="title">IT Director & Strategic Technology Leader</div>
                        <div class="contact">
                          Email: djcline@protonmail.com | Phone: 563-213-6358<br>
                          Location: United States | LinkedIn: linkedin.com/in/dj-cline-22219834
                        </div>
                      </div>

                      <div class="section">
                        <div class="section-title">PROFESSIONAL SUMMARY</div>
                        <p>Strategic IT leader with 25+ years of progressive experience driving digital transformation, cybersecurity excellence, and operational efficiency across manufacturing, government, and enterprise environments. Expert in ERP implementations, cloud migrations, and building high-performing global teams. Proven track record of implementing enterprise-wide technology solutions, reducing operational costs, and achieving 99.99% system availability.</p>
                      </div>

                      <div class="section">
                        <div class="section-title">PROFESSIONAL EXPERIENCE</div>
                        
                        <div class="experience-item">
                          <div class="experience-title">IT Director</div>
                          <div class="experience-company">Flexsteel Industries, Inc.</div>
                          <div class="experience-location">Dubuque, IA</div>
                          <div class="experience-duration">September 2015 – Present</div>
                          <ul>
                            <li>Lead IT operations for a 24/7 international manufacturer, overseeing infrastructure, support, compliance, and security for teams across the US, Mexico, and Asia</li>
                            <li>Spearheaded transition from AS/400 to SAP ERP and implemented Microsoft 365, enhancing operational efficiency by 85%</li>
                            <li>Developed and enforced a comprehensive security program from the ground up, reducing vulnerabilities through policy standardization and advanced tools</li>
                            <li>Collaborate with global stakeholders to deliver scalable solutions, including SDWAN/SASE and cloud infrastructure upgrades</li>
                            <li>AI expert utilizing locally hosted AI to both customize the technology and keep proprietary data under control</li>
                          </ul>
                        </div>

                        <div class="experience-item">
                          <div class="experience-title">Enterprise Architect & Client Support Team Leader</div>
                          <div class="experience-company">Roquette America, Inc.</div>
                          <div class="experience-location">Keokuk, IA</div>
                          <div class="experience-duration">May 2012 – September 2015</div>
                          <ul>
                            <li>Directed technical operations for North America's division of a global starch manufacturer, serving as the liaison between IT and business units</li>
                            <li>Pioneered technology deployments, positioning the US subsidiary as the company's innovation leader, with 200% faster adoption rates</li>
                            <li>Managed ITIL/ITSM processes and helpdesk operations, improving service delivery metrics by 75% across 4 sites with over 10,000 users</li>
                          </ul>
                        </div>

                        <div class="experience-item">
                          <div class="experience-title">IT Director</div>
                          <div class="experience-company">City of Branson, Missouri</div>
                          <div class="experience-location">Branson, MO</div>
                          <div class="experience-duration">October 2007 – May 2012</div>
                          <ul>
                            <li>Oversaw IT strategy for municipal operations, supporting critical services (health, fire, police, 911) and passing an FBI security audit with zero deficiencies</li>
                            <li>Revamped network infrastructure (LAN/WAN, Cisco, Aruba), boosting system reliability for emergency operations</li>
                            <li>Partnered with government agencies and C-level leaders to align IT with organizational goals, managing a team of 4 professionals</li>
                          </ul>
                        </div>

                        <div class="experience-item">
                          <div class="experience-title">Systems Administrator</div>
                          <div class="experience-company">City of Branson, Missouri</div>
                          <div class="experience-location">Branson, MO</div>
                          <div class="experience-duration">September 2005 – October 2007</div>
                          <ul>
                            <li>Managed enterprise systems and helpdesk, earning promotion to IT Director due to exceptional leadership and performance</li>
                            <li>Enhanced IT service delivery through process improvements, reducing downtime by 75%</li>
                          </ul>
                        </div>

                        <div class="experience-item">
                          <div class="experience-title">LAN Technician</div>
                          <div class="experience-company">City of Branson, Missouri</div>
                          <div class="experience-location">Branson, MO</div>
                          <div class="experience-duration">April 2004 – September 2005</div>
                          <ul>
                            <li>Provided hardware/software support and network troubleshooting, earning promotion to Systems Administrator for demonstrated expertise</li>
                          </ul>
                        </div>
                      </div>

                      <div class="section">
                        <div class="section-title">KEY ACHIEVEMENTS</div>
                        <ul>
                          <li>25+ years IT Leadership Experience</li>
                          <li>85% Operational Efficiency Gain via SAP ERP Implementation</li>
                          <li>99.99% System Availability Maintained</li>
                          <li>Operations Across US, Mexico, and Asia</li>
                          <li>FBI Security Audit: Zero Deficiencies</li>
                          <li>Zero reportable security incidents</li>
                        </ul>
                      </div>

                      <div class="section">
                        <div class="section-title">TECHNICAL SKILLS</div>
                        <div class="skills-grid">
                          <div>
                            <strong>ERP & Systems:</strong> SAP ERP, Microsoft 365, AS/400
                          </div>
                          <div>
                            <strong>Cloud & Infrastructure:</strong> SDWAN/SASE, Cloud Architecture, Network Infrastructure
                          </div>
                          <div>
                            <strong>Security:</strong> XDR, Cybersecurity Frameworks, FBI Compliance
                          </div>
                          <div>
                            <strong>Management:</strong> ITIL/ITSM, Global Team Leadership, Budget Management
                          </div>
                        </div>
                      </div>

                      <div class="footer">
                        Generated from DJ Cline's Professional Portfolio | Updated: ${new Date().toLocaleDateString()}
                      </div>
                    </body>
                    </html>
                  `;
                  
                  printWindow.document.write(resumeHTML);
                  printWindow.document.close();
                  
                  setTimeout(() => {
                    printWindow.print();
                  }, 500);
                }
              }}
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </button>
            <button
              onClick={() => {
                const win = window.open('', '_blank');
                if (win) {
                  const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8" />
                      <title>Board One-Pager - DJ Cline</title>
                      <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 36px; color: #0f172a; }
                        .title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
                        .subtitle { color: #334155; font-size: 14px; margin: 0 0 14px; }
                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                        .section { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
                        .h3 { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 8px; text-transform: uppercase; letter-spacing: .04em; }
                        ul { margin: 0; padding-left: 18px; }
                        li { margin: 4px 0; }
                        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
                        .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
                        .kpi .label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
                        .kpi .value { font-size: 16px; font-weight: 800; color: #0f172a; }
                        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                        .pill { display:inline-block; border-radius: 9999px; padding: 2px 8px; font-size: 11px; border:1px solid #e2e8f0; background:#f8fafc; margin-right:6px; }
                        .footer { margin-top: 12px; color: #64748b; font-size: 11px; text-align:right; }
                        @media print { body { margin: 18mm; } }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div class="title">Board One‑Pager — DJ Cline</div>
                        <div class="subtitle">Senior IT Director | VP‑Ready Technology & Cybersecurity Leader</div>
                        <div class="subtitle">Operating across US, Mexico, and Asia • 25+ years experience • Zero reportable security incidents</div>
                      </div>

                      <div class="grid" style="margin-bottom:16px;">
                        <div class="section">
                          <div class="h3">Mission</div>
                          <p style="margin:0; font-size:13px; color:#334155;">Align technology portfolios to revenue growth, margin expansion, and risk reduction through disciplined operations, data‑driven modernization, and enterprise‑grade security.</p>
                        </div>
                        <div class="section">
                          <div class="h3">Portfolio Scope</div>
                          <p style="margin:0; font-size:13px; color:#334155;">ERP modernization • SD‑WAN/SASE • Zero Trust/NIST CSF • M365 Hardening • Cloud/Identity • Global operations across 5 countries</p>
                        </div>
                      </div>

                      <div class="row" style="margin-bottom:16px;">
                        <div class="section">
                          <div class="h3">Strategy Pillars</div>
                          <ul>
                            <li><strong>Run:</strong> 99.99% availability; ≥95% change success; MTTR < 4h (critical)</li>
                            <li><strong>Transform:</strong> ERP modernization; 200% faster adoption; vendor consolidation for $ savings</li>
                            <li><strong>Secure:</strong> Zero reportable incidents; SOX ITGC sustained; NIST CSF target Tier 4</li>
                          </ul>
                        </div>
                        <div class="section">
                          <div class="h3">12‑Month Roadmap</div>
                          <ul>
                            <li><strong>Q1:</strong> Baseline KPIs, contract/cost review, risk heatmap, stakeholder map</li>
                            <li><strong>Q2:</strong> Prioritize portfolio; vendor consolidation; patch SLO ≥95%/14d</li>
                            <li><strong>Q3:</strong> ERP wave 1; SD‑WAN global rollout; identity hardening</li>
                            <li><strong>Q4:</strong> Zero Trust stage 2; DR test >95% pass; cloud variance within ±5%</li>
                          </ul>
                        </div>
                      </div>

                      <div class="section" style="margin-bottom:16px;">
                        <div class="h3">KPIs</div>
                        <div class="kpi-grid">
                          <div class="kpi"><div class="label">Reliability</div><div class="value">99.99%</div></div>
                          <div class="kpi"><div class="label">Change Success</div><div class="value">≥95%</div></div>
                          <div class="kpi"><div class="label">Critical MTTR</div><div class="value">< 4h</div></div>
                          <div class="kpi"><div class="label">Patch Compliance</div><div class="value">≥95% / 14d</div></div>
                          <div class="kpi"><div class="label">Phishing Pass</div><div class="value">≥98%</div></div>
                          <div class="kpi"><div class="label">Cloud Variance</div><div class="value">±5%</div></div>
                          <div class="kpi"><div class="label">Vendor Count</div><div class="value">−30%</div></div>
                          <div class="kpi"><div class="label">Adoption Speed</div><div class="value">200%↑</div></div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="section">
                          <div class="h3">Risk & Controls Posture</div>
                          <ul>
                            <li>SOX ITGC sustained; quarterly control testing cadence</li>
                            <li>NIST CSF maturity tracking; target Tier 4 with defense‑in‑depth</li>
                            <li>DR tested; RTO/RPO met for mission‑critical workloads</li>
                            <li>Third‑party risk tiering and continuous monitoring</li>
                          </ul>
                        </div>
                        <div class="section">
                          <div class="h3">Highlights</div>
                          <p style="margin:0 0 6px; font-size:13px; color:#334155;">Zero reportable security incidents • Global operations (5 countries)</p>
                          <div>
                            <span class="pill">ERP</span>
                            <span class="pill">SD‑WAN/SASE</span>
                            <span class="pill">Zero Trust</span>
                            <span class="pill">M365</span>
                            <span class="pill">Identity</span>
                          </div>
                        </div>
                      </div>

                      <div class="footer">Generated from DJ Cline's Portfolio • Updated: ${new Date().toLocaleDateString()}</div>
                    </body>
                    </html>
                  `;
                  win.document.write(html);
                  win.document.close();
                  setTimeout(() => win.print(), 400);
                }
              }}
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              <FileText className="w-5 h-5 mr-2" />
              Board One‑Pager
            </button>
            <a
              href="https://www.linkedin.com/in/dj-cline-22219834/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
          </div>

          {/* Animated Tech Stack */}
          <div className="flex justify-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-cyber-orange" />
              <span>AI/ML</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyber-green" />
              <span>Cybersecurity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyber-blue" />
              <span>Digital Transformation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="text-slate-400 hover:text-cyber-blue transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>


    </section>
  );
};

export default EnhancedHero;
