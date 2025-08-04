import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, Briefcase } from 'lucide-react';

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
