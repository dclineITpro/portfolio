export const generateResumePDF = () => {
  // Create a simple but professional PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    const resumeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DJ Cline - Resume</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 5px;
          }
          .title { 
            font-size: 18px; 
            color: #64748b; 
            margin-bottom: 10px;
          }
          .contact { 
            font-size: 14px; 
            color: #64748b; 
          }
          .section { 
            margin-bottom: 25px; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1e40af; 
            border-bottom: 1px solid #e2e8f0; 
            padding-bottom: 5px; 
            margin-bottom: 15px;
          }
          .experience-item { 
            margin-bottom: 20px; 
          }
          .experience-title { 
            font-weight: bold; 
            font-size: 16px; 
          }
          .experience-company { 
            color: #475569; 
            font-style: italic; 
          }
          .experience-duration { 
            color: #64748b; 
            font-size: 14px; 
          }
          .achievement { 
            margin-bottom: 8px; 
            padding-left: 15px;
          }
          ul { 
            margin: 0; 
            padding-left: 20px; 
          }
          li { 
            margin-bottom: 5px; 
          }
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
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
          <p>Strategic IT leader with 25+ years of experience driving digital transformation, cybersecurity excellence, and team development across diverse industries. Proven track record in implementing enterprise-wide technology solutions, reducing operational costs, and building high-performing teams.</p>
        </div>

        <div class="section">
          <div class="section-title">CORE COMPETENCIES</div>
          <div class="skills-grid">
            <ul>
              <li>Strategic IT Leadership</li>
              <li>Cybersecurity Frameworks</li>
              <li>Cloud Architecture</li>
              <li>Digital Transformation</li>
              <li>Team Development</li>
              <li>IT Governance</li>
            </ul>
            <ul>
              <li>Budget Management</li>
              <li>Risk Assessment</li>
              <li>Project Management</li>
              <li>Vendor Management</li>
              <li>Disaster Recovery</li>
              <li>Compliance & Auditing</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">PROFESSIONAL EXPERIENCE</div>
          
          <div class="experience-item">
            <div class="experience-title">Senior IT Director</div>
            <div class="experience-company">Enterprise Technology Solutions</div>
            <div class="experience-duration">2019 - Present | United States</div>
            <ul>
              <li>Led enterprise-wide digital transformation initiatives resulting in 25% operational efficiency gains</li>
              <li>Implemented comprehensive cybersecurity framework achieving 99.9% system availability</li>
              <li>Managed $2M+ technology budgets and reduced operational costs by 30%</li>
              <li>Built and led high-performing teams of 15+ IT professionals across multiple locations</li>
            </ul>
          </div>

          <div class="experience-item">
            <div class="experience-title">IT Manager</div>
            <div class="experience-company">Technology Infrastructure</div>
            <div class="experience-duration">2015 - 2019 | United States</div>
            <ul>
              <li>Architected cloud migration strategy reducing infrastructure costs by 40%</li>
              <li>Established disaster recovery protocols ensuring 99.9% uptime</li>
              <li>Mentored 10+ junior professionals, with 80% receiving promotions</li>
              <li>Implemented ITIL-based service management improving response times by 45%</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">KEY ACHIEVEMENTS</div>
          <ul>
            <li>25+ years IT Leadership Experience</li>
            <li>15+ Successful Projects Delivered</li>
            <li>$1M+ in Cost Savings Achieved</li>
            <li>99.9% System Availability Maintained</li>
            <li>Operations Across 4 Countries</li>
          </ul>
        </div>

        <div class="footer">
          Generated from portfolio.djcline.tech | Updated: ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(resumeHTML);
    printWindow.document.close();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
