import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const founders = [
  {
    name: "Rannadeer Kumar Seetha",
    role: "Product Vision and Systems Engineering",
    image: "/images/team/rannadeer-kumar-seetha.png",
    description:
      "Drives product vision and system architecture across the drone platform, onboard computing, computer vision and the DronAI web platform.",
    phone: "+91 85199 47343",
    phoneLink: "+918519947343",
  },
  {
    name: "Nanda Kisore",
    role: "Team Leadership",
    image: "/images/team/nanda-kisore.png",
    description:
      "Leads the DronAI team and coordinates development across the hardware, software and AI workstreams of the Vayuraksha initiative.",
    phone: "+91 91213 09886",
    phoneLink: "+919121309886",
  },
];

export default function Team() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative scroll-mt-24 bg-background py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="section-label">Our Team</p>
          <h2 id="team-heading" className="text-display font-black text-white mb-6">
            Our Founders <span className="text-gradient-green">and Mentor</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Meet the people behind DronAI and Vayuraksha, bringing together
            product vision, engineering and research guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {founders.map((founder) => (
            <article
              key={founder.name}
              className="glass rounded-3xl p-6 sm:p-8 flex flex-col items-start"
            >
              <Image
                src={founder.image}
                alt={founder.name}
                width={160}
                height={160}
                className="rounded-full border-2 border-accent-green/40 mb-6"
              />
              <p className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Founder
              </p>
              <h3 className="text-white text-2xl font-bold mb-2">{founder.name}</h3>
              <p className="text-accent-green text-sm mb-5">{founder.role}</p>
              <p className="text-text-secondary leading-relaxed mb-6 flex-1">
                {founder.description}
              </p>
              <a
                href={`tel:${founder.phoneLink}`}
                aria-label={`Call ${founder.name} at ${founder.phone}`}
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-green transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green focus-visible:outline-offset-4"
              >
                <Phone size={16} aria-hidden="true" />
                {founder.phone}
              </a>
            </article>
          ))}
        </div>

        <article className="glass-green rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start gap-8">
          <Image
            src="/images/team/dr-k-vijayalakshmi.png"
            alt="Dr. K. Vijayalakshmi"
            width={160}
            height={160}
            className="rounded-full border-2 border-accent-green/40 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Mentor and Faculty Advisor
            </p>
            <h3 className="text-white text-2xl font-bold mb-2">Dr. K. Vijayalakshmi</h3>
            <p className="text-accent-green text-sm mb-2">
              Assistant Professor, Computational Intelligence
            </p>
            <p className="text-text-secondary text-sm mb-5">
              SRM Institute of Science and Technology
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              Provides guidance and mentorship in the initiative&apos;s development,
              technical direction, research discipline, product strategy and
              long-term vision.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <a
                href="mailto:vijaylak@srmist.edu.in"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-green transition-colors break-all rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green focus-visible:outline-offset-4"
              >
                <Mail size={16} className="shrink-0" aria-hidden="true" />
                vijaylak@srmist.edu.in
              </a>
              <a
                href="tel:+918681998954"
                aria-label="Call Dr. K. Vijayalakshmi at +91 86819 98954"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-green transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green focus-visible:outline-offset-4"
              >
                <Phone size={16} aria-hidden="true" />
                +91 86819 98954
              </a>
            </div>
          </div>
        </article>

        <div
          id="contact"
          className="scroll-mt-24 mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h3 className="text-white text-xl font-bold mb-3">Connect with DronAI</h3>
            <p className="text-text-secondary max-w-xl leading-relaxed mb-4">
              Get in touch for research collaborations, agricultural pilots and
              technology partnerships.
            </p>
            <p className="flex items-center gap-2 text-text-secondary text-sm">
              <MapPin size={16} aria-hidden="true" />
              Chennai, Tamil Nadu, India
            </p>
          </div>
          <a href="mailto:dronAi@hotmail.com" className="btn-primary w-fit break-all">
            <Mail size={18} className="shrink-0" aria-hidden="true" />
            dronAi@hotmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
