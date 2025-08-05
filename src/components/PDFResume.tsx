import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface PDFResumeProps {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    location: string;
    achievements: string[];
  }>;
  skills: string[];
  achievements: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

const PDFResume: React.FC = () => {
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('DJ Cline', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(52, 73, 94);
    pdf.text('IT Director & Strategic Technology Leader', pageWidth / 2, 30, { align: 'center' });
    
    // Contact Info
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const contactInfo = [
      'Email: djcline@protonmail.com',
      'Phone: 563-213-6358',
      'Location: United States',
      'LinkedIn: linkedin.com/in/djcline'
    ];
    contactInfo.forEach((info, index) => {
      pdf.text(info, pageWidth / 2, 40 + (index * 5), { align: 'center' });
    });
    
    // Professional Summary
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('PROFESSIONAL SUMMARY', 20, 65);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    const summary = 'Strategic IT leader with 25+ years of experience driving digital transformation, cybersecurity excellence, and team development across diverse industries. Proven track record in implementing enterprise-wide technology solutions, reducing operational costs, and building high-performing teams. Expert in cloud architecture, cybersecurity frameworks, and IT governance.';
    const summaryLines = pdf.splitTextToSize(summary, pageWidth - 40);
    pdf.text(summaryLines, 20, 75);
    
    let currentY = 95 + (summaryLines.length * 5);
    
    // Professional Experience
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('PROFESSIONAL EXPERIENCE', 20, currentY);
    currentY += 15;
    
    const experiences = [
      {
        company: 'Senior IT Director',
        position: 'Enterprise Technology Solutions',
        duration: '2019 - Present',
        location: 'United States',
        achievements: [
          'Led enterprise-wide digital transformation initiatives resulting in 25% operational efficiency gains',
          'Implemented comprehensive cybersecurity framework achieving 99.9% system availability',
          'Managed $2M+ technology budgets and reduced operational costs by 30%',
          'Built and led high-performing teams of 15+ IT professionals across multiple locations'
        ]
      },
      {
        company: 'IT Manager',
        position: 'Technology Infrastructure',
        duration: '2015 - 2019',
        location: 'United States',
        achievements: [
          'Architected cloud migration strategy reducing infrastructure costs by 40%',
          'Established disaster recovery protocols ensuring 99.9% uptime',
          'Mentored 10+ junior professionals, with 80% receiving promotions',
          'Implemented ITIL-based service management improving response times by 45%'
        ]
      }
    ];
    
    experiences.forEach(exp => {
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text(exp.company, 20, currentY);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${exp.position} | ${exp.duration}`, 20, currentY + 5);
      
      exp.achievements.forEach((achievement, index) => {
        if (currentY > pageHeight - 50) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.setFontSize(10);
        pdf.setTextColor(50, 50, 50);
        pdf.text(`• ${achievement}`, 25, currentY + 12 + (index * 5));
      });
      
      currentY += 25 + (exp.achievements.length * 5);
    });
    
    // Skills
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('CORE COMPETENCIES', 20, currentY);
    currentY += 15;
    
    const skills = [
      'Strategic IT Leadership', 'Cybersecurity Frameworks', 'Cloud Architecture',
      'Team Development', 'Digital Transformation', 'IT Governance',
      'Budget Management', 'Risk Assessment', 'Vendor Management',
      'Project Management', 'Disaster Recovery', 'Compliance & Auditing'
    ];
    
    skills.forEach((skill, index) => {
      const x = 20 + (index % 2) * 90;
      const y = currentY + Math.floor(index / 2) * 5;
      pdf.setFontSize(10);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`• ${skill}`, x, y);
    });
    
    currentY += 20 + (Math.ceil(skills.length / 2) * 5);
    
    // Key Achievements
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = 20;
    }
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('KEY ACHIEVEMENTS', 20, currentY);
    currentY += 15;
    
    const achievements = [
      '25+ years IT Leadership Experience',
      '15+ Successful Projects Delivered',
      '$1M+ in Cost Savings Achieved',
      '99.9% System Availability Maintained',
      'Operations Across 4 Countries',
      '50+ Professionals Mentored & Developed'
    ];
    
    achievements.forEach((achievement, index) => {
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.setFontSize(10);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`• ${achievement}`, 20, currentY + (index * 5));
    });
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated from portfolio.djcline.tech | Updated: ' + new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    pdf.save('DJ-Cline-Resume.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
    >
      <Download className="w-5 h-5 mr-2" />
      Download Resume (PDF)
    </button>
  );
};

export default PDFResume;
