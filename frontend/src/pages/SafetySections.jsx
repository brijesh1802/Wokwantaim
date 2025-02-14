import React from "react";
import {
  FaUserEdit,
  FaUserShield,
  FaBuilding,
  FaFileAlt,
  FaFlag,
  FaExclamationTriangle,
  FaEyeSlash,
  FaUserTie,
  FaBriefcase,
  FaShieldAlt,
  FaLock,
  FaEnvelopeOpenText,
  FaClipboardCheck,
  FaUserCheck,
  FaGlobe,
  FaSearch,
  FaHandshake,
} from "react-icons/fa";

// Static content data
const safetyContent = {
  title: "🔐Safety & Security Guidelines",
  introduction:
    "At WorkWomtaim, your safety and security are paramount. We've created comprehensive guidelines to ensure both job seekers and employers can use our platform with confidence. Please review these important safety measures before proceeding.",
  quickTips:
    "Quick Safety Tips: Never pay for job applications • Don't share sensitive personal information • Always verify company details • Report suspicious activities immediately",
  sections: [
    {
      title: "For Job Seekers",
      items: [
        {
          icon: <FaUserShield />,
          title: "Avoid Scams",
          description:
            "Scams in the job market can take various forms. A common scam is asking for money upfront for training, registration fees, or other expenses. Legitimate employers will never request these payments from job seekers. Always be cautious and report any suspicious activity immediately.",
        },
        {
          icon: <FaFileAlt />,
          title: "Update Your Resume",
          description:
            "Keep your resume up to date with your latest experiences, skills, and accomplishments. Tailor your resume for each job application to highlight the most relevant qualifications and make a strong impression on potential employers.",
        },
        {
          icon: <FaUserEdit />,
          title: "Create a Strong Profile",
          description:
            "Your profile is your first impression on potential employers. Ensure it is complete with a professional photo, detailed work experience, and relevant skills. A strong profile increases your visibility to recruiters.",
        },
        {
          icon: <FaEyeSlash />,
          title: "Protect Your Data",
          description:
            "Never share sensitive personal information such as PAN, Aadhar, bank details, or passwords with anyone, especially via email or unverified platforms. Scammers may try to deceive you with fake job offers to steal your personal data.",
        },
        {
          icon: <FaUserCheck />,
          title: "Research Employers",
          description:
            "It's always a good idea to research the employer before applying or attending an interview. Check reviews, ratings, and ensure the company's authenticity. Websites like Glassdoor, LinkedIn, and others can be useful for employer research.",
        },
      ],
    },
    {
      title: "For Employers",
      items: [
        {
          icon: <FaUserTie />,
          title: "Hire Verified Candidates",
          description:
            "When hiring candidates, make sure to verify their credentials and work history. A legitimate candidate will have a clear career path, real work experiences, and no fraudulent activities in their background. Conduct thorough interviews and tests to ensure authenticity.",
        },
        {
          icon: <FaBriefcase />,
          title: "Provide Clear Job Descriptions",
          description:
            "Job seekers rely heavily on job descriptions to understand roles and responsibilities. Always ensure that job descriptions are clear, honest, and detailed. This will not only attract the right candidates but also set expectations properly from the start.",
        },
        {
          icon: <FaBuilding />,
          title: "Promote Company Culture",
          description:
            "Highlight your company culture in job postings and during interviews. Candidates are increasingly looking for workplaces that align with their values, so showcasing your culture can help attract the right fit.",
        },
        {
          icon: <FaShieldAlt />,
          title: "Prevent Fake Applications",
          description:
            "Be cautious of applicants submitting fake credentials or those who apply to numerous job positions indiscriminately. Look for signs such as generic resumes, missing references, or inconsistencies in their work history. A legitimate applicant will be thoughtful and aligned with your role.",
        },
      ],
    },
    {
      title: "Online Safety",
      items: [
        {
          icon: <FaLock />,
          title: "Use Strong Passwords",
          description:
            "Always use strong, unique passwords for each online account. A secure password includes uppercase and lowercase letters, numbers, and special characters. Password managers can help you securely store and generate passwords.",
        },
        {
          icon: <FaEnvelopeOpenText />,
          title: "Beware of Phishing",
          description:
            "Phishing emails can look very convincing. Never click on links in unsolicited emails or provide sensitive information over email or text messages. Always verify the sender's authenticity and use a trusted source to follow up.",
        },
        {
          icon: <FaClipboardCheck />,
          title: "Verify Listings",
          description:
            "Before applying for jobs or offering a role, ensure that the job listings are legitimate. Fake job listings can be posted by scammers to steal information or money. Always cross-check the details, research the company, and ask for more information if needed.",
        },
      ],
    },
    {
      title: "General Guidance",
      items: [
        {
          icon: <FaGlobe />,
          title: "How This Works",
          description:
            "Our platform is designed to connect employers with potential employees. As a job seeker, you can search and apply for jobs, while employers can post job openings and evaluate candidates. Use the advanced search filters to find the best fit.",
        },
        {
          icon: <FaSearch />,
          title: "Find the Right Job",
          description:
            "You can easily find the job that suits your skills and experience using search filters like location, job type, and salary. Don't forget to tailor your resume and cover letter to match the job description for better results.",
        },
        {
          icon: <FaHandshake />,
          title: "Hire the Best Candidate",
          description:
            "As an employer, you can post job openings, review applications, and schedule interviews. Be clear in your job descriptions, and ensure that candidates meet the requirements you've set. This platform makes hiring the right candidate easier than ever.",
        },
        {
          icon: <FaExclamationTriangle />,
          title: "Protect Your Personal Information",
          description:
            "Be cautious of employers who ask for sensitive information such as PINs, bank account details, or Aadhar numbers via online channels. Legitimate employers will not request this information until after sufficient interaction and interest in hiring you.",
        },
        {
          icon: <FaFlag />,
          title: "Report Abusive Conduct",
          description:
            "Employers must maintain a respectful and professional environment. Any discriminatory or abusive comments regarding race, ethnicity, religion, sexual orientation, or gender should be reported immediately. Your safety and dignity are paramount.",
        },
      ],
    },
  ],
};

// Safety Item Component
const SafetyItem = ({ icon, title, description }) => (
  <div className="flex flex-col items-start space-y-2 p-4 bg-gray-50 rounded-md shadow-sm sm:flex-row sm:space-y-0 sm:space-x-4">
    <div className="text-gray-700 text-3xl">{icon}</div>
    <div>
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

// Section Component
const Section = ({ title, items }) => (
  <div className="p-8 rounded-lg shadow bg-white">
    <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
      {title}
    </h3>
    <div className="space-y-6">
      {items.map((item, idx) => (
        <SafetyItem key={idx} {...item} />
      ))}
    </div>
  </div>
);

// Main Safety Page Component
const SafetySections = () => {
  return (
    <section className="max-w-7xl mx-auto px-8 py-14 mt-14">
      {/* Header */}
      <div className="flex justify-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-orange-900 text-center mb-10">
          {safetyContent.title}
        </h2>
      </div>

      {/* Introduction */}
      <div className="text-center max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto mb-8">
        <p className="text-gray-600 text-justify sm:text-left">
          {safetyContent.introduction}
        </p>
      </div>

      {/* Quick Tips Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-12">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{safetyContent.quickTips}</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-14">
        {safetyContent.sections.map((section, index) => (
          <Section key={index} {...section} />
        ))}
      </div>
    </section>
  );
};

export default SafetySections;
