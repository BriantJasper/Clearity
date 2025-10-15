import { Code, Palette, Zap, Heart, Github, Linkedin, Instagram } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export default function AboutSection() {
  const teamMembers: TeamMember[] = [
    {
      name: "Reyner Orlando",
      role: "Leader",
      image: "../public/images/reyner.jpg",
      bio: "Full-stack developer with passion for creating intuitive user experiences",
      socials: {
        github: "https://github.com/reyner-orlando",
        linkedin: "https://www.linkedin.com/in/reyner-orlando/",
        instagram: "https://www.instagram.com/reyner67/"
      }
    },
    {
      name: "Excel Viryan",
      role: "UI/UX Designer",
      image: "../public/images/excel.jpeg",
      bio: "Designer focused on beautiful and functional interfaces",
      socials: {
        github: "https://github.com/Viry16",
        linkedin: "https://www.linkedin.com/in/excel-viryan-69717631b",
        instagram: "https://www.instagram.com/excelviryan12/"
      }
    },
    {
      name: "Kevin Syonin",
      role: "Frontend Engineer",
      image: "../public/images/kevin.jpeg",
      bio: "React specialist building performant web applications",
      socials: {
        github: "https://github.com/HuangMingZhi0206",
        linkedin: "https://www.linkedin.com/in/kevin-syonin/",
        instagram: "https://www.instagram.com/kevinsyonin/"
      }
    },
    {
      name: "Briant Jasper",
      role: "Backend Developer",
      image: "../public/images/briant.jpeg",
      bio: "Building robust and scalable backend systems",
      socials: {
        github: "https://github.com/BriantJasper",
        linkedin: "https://www.linkedin.com/in/briant-jasper-a4a0b82a9/",
        instagram: "https://www.instagram.com/briantjasper/"
      }
    }
  ];

  const techStack = [
    { icon: Code, name: "TypeScript", color: "from-blue-400 to-blue-600" },
    { icon: Palette, name: "Tailwind CSS", color: "from-cyan-400 to-cyan-600" },
    { icon: Zap, name: "React", color: "from-purple-400 to-purple-600" },
  ];

  return (
    <section
      id="about"
      className="min-h-screen py-20 px-6 bg-gradient-to-b from-white via-cyan-50/20 to-blue-50/30 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 px-5 py-2.5 rounded-full text-sm font-medium border border-cyan-100 mb-4">
            <Heart className="w-4 h-4" />
            <span>About Clearity</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Built with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Modern Tech
            </span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Clearity is a browser-based image editor designed to make photo editing simple, 
            fast, and accessible to everyone. No downloads, no sign-ups—just pure creativity.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {techStack.map(({ icon: Icon, name, color }, index) => (
            <div
              key={name}
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 hover:-translate-y-1 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-800 font-semibold text-lg">{name}</span>
            </div>
          ))}
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-20 border border-gray-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Why Clearity?
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong className="text-gray-900">Clearity</strong> was born from the idea that powerful 
                image editing shouldn't require expensive software or complicated installations. We believe 
                everyone should have access to professional-grade editing tools right in their browser.
              </p>
              <p>
                Built with modern web technologies including <strong className="text-cyan-600">React</strong>, 
                <strong className="text-blue-600"> TypeScript</strong>, and 
                <strong className="text-cyan-600"> Tailwind CSS</strong>, Clearity delivers a seamless 
                editing experience with lightning-fast performance.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Our mission is to democratize image editing by providing a free, privacy-first platform 
                that works entirely in your browser. No data leaves your device—everything is processed 
                locally for maximum security and speed.
              </p>
              <p>
                Whether you're a professional designer, content creator, or just someone who wants to 
                enhance their photos, Clearity provides the tools you need with an interface you'll love.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Team
            </span>
          </h3>
          <p className="text-gray-600 text-lg">
            The passionate people behind Clearity
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-cyan-200 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Social Links - appear on hover */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-cyan-400 hover:text-white transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.socials.instagram && (
                    <a
                      href={member.socials.instagram}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-cyan-400 hover:text-white transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-2">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {member.name}
                </h4>
                <p className="text-sm font-medium text-cyan-600">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-12 border border-cyan-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Editing?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Clearity for their image editing needs. 
            Start creating beautiful images today—completely free!
          </p>
          <a
            href="../editor"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-300"
          >
            <Zap className="w-5 h-5" />
            Try Clearity Now
          </a>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}