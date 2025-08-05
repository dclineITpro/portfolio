import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, Briefcase, Download } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://formspree.io/f/mzzvjddp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "djcline@protonmail.com",
      href: "mailto:djcline@protonmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "563-213-6358",
      href: "tel:563-213-6358"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Hazel Green, WI 53811",
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/dj-cline-22219834/",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Briefcase,
      label: "Portfolio",
      href: "#",
      color: "bg-slate-600 hover:bg-slate-700"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-slate-900/50 network-bg">
      <div className="container-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-gradient">
            Let's Connect
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ready to discuss how my experience can drive your organization's technology transformation? 
            Let's explore opportunities to collaborate and achieve strategic objectives together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gradient animate-text-glow">Get In Touch</h3>
              <p className="text-slate-600 mb-6">
                I'm always interested in discussing new opportunities, innovative projects, 
                and ways to drive technology transformation. Whether you're looking for strategic 
                IT leadership, cybersecurity expertise, or AI implementation guidance, let's connect.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{info.label}</p>
                    {info.href ? (
                      <a 
                        href={info.href} 
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-slate-600">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gradient animate-text-glow">Connect Online</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors ${social.color}`}
                  >
                    <social.icon size={20} className="mr-2" />
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg card-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-900"
                  placeholder="DJ Cline"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-900"
                  placeholder="your.email@company.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-slate-900"
                  placeholder="How can I help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none text-slate-900"
                  placeholder="Tell me about your project, challenges, or opportunities..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  Thank you for your message! I'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  There was an error sending your message. Please try again or contact me directly.
                </div>
              )}

              <div className="text-center space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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
                              Email: dcline@example.com | Phone: (555) 123-4567<br>
                              Location: United States | LinkedIn: linkedin.com/in/dj-cline-22219834
                            </div>
                          </div>

                          <div class="section">
                            <div class="section-title">PROFESSIONAL SUMMARY</div>
                            <p>Strategic IT leader with 25+ years of progressive experience driving digital transformation, cybersecurity excellence, and operational efficiency across manufacturing, government, and enterprise environments. Expert in ERP implementations, cloud migrations, and building high-performing global teams. Proven track record of implementing enterprise-wide technology solutions, reducing operational costs, and achieving 99.9% system availability.</p>
                          </div>

                          <div class="section">
                            <div class="section-title">CORE COMPETENCIES</div>
                            <div class="skills-grid">
                              <div class="skills-category">
                                <div class="skills-title">Strategic Leadership</div>
                                <ul>
                                  <li>IT Strategic Planning</li>
                                  <li>Digital Transformation</li>
                                  <li>Enterprise Architecture</li>
                                  <li>Global Team Leadership</li>
                                </ul>
                              </div>
                              <div class="skills-category">
                                <div class="skills-title">Technical Expertise</div>
                                <ul>
                                  <li>SAP ERP Implementation</li>
                                  <li>Microsoft 365 Migration</li>
                                  <li>Cloud Infrastructure</li>
                                  <li>Cybersecurity Frameworks</li>
                                </ul>
                              </div>
                              <div class="skills-category">
                                <div class="skills-title">Operations</div>
                                <ul>
                                  <li>24/7 Manufacturing Operations</li>
                                  <li>ITIL/ITSM Processes</li>
                                  <li>Budget Management ($2M+)</li>
                                  <li>Vendor Management</li>
                                </ul>
                              </div>
                              <div class="skills-category">
                                <div class="skills-title">Security & Compliance</div>
                                <ul>
                                  <li>FBI Security Audits</li>
                                  <li>Disaster Recovery</li>
                                  <li>Risk Assessment</li>
                                  <li>Policy Development</li>
                                </ul>
                              </div>
                            </div>
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
                              <li>15+ Successful Projects Delivered</li>
                              <li>85% Operational Efficiency Gain via SAP ERP Implementation</li>
                              <li>99.9% System Availability Maintained</li>
                              <li>Operations Across 3 Countries (US, Mexico, Asia)</li>
                              <li>FBI Security Audit: Zero Deficiencies</li>
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
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume (PDF)
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white p-6 rounded-lg card-shadow">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Ready to Transform Your IT Strategy?</h4>
            <p className="text-slate-600 mb-4">
              Let's discuss how my experience in cybersecurity, AI implementation, and digital transformation 
              can drive your organization's success.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <span>• Strategic IT Leadership</span>
              <span>• Cybersecurity Programs</span>
              <span>• AI & Innovation</span>
              <span>• Team Development</span>
              <span>• Digital Transformation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
