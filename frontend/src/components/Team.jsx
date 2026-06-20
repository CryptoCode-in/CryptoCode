import dev from "../assets/images/dev.png";
import ninad from "../assets/images/ninad.png";
import koshti from "../assets/images/koshti.png";
import sai from "../assets/images/sai.png";
import ritesh from "../assets/images/ritesh.png";

const teamMembers = [
  {
    id: 1,
    name: "Dev",
    role: "Project Lead & Architect",
    image: dev,
    link: "https://www.linkedin.com/in/devesh-sonawane-4b7965366/"
  },
  {
    id: 2,
    name: "Ninad",
    role: "Backend Developer",
    image: ninad,
    link: "https://www.linkedin.com/in/ninad-bhad-b8118b327/"
  },
  {
    id: 3,
    name: "Koshti",
    role: "Frontend Developer",
    image: koshti,
    link: "https://www.linkedin.com/in/devesh-koshti-720611395/"
  },
  {
    id: 4,
    name: "Sai",
    role: "UI/UX Designer",
    image: sai,
    link: "https://www.linkedin.com/in/sai-navarkar-0a7991336/"
  },
  {
    id: 5,
    name: "Ritesh",
    role: "Full Stack Developer",
    image: ritesh,
    link: "https://www.linkedin.com/in/ritesh-borse-20b513371/"
  }
];

function Team() {
  return (
    <section id="team" className="sp position-relative" style={{ borderTop: "1px solid var(--bd)" }}>
      {/* Localized style block for custom responsive grid and premium team card layouts */}
      <style dangerouslySetInnerHTML={{__html: `
        #team {
          position: relative;
          overflow: hidden;
          padding: 100px 0; /* Consistent vertical spacing */
        }

        /* Floating Blur Orbs */
        .team-orbs-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }
        .team-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.06;
          pointer-events: none;
        }
        html.light .team-orb {
          opacity: 0.025;
          filter: blur(110px);
        }
        .team-orb-1 {
          top: 15%;
          left: 10%;
          width: 320px;
          height: 320px;
          background: var(--pur);
        }
        .team-orb-2 {
          bottom: 15%;
          right: 15%;
          width: 380px;
          height: 380px;
          background: #3b82f6;
        }

        /* Layout Grid (Desktop Default >= 1200px: 5 cards in a single row) */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
          justify-content: center;
          justify-items: center;
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
        }

        /* Profile Cards base design */
        .team-card {
          width: 100%;
          max-width: 215px;
          height: 100%;
          background: rgba(19, 19, 30, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 24px;
          padding: 32px 20px 24px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          cursor: default;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
        }

        html.light .team-card {
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(124, 58, 237, 0.08);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.6) inset;
        }

        /* Glow border outline overlay */
        .team-card::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.45), rgba(59, 130, 246, 0.45));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .team-card:hover {
          transform: translateY(-10px);
          border-color: transparent;
          box-shadow: 0 20px 40px -15px rgba(139, 92, 246, 0.25), 0 0 25px rgba(139, 92, 246, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
        }

        html.light .team-card:hover {
          box-shadow: 0 20px 40px -15px rgba(124, 58, 237, 0.12), 0 0 25px rgba(124, 58, 237, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
        }

        .team-card:hover::after {
          opacity: 1;
        }

        /* Large circular profile image frames */
        .team-photo-frame {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          position: relative;
          padding: 3px;
          background: linear-gradient(135deg, var(--pur), #3b82f6);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .team-photo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          background: var(--bg3);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-card:hover .team-photo-frame {
          transform: scale(1.06);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.45), 0 0 15px rgba(59, 130, 246, 0.25);
        }

        .team-card:hover .team-photo-frame img {
          transform: scale(1.08);
        }

        /* Typography & Role badges */
        .team-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--tx);
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }

        .team-card:hover .team-name {
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .team-role-badge {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--pur);
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.15);
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
          transition: all 0.3s ease;
          display: inline-block;
        }

        html.light .team-role-badge {
          background: rgba(124, 58, 237, 0.05);
          border: 1px solid rgba(124, 58, 237, 0.1);
        }

        .team-card:hover .team-role-badge {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
          transform: scale(1.02);
        }

        /* Modern SaaS LinkedIn Button styling */
        .team-linkedin-btn {
          width: 100%;
          padding: 10px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--pur), #3b82f6);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: auto;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.25);
          border: none;
          text-decoration: none;
        }

        .team-linkedin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.25);
        }

        .team-linkedin-btn:active {
          transform: translateY(0);
        }

        /* Responsive Grid Layout Rules */
        /* Desktop Screens (>= 1400px) */
        @media (min-width: 1400px) {
          .team-grid {
            max-width: 1280px;
            gap: 28px;
          }
          .team-card {
            max-width: 230px;
          }
        }

        /* Tablet Widths: 3 + 2 Layout */
        @media (min-width: 768px) and (max-width: 1199.98px) {
          .team-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 24px;
            max-width: 820px;
            margin: 0 auto;
          }
          .team-card {
            flex: 0 1 calc(33.333% - 20px);
            min-width: 210px;
            max-width: 240px;
          }
        }

        /* Mobile Widths: Single card per row */
        @media (max-width: 767.98px) {
          .team-grid {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
          }
          .team-card {
            width: 100%;
            max-width: 290px;
          }
        }
      `}} />

      {/* Subtle Background Glow Orbs */}
      <div className="team-orbs-container">
        <div className="team-orb team-orb-1"></div>
        <div className="team-orb team-orb-2"></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* Section Header */}
        <div className="text-center mb-5 rv">
          <span className="slbl">OUR TEAM</span>
          <h2 className="stitle">
            Meet The Minds <span className="gt">Behind CryptoCode</span>
          </h2>
          <p className="ssub mx-auto" style={{ maxWidth: "650px" }}>
            A dedicated team of innovators building the future of secure coding assessments and academic programming platforms.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="team-card rv" 
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Top - circular profile photo frame */}
              <div className="team-photo-frame">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>

              {/* Middle - Name & Role Badge */}
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role-badge">{member.role}</span>

              {/* Bottom - LinkedIn Button */}
              <a 
                href={member.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="team-linkedin-btn"
              >
                <i className="fa-brands fa-linkedin-in" style={{ fontSize: "0.82rem" }}></i>
                <span>View LinkedIn</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
