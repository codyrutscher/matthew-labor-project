'use client';

// Star icon component
const StarIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.3" d="M4 0C4.17967 2.13029 5.86971 3.82033 8 4C5.86971 4.17967 4.17967 5.86971 4 8C3.82033 5.86971 2.13029 4.17967 0 4C2.13029 3.82033 3.82033 2.13029 4 0Z" fill="currentColor"/>
  </svg>
);

// Large star icon
const LargeStar = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="18" height="18" rx="9" fill="#F2F0EF"/>
    <path d="M9 3C9.26951 6.19543 11.8046 8.73049 15 9C11.8046 9.26951 9.26951 11.8046 9 15C8.73049 11.8046 6.19543 9.26951 3 9C6.19543 8.73049 8.73049 6.19543 9 3Z" fill="#0D0D0D"/>
  </svg>
);

export default function TestPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F2F0EF] overflow-x-hidden -m-8">
      {/* Hero Section 1 */}
      <section className="relative min-h-[650px] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-12 py-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-2xl md:text-3xl">A to Z event-ing service</span>
            <LargeStar className="ml-2" />
          </div>
          
          {/* Nav Links */}
          <nav className="hidden md:flex gap-6">
            <div className="flex flex-col gap-3">
              <NavLink>Services</NavLink>
              <NavLink>Examples</NavLink>
              <NavLink>Process</NavLink>
            </div>
            <div className="flex flex-col gap-3">
              <NavLink>Pricing</NavLink>
              <NavLink>Local Gems</NavLink>
              <NavLink>Contact us</NavLink>
            </div>
          </nav>
        </header>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <svg width="13" height="99" viewBox="0 0 13 99" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
            <path d="M11.707 93.4239L6.20703 98.5604L0.707031 93.4239M6.20703 97.393V0.500013" stroke="#F2F0EF" strokeLinecap="square"/>
          </svg>
        </div>
      </section>

      {/* Hero Section 2 - Main Title */}
      <section className="relative min-h-[850px] flex items-center justify-center overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Content */}
        <div className="relative z-20 text-center px-4">
          {/* Side text - left */}
          <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-left opacity-30">
            <p className="font-serif italic text-3xl md:text-5xl">Full</p>
            <p className="font-serif italic text-3xl md:text-5xl ml-4">Service</p>
            <p className="text-xl md:text-2xl ml-16 tracking-tight">Events</p>
          </div>

          {/* Main title */}
          <div className="relative">
            <h1 className="font-serif italic text-7xl md:text-[160px] tracking-tight leading-none">
              Dinner
            </h1>
            <p className="text-4xl md:text-7xl tracking-tight mt-2 md:mt-4 ml-auto text-right max-w-fit">
              Parties
            </p>
          </div>

          {/* Side text - right */}
          <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-right opacity-30">
            <p className="font-serif italic text-3xl md:text-5xl">High-Level</p>
            <p className="font-serif italic text-3xl md:text-5xl ml-8">Catering</p>
            <p className="text-xl md:text-2xl ml-16 tracking-tight">Delivery</p>
          </div>
        </div>
      </section>

      {/* Calendly Section */}
      <section className="relative min-h-[900px] flex flex-col items-center justify-center px-4 py-16">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[rgba(225,222,221,0.5)]" />
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl leading-tight mb-4">
            <span>Would you like to discuss your event </span>
            <span className="font-serif italic">in personal</span>
            <span>?</span>
          </h2>
          <p className="text-[#E6E6E4] opacity-50 mb-8">
            Use Calendly to quickly set up a call — whether you want to plan an event or simply ask a question
          </p>
          
          {/* Calendly placeholder */}
          <div className="bg-white/10 rounded-2xl w-full max-w-[704px] h-[490px] mx-auto flex items-center justify-center">
            <p className="text-white/50">Calendly Integration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#E2E0DF] text-[#0D0D0D] py-16 px-6 md:px-12">
        {/* Top content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <p className="text-2xl md:text-3xl opacity-80">
            <span>Our specialty is </span>
            <span className="font-serif italic">your special moment</span>
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-3 rounded-full border border-[#1D1D1D]/30 text-sm hover:bg-black/5 transition">
              Send Inquiry
            </button>
            <button className="px-4 py-3 rounded-full bg-[#0D0D0D] text-[#F2F0EF] text-sm hover:bg-black/80 transition">
              Book a call
            </button>
          </div>
        </div>

        {/* Big blurred text */}
        <div className="overflow-hidden py-8 -mx-6 md:-mx-12">
          <div className="flex items-center gap-16 animate-marquee whitespace-nowrap blur-sm">
            <span className="text-6xl md:text-[150px] font-black tracking-tighter bg-gradient-to-br from-[#5A5A5A] via-[#E2DBDB] to-[#898787] bg-clip-text text-transparent">
              How will you Expréss it?
            </span>
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#5A5A5A] via-[#E2DBDB] to-[#898787] flex items-center justify-center flex-shrink-0">
              <svg width="55" height="55" viewBox="0 0 88 88" fill="none">
                <path d="M44 0L45.15 13.65C46.46 29.2 58.8 41.54 74.35 42.85L88 44L74.35 45.15C58.8 46.46 46.46 58.8 45.15 74.35L44 88L42.85 74.35C41.54 58.8 29.2 46.46 13.65 45.15L0 44L13.65 42.85C29.2 41.54 41.54 29.2 42.85 13.65L44 0Z" fill="#F2F0EF"/>
              </svg>
            </div>
            <span className="text-6xl md:text-[150px] font-black tracking-tighter bg-gradient-to-br from-[#5A5A5A] via-[#E2DBDB] to-[#898787] bg-clip-text text-transparent">
              How will you Expréss it?
            </span>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-8">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="w-10 h-10 bg-[#0D0D0D] rounded-full" />
            <nav className="flex flex-wrap gap-5 text-sm opacity-50">
              <a href="#" className="hover:opacity-100 transition">Services</a>
              <a href="#" className="hover:opacity-100 transition">Examples</a>
              <a href="#" className="hover:opacity-100 transition">Process</a>
              <a href="#" className="hover:opacity-100 transition">Pricing</a>
              <a href="#" className="hover:opacity-100 transition">Local Gems</a>
              <a href="#" className="hover:opacity-100 transition">Partnership</a>
              <a href="#" className="hover:opacity-100 transition">FAQ & Testimonials</a>
              <a href="#" className="hover:opacity-100 transition">Contact us</a>
            </nav>
          </div>
          
          <div className="flex gap-5 text-sm underline">
            <a href="tel:832-693-9729">832-693-9729</a>
            <a href="mailto:plan@theexpress.io">plan@theexpress.io</a>
            <a href="#">Instagram</a>
          </div>
        </div>

        {/* Book a chat button */}
        <div className="absolute right-1/2 translate-x-1/2 md:right-[710px] md:translate-x-0 top-[94px]">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-center text-sm backdrop-blur-lg">
            Book<br/>a chat
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Nav link component
function NavLink({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-[#F2F0EF]">
      <StarIcon className="text-[#F2F0EF]" />
      <span>{children}</span>
    </div>
  );
}
