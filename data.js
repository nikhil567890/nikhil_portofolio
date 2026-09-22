/**
 * NIKHIL // DIGITAL LAB v3 — CENTRAL DATA CONTRACT
 * Single source of truth. Strictly reflects verified resume data.
 * Updated with latest resume: Nlite Solutions Limited & current projects.
 */

export const RESUME_DATA = {
  profile: {
    name: "ATMAKURI NIKHIL",
    handle: "nikhil // digital_lab",
    role: "CSE Data Science Student • Full-Stack Developer • AI & ML Enthusiast",
    status: "SYSTEM ACTIVE // READY FOR CHALLENGES",
    location: "Andhra Pradesh, India",
    email: "nikhilatmakuri275@gmail.com",
    phone: "+91 91827 69155",
    linkedin: "https://linkedin.com/in/nikhil-atmakuri-849033339",
    github: "https://github.com/nikhil567890",
    portfolioUrl: "https://nikhil-atmakuri-portofolio.vercel.app",
    resumeUrl: "./resume.pdf",
    mantra: "BUILDING. LEARNING. EXPLORING.",
    bioShort: "Computer Science (Data Science) undergraduate and Full-Stack Developer with hands-on experience building web & AI applications using Python, React, Node.js, Spring Boot, and Firebase.",
    bioLong: "Computer Science (Data Science) undergraduate and Python Full Stack Developer with hands-on experience building full-stack web applications using Python, Django, React, Node.js, Spring Boot, and Firebase, and AI-powered platforms using Generative AI, Gemini AI, and machine learning. Built and deployed REST API-based applications for hackathon, client, and real-world use cases, with strong skills in databases (MySQL, SQL, Firestore), cloud deployment (AWS S3, Vercel), and problem solving."
  },

  languages: [
    { name: "English", proficiency: "Professional Working" },
    { name: "Telugu", proficiency: "Native" },
    { name: "Hindi", proficiency: "Professional Working" }
  ],

  skills: [
    { id: "python", name: "Python", category: "Core Languages", level: "Advanced", icon: "🐍", color: "#38bdf8", desc: "Full-stack development, Django backend, REST APIs, scripting, data structures & ML integration." },
    { id: "java", name: "Java", category: "Core Languages", level: "Proficient", icon: "☕", color: "#f97316", desc: "Object-Oriented Programming (OOP), multi-threading, collections framework & Spring Boot backend." },
    { id: "cpp", name: "C++", category: "Core Languages", level: "Advanced", icon: "⚡", color: "#60a5fa", desc: "High-performance OOP architecture, memory handling, STL algorithms & problem solving." },
    { id: "c", name: "C", category: "Core Languages", level: "Advanced", icon: "⚙️", color: "#94a3b8", desc: "Procedural logic, pointers, memory management, algorithms & system fundamentals." },
    { id: "react", name: "React & Vite", category: "Web Technologies", level: "Advanced", icon: "⚛️", color: "#22d3ee", desc: "Modern component architecture, hooks, state management, SPA routing & lightning-fast Vite tooling." },
    { id: "js", name: "JavaScript", category: "Web Technologies", level: "Advanced", icon: "📜", color: "#fbbf24", desc: "Modern ES6+, async/await, DOM APIs, event-driven architectures & full-stack integration." },
    { id: "html-css", name: "HTML & CSS", category: "Web Technologies", level: "Mastery", icon: "🎨", color: "#f43f5e", desc: "Semantic DOM, CSS3, Flexbox/Grid, fluid typography, glassmorphism & responsive web design." },
    { id: "django", name: "Django", category: "Backend & Frameworks", level: "Proficient", icon: "🎯", color: "#34d399", desc: "Python web framework, ORM, RESTful API development, authentication & database migrations." },
    { id: "nodejs", name: "Node.js & Express", category: "Backend & Frameworks", level: "Proficient", icon: "🟢", color: "#4ade80", desc: "Asynchronous runtime, Express.js microservices, middleware pipelines & API routing." },
    { id: "spring-boot", name: "Spring Boot", category: "Backend & Frameworks", level: "Proficient", icon: "🍃", color: "#10b981", desc: "Enterprise Java backend, dependency injection, REST controllers & MVC architecture." },
    { id: "firebase", name: "Firebase & Firestore", category: "Databases & Cloud", level: "Advanced", icon: "🔥", color: "#fb923c", desc: "Cloud Firestore, real-time database, Firebase Auth, Cloud Storage & serverless hosting." },
    { id: "ai-data", name: "Gemini AI & ML", category: "AI & Data", level: "Advanced", icon: "🧠", color: "#a78bfa", desc: "Generative AI, Gemini API orchestration, prompt engineering, machine learning & data analysis." }
  ],

  projects: [
    {
      id: "ksp-sahayak",
      title: "KSP Sahayak",
      tagline: "AI-Powered Police Investigation Platform",
      role: "Lead / Full-Stack & AI Developer",
      type: "Hackathon / Self-Learning Project",
      period: "National Hackathon Edition",
      status: "COMPLETED",
      tech: ["React", "Vite", "Express.js", "Firebase", "Gemini AI"],
      demoUrl: "#",
      repoUrl: "https://github.com/nikhil567890",
      worldType: "securityLattice",
      accent: "#38bdf8",
      description: "An AI-assisted crime investigation and analytics platform built with React, Vite, Express.js, Firebase, and Gemini AI to streamline law enforcement workflows.",
      highlights: [
        "Built an AI-assisted crime investigation and analytics platform using React, Vite, Express.js, Firebase, and Gemini AI.",
        "Developed modules for case/FIR management, evidence and suspect tracking, relationship graphs, crime analytics, natural-language queries, and automated investigation reports.",
        "Implemented role-based dashboards, multilingual/voice interaction, audit logging, and data visualization."
      ]
    },
    {
      id: "finaura",
      title: "FINAURA",
      tagline: "AI-Powered Financial Technology Platform",
      role: "Full-Stack Developer",
      type: "Online Hackathon Project",
      period: "Hackathon Project",
      status: "COMPLETED",
      tech: ["React", "Vite", "Node.js", "Financial APIs", "AI Insights"],
      demoUrl: "#",
      repoUrl: "https://github.com/nikhil567890",
      worldType: "dataColumns",
      accent: "#10b981",
      description: "A digital financial platform designed to simplify personal financial management through an intuitive, user-friendly interface with modern web architecture.",
      highlights: [
        "Developed FINAURA, a digital financial platform designed to simplify personal financial management through an intuitive, user-friendly interface.",
        "Implemented core financial features with a modern web architecture, focusing on secure data handling, financial insights, and an interactive user experience.",
        "Designed and integrated responsive dashboards and user-centric workflows to present financial information clearly and efficiently."
      ]
    },
    {
      id: "smart-reminder",
      title: "Smart Reminder",
      tagline: "Context-Aware Automated Reminder & Notification Engine",
      role: "Mobile & Full-Stack Developer",
      type: "PWA & Mobile Application",
      period: "Independent Build",
      status: "COMPLETED",
      tech: ["PWA", "JavaScript", "Web Notifications", "Mobile Packaging"],
      demoUrl: "#",
      repoUrl: "https://github.com/nikhil567890",
      worldType: "clockTorus",
      accent: "#2dd4bf",
      description: "A smart reminder platform built for managing personal reminders, scheduled activities, and automated communication workflows with modern application packaging.",
      highlights: [
        "Developed a smart reminder platform for managing personal reminders and scheduled activities.",
        "Designed contact-based reminders, birthdays, notifications, and automated communication workflows.",
        "Explored PWA-to-Android deployment using modern application packaging technologies.",
        "Implemented a mobile-friendly interface built for smartphone users."
      ]
    },
    {
      id: "village-grievance",
      title: "Community / Village Grievance System",
      tagline: "Citizen-to-Authority Issue Tracking & Resolution Platform",
      role: "Full-Stack Developer",
      type: "Full Stack Web Application",
      period: "Real-World Deployment",
      status: "COMPLETED",
      tech: ["Full Stack", "Firebase", "Firestore", "Web Application"],
      demoUrl: "#",
      repoUrl: "https://github.com/nikhil567890",
      worldType: "decisionTree",
      accent: "#a78bfa",
      description: "A digital platform for submitting, tracking, and managing community grievances, connecting citizens with relevant authorities for improved issue tracking.",
      highlights: [
        "Developed a digital platform for submitting, tracking, and managing community grievances.",
        "Designed workflows connecting citizens with relevant authorities for improved issue tracking.",
        "Implemented a responsive UI and deployed the application for real-world demonstration and evaluation."
      ]
    },
    {
      id: "vinodh-sir-math-classes",
      title: "Vinodh Sir Math Classes",
      tagline: "Educational Android App & RGUKT Mock Test Platform (~100 Users)",
      role: "Client Project / Mobile & Web Developer",
      type: "Client-Based Android App (APK) & Web",
      period: "Client Deliverable • Active Production",
      status: "COMPLETED // 100+ USERS",
      tech: ["Android (APK)", "Web", "Firebase", "Testing Platform", "Client Delivery"],
      demoUrl: "#",
      repoUrl: "https://github.com/nikhil567890",
      worldType: "globe",
      accent: "#f43f5e",
      description: "A production client-based educational solution featuring an Android APK currently used by ~100 active students, along with a mock test series website for RGUKT lecturers.",
      highlights: [
        "Developed and maintained the Vinodh Sir Math Classes Android app (APK) — the main deliverable — now used by around 100 users.",
        "Built a mock test series website for RGUKT lecturers.",
        "Built a promotional website featuring the Vinodh Sir Math Classes APK.",
        "Worked with the client on user requirements, usability, and notifications; supported deployment and ongoing maintenance."
      ]
    }
  ],

  experience: [
    {
      id: "nlite-solutions-internship",
      title: "Python Full Stack Developer Intern",
      organization: "Nlite Solutions Limited",
      period: "6 Months",
      status: "COMPLETED",
      location: "India",
      badge: "PROFESSIONAL MILESTONE",
      description: "Designed and developed full-stack web application projects using Python and the Django framework during an intensive 6-month internship at Nlite Solutions Limited.",
      keyDeliverables: [
        "Designed and developed full-stack web application projects using Python and the Django framework during a 6-month internship.",
        "Worked across frontend, backend/API integration, databases, authentication, cloud storage, and deployment.",
        "Troubleshot and resolved production issues involving hosting, APIs, Firebase, cloud storage, and notifications to improve reliability.",
        "Applied feedback and best practices to improve usability, code quality, and user experience."
      ]
    }
  ],

  education: [
    {
      year: "2028",
      degree: "B.Tech – Computer Science and Engineering",
      specialization: "Data Science Specialization | CGPA: 8.4",
      institution: "MVGR College of Engineering",
      location: "Vizianagaram, Andhra Pradesh",
      status: "2025 – EXPECTED 2028",
      milestone: "Higher Technical Education",
      desc: "Deepening theoretical and applied foundations in Data Science, Machine Learning, Advanced Algorithms, and Software Architecture with an active CGPA of 8.4."
    },
    {
      year: "2025",
      degree: "Diploma in Computer Engineering",
      specialization: "Computer Engineering | Score: 91%",
      institution: "Government Polytechnic",
      location: "Srikakulam, Andhra Pradesh",
      status: "2022 – 2025",
      milestone: "Core Engineering Foundation",
      desc: "Graduated with 91% distinction; built rock-solid foundations in C, C++, Java, Database Management, Computer Networks, and Web Development."
    },
    {
      year: "2022",
      degree: "Secondary Education",
      specialization: "General Science & Mathematics | Score: 96%",
      institution: "Oakland English Medium School",
      location: "Vizianagaram, Andhra Pradesh",
      status: "2017 – 2022",
      milestone: "Academic Foundation",
      desc: "Achieved 96% academic excellence with distinctions in science and mathematics, fostering an early passion for computer engineering."
    }
  ],

  certifications: [
    { title: "Cisco Python Course", issuer: "Cisco Networking Academy", icon: "📜" },
    { title: "Cisco Computer Networks Course", issuer: "Cisco Networking Academy", icon: "🌐" },
    { title: "Cisco AI/ML Course", issuer: "Cisco Networking Academy", icon: "🧠" },
    { title: "Python Full Stack Developer Internship Certificate", issuer: "Nlite Solutions Limited", icon: "💼" }
  ],

  achievements: [
    "Participated in national-level and college-level hackathons.",
    "Developed technology solutions for real-world problem statements across AI, education, community services, and software systems.",
    "Built and deployed an Android app (APK) now actively used by ~100 students."
  ],

  interests: [
    { id: "ai-ml", label: "AI / Machine Learning", category: "Intelligence", icon: "🧠", starPos: [ -3.2, 2.4, -1.0 ] },
    { id: "android", label: "Android Development", category: "Mobile", icon: "🤖", starPos: [ -1.8, 3.6, 0.5 ] },
    { id: "cloud", label: "Cloud Computing", category: "Infrastructure", icon: "☁️", starPos: [ 0.2, 4.0, -1.5 ] },
    { id: "software-eng", label: "Software Engineering", category: "Architecture", icon: "📐", starPos: [ 2.4, 3.2, 0.0 ] },
    { id: "hackathons", label: "Hackathons", category: "Innovation", icon: "🏆", starPos: [ 3.5, 1.8, -1.2 ] },
    { id: "ui-ux", label: "UI / UX Design", category: "Experience", icon: "✨", starPos: [ 3.0, -1.2, 0.8 ] },
    { id: "problem-solving", label: "Problem Solving", category: "Logic", icon: "🧩", starPos: [ 1.5, -2.8, -0.6 ] },
    { id: "emerging-tech", label: "Emerging Tech", category: "Future", icon: "🔮", starPos: [ -0.6, -3.4, 0.4 ] },
    { id: "real-world", label: "Real-World Solutions", category: "Impact", icon: "🌍", starPos: [ -2.6, -2.2, -1.0 ] },
    { id: "learning", label: "Continuous Learning", category: "Growth", icon: "📚", starPos: [ -3.5, -0.4, 0.2 ] }
  ],

  terminal: {
    systemInfo: "NIKHIL_OS [Version 3.4.0-PROD] (x86_64-quantum)\nKernel: WebGL-Three.js Core 0.160.0 | Memory: 64MB VRAM\nType 'help' for available commands or click any quick command below.",
    commands: {
      help: "Available OS commands:\n  • whoami         - Display identity profile & links\n  • role           - Display engineering role & focus\n  • about          - Summary of background & expertise\n  • skills         - Enumerate technical skill matrix\n  • projects       - List verified software projects\n  • experience     - Display professional internships\n  • education      - Display academic credentials & CGPA\n  • certifications - List industry certifications\n  • achievements   - Highlight key awards & builds\n  • interests      - List 10 constellation focal areas\n  • contact        - Direct communication channels\n  • matrix         - Toggle visual matrix rain overlay\n  • sound          - Toggle synthesized audio engine\n  • reboot         - Replay OS ignition sequence\n  • shutdown       - Trigger digital core shutdown\n  • clear          - Clear terminal stdout buffer\n  • exit           - Close terminal HUD drawer",
      whoami: "USER: ATMAKURI NIKHIL\nROLE: CSE Data Science Student • Full-Stack Developer • AI & ML Enthusiast\nSTATUS: Active & Available for Opportunities\nLOCATION: Andhra Pradesh, India\nGITHUB: https://github.com/nikhil567890\nLINKEDIN: https://linkedin.com/in/nikhil-atmakuri-849033339",
      role: "PRIMARY FOCUS: Full-Stack Web (React, Node, Django), Python Engineering, Android Development & Applied AI Systems.",
      about: "ATMAKURI NIKHIL is a B.Tech CSE (Data Science) student at MVGR College of Engineering (CGPA 8.4). Holds a 6-month Python Full Stack Developer Internship certificate from Nlite Solutions Limited, with hands-on builds spanning Django, React, Spring Boot, Firebase, and a client Android application used by ~100 users.",
      skills: "TECHNICAL ARSENAL:\n  [Core Languages]      : Python, Java, C++, C\n  [Web Technologies]    : React, Vite, JavaScript, HTML, CSS\n  [Backend & Services]  : Django, Node.js, Express.js, Spring Boot\n  [Databases & Cloud]   : Firebase, Firestore, MySQL, SQL, AWS S3, Vercel\n  [AI & Data]           : Machine Learning, Generative AI, Gemini AI, Data Analysis\n  [Tools & Other]       : Git, GitHub, VS Code, Figma, PWA",
      languages: "SPOKEN LANGUAGES:\n  • English : Professional Working Proficiency\n  • Telugu  : Native Language\n  • Hindi   : Professional Working Proficiency",
      projects: "SOFTWARE INVENTORY:\n  1. KSP Sahayak               [Lead AI/Full-Stack | Police Investigation Platform]\n  2. FINAURA                   [Full-Stack Dev     | AI-Powered Financial Tech Platform]\n  3. Smart Reminder            [Mobile/PWA Dev     | Adaptive Reminder Engine]\n  4. Village Grievance System  [Full-Stack Dev     | Citizen-to-Authority Platform]\n  5. Vinodh Sir Math Classes   [Client Developer   | Android APK (~100 Users) & RGUKT Web]",
      experience: "PROFESSIONAL MILESTONE:\n  • Python Full Stack Developer Intern\n    Organization : Nlite Solutions Limited\n    Duration     : 6 Months\n    Focus        : Python & Django backend, REST APIs, databases, authentication, Firebase & cloud storage.",
      education: "ACADEMIC CREDENTIALS:\n  • [2028] B.Tech CSE (Data Science), MVGR College of Engineering | CGPA: 8.4\n  • [2025] Diploma in Computer Engineering, Government Polytechnic | 91%\n  • [2022] Secondary Education, Oakland English Medium School | 96%",
      certifications: "CERTIFICATIONS:\n  • Cisco Python Course\n  • Cisco Computer Networks Course\n  • Cisco AI/ML Course\n  • Python Full Stack Developer Internship Certificate (Nlite Solutions Limited)",
      achievements: "ACHIEVEMENTS:\n  • Participated in national-level and college-level hackathons.\n  • Developed technology solutions for real-world problem statements across AI, education, community services, and software systems.\n  • Delivered client Android app used by around 100 active users.",
      interests: "CONSTELLATION FOCUS AREAS:\n  • AI/ML                 • Android Development\n  • Cloud Computing       • Software Engineering\n  • Hackathons            • UI/UX Design\n  • Problem Solving       • Emerging Tech\n  • Real-World Solutions  • Continuous Learning",
      contact: "COMMUNICATION CHANNELS:\n  • Email    : nikhilatmakuri275@gmail.com\n  • Phone    : +91 91827 69155\n  • LinkedIn : https://linkedin.com/in/nikhil-atmakuri-849033339\n  • GitHub   : https://github.com/nikhil567890\n  • Portfolio: https://nikhil-atmakuri-portofolio.vercel.app\n  • Resume   : /resume.pdf"
    }
  }
};
