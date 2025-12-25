import { Metadata } from 'next';
import { DM_Sans, Instrument_Serif, Archivo_Black } from 'next/font/google';

export const metadata: Metadata = {
  title: 'The Expréss - A to Z Event-ing Service',
  description: 'Full service events, dinner parties, high-level catering, and delivery. Plan your special moment with The Expréss.',
};

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const archivoBlack = Archivo_Black({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
});

export default function LandingPage() {
  return (
    <div className={`${dmSans.variable} ${instrumentSerif.variable} ${archivoBlack.variable} min-h-screen`}>
      {/* Hero Section 1 - Top Nav */}
      <section className="relative w-full h-[650px] bg-[#0D0D0D] overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative h-full">
          {/* Scroll Arrow */}
          <svg 
            className="absolute left-1/2 -translate-x-1/2 bottom-24 w-[11px] h-[98px] opacity-30" 
            width="13" 
            height="99" 
            viewBox="0 0 13 99" 
            fill="none"
          >
            <path 
              opacity="0.3" 
              d="M11.707 93.4239L6.20703 98.5604L0.707031 93.4239M6.20703 97.393V0.500013" 
              stroke="#F2F0EF" 
              strokeLinecap="square"
            />
          </svg>

          {/* Logo Center */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[22px]">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/047698bcd98b22123e255955fb105a7012be9892?width=132" 
              className="w-[66px] h-[66px]" 
              alt="The Expréss Logo"
            />
          </div>

          {/* Navigation Links - Right */}
          <nav className="absolute right-12 top-[22px] inline-flex items-center gap-6">
            <div className="flex flex-col items-start gap-3">
              <NavLink text="Services" />
              <NavLink text="Examples" />
              <NavLink text="Process" />
            </div>
            <div className="flex flex-col items-start gap-3">
              <NavLink text="Pricing" />
              <NavLink text="Local Gems" />
              <NavLink text="Contact us" />
            </div>
          </nav>

          {/* Tagline - Left */}
          <div className="absolute left-12 top-6">
            <h1 className="text-[#F2F0EF] font-[family-name:var(--font-instrument-serif)] text-[32px] italic leading-[100%] max-w-[181px]">
              A to Z event-ing service
            </h1>
            {/* Decorative Star Icon */}
            <div className="absolute left-[83px] top-[42px] w-[18px] h-[18px] rounded-full bg-[#F2F0EF] flex justify-center items-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path 
                  d="M6 0C6.17967 2.13029 7.86971 3.82033 10 4C7.86971 4.17967 6.17967 5.86971 6 8C5.82033 5.86971 4.13029 4.17967 2 4C4.13029 3.82033 5.82033 2.13029 6 0Z" 
                  fill="#0D0D0D"
                />
              </svg>
            </div>
          </div>

          {/* Hero Image Overlay */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-full max-w-[997px] h-[154px] overflow-hidden">
            <img 
              className="w-full h-auto mix-blend-color-dodge object-cover" 
              src="https://api.builder.io/api/v1/image/assets/TEMP/7d9203cffa6a50bc653a98fc16d7b5c61800b1c5?width=2880" 
              alt=""
            />
          </div>
        </div>
      </section>

      {/* Hero Section 2 - Main Dinner Parties */}
      <section className="relative w-full h-[850px] bg-[#0D0D0D] overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative h-full">
          {/* Background Image with Mask */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[89px] w-[699px] h-[699px] overflow-hidden rounded-full">
            <img 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2082px] h-[1228px] object-cover" 
              src="https://api.builder.io/api/v1/image/assets/TEMP/330622d6b7b5501d99dece9e7d7306c70f97129b?width=4164" 
              alt=""
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] rounded-full"></div>
          </div>

          {/* Text Layout Container */}
          <div className="absolute inset-0 flex items-center justify-between px-[115px]">
            {/* Left Text - Full Service Events */}
            <div className="relative z-10 text-left">
              <div className="text-[#F2F0EF] font-[family-name:var(--font-instrument-serif)] text-[56px] italic opacity-30 leading-tight">
                Full
              </div>
              <div className="text-[#F2F0EF] font-[family-name:var(--font-instrument-serif)] text-[56px] italic opacity-30 leading-tight ml-6">
                Service
              </div>
              <div className="text-[#F2F0EF] font-[family-name:var(--font-dm-sans)] text-[28px] opacity-30 leading-normal tracking-[-0.56px] text-right mt-2">
                Events
              </div>
            </div>

            {/* Center Text - Dinner Parties */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
              <h2 className="text-[#F2F0EF] font-[family-name:var(--font-instrument-serif)] text-[160px] italic leading-[0.85] tracking-[-3.2px]">
                Dinner
              </h2>
              <div className="text-[#F2F0EF] font-[family-name:var(--font-dm-sans)] text-[80px] leading-normal tracking-[-1.6px] text-right">
                Parties
              </div>
            </div>

            {/* Right Text - High-Level Catering */}
            <div className="relative z-10 text-right">
              <div className="text-[#F2F0EF] font-[family-name:var(--font-instrument-serif)] text-[56px] italic opacity-30 leading-tight">
                High-Level
              </div>
              <div className="text-[#F2F0EF] font-[family-name:var(--font-instrument-serif)] text-[56px] italic opacity-30 leading-tight mr-6">
                Catering
              </div>
              <div className="text-[#F2F0EF] font-[family-name:var(--font-dm-sans)] text-[28px] opacity-30 leading-normal tracking-[-0.56px] text-right mt-2">
                Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative w-full h-[800px] overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src="https://api.builder.io/api/v1/image/assets/TEMP/c9ebd2e94c19178f8cc935e389957f6fda0b07e4?width=2880" 
          alt="Contact Form"
        />
      </section>

      {/* Calendly Integration Section */}
      <section className="relative w-full h-[900px] bg-[#0D0D0D] overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(80.82%_182.44%_at_51.15%_0%,rgba(225,222,221,0.00)_61.3%,rgba(225,222,221,0.50)_100%)]"></div>

        {/* Background Decorative Image */}
        <img 
          className="absolute inset-0 w-full h-full mix-blend-color-dodge object-cover" 
          src="https://api.builder.io/api/v1/image/assets/TEMP/14c811854d49b4ffb49b03299fc599bf7445a5af?width=2880" 
          alt=""
        />

        <div className="max-w-[1440px] mx-auto relative h-full px-8">
          {/* Heading */}
          <h2 className="absolute left-1/2 -translate-x-1/2 top-[111px] max-w-[627px] text-[#F2F0EF] text-center text-[56px] leading-[100%] tracking-[-1.12px]">
            <span className="font-[family-name:var(--font-dm-sans)]">Would you like to discuss your event </span>
            <span className="font-[family-name:var(--font-instrument-serif)] italic">in personal</span>
            <span className="font-[family-name:var(--font-dm-sans)]">?</span>
          </h2>

          {/* Subtext */}
          <p className="absolute left-1/2 -translate-x-1/2 top-[247px] max-w-[728px] text-[#E6E6E4] text-center font-[family-name:var(--font-dm-sans)] text-[16px] opacity-50">
            Use Calendly to quickly set up a call — whether you want to plan an event or simply ask a question
          </p>

          {/* Calendly Embed Placeholder */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[299px] w-full max-w-[704px] h-[490px] rounded-[15px] overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src="https://api.builder.io/api/v1/image/assets/TEMP/bab16fb3e08bd758a30ea01c0549afc8b837be53?width=1408" 
              alt="Calendly Integration"
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full h-[400px] bg-[#E2E0DF] overflow-hidden">
        {/* Blurred Background Text */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[113px] flex items-center gap-[60px] blur-[10px] whitespace-nowrap">
          <BigTextGradient text="How will you Expréss it?" />
          <StarIconLarge />
          <BigTextGradient text="How will you Expréss it?" />
        </div>

        <div className="max-w-[1440px] mx-auto relative h-full px-12">
          {/* Top Content */}
          <div className="absolute left-12 right-12 top-[40px] flex justify-between items-center">
            <h3 className="text-[#0D0D0D] text-center text-[32px] leading-[100%] tracking-[-0.64px] opacity-80">
              <span className="font-[family-name:var(--font-dm-sans)]">Our specialty is </span>
              <span className="font-[family-name:var(--font-instrument-serif)] italic">your special moment</span>
            </h3>

            <div className="flex items-center gap-[11px]">
              <button className="flex h-[46px] px-4 justify-center items-center rounded-full border border-[rgba(29,29,29,0.32)] backdrop-blur-[16px] hover:bg-[rgba(13,13,13,0.05)] transition-colors">
                <span className="text-[#0D0D0D] text-center font-[family-name:var(--font-dm-sans)] text-[16px] tracking-[-0.32px] opacity-90">
                  Send Inquiry
                </span>
              </button>
              <button className="flex h-[46px] px-4 justify-center items-center rounded-full bg-[#0D0D0D] backdrop-blur-[16px] hover:bg-[#1a1a1a] transition-colors">
                <span className="text-[#F2F0EF] text-center font-[family-name:var(--font-dm-sans)] text-[16px] tracking-[-0.32px] opacity-90">
                  Book a call
                </span>
              </button>
            </div>
          </div>

          {/* Book a Chat Floating Button */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[94px] w-[101px] h-[101px] cursor-pointer hover:scale-105 transition-transform">
            <div className="absolute inset-0 rounded-full bg-white backdrop-blur-[16px] shadow-lg"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0D0D0D] text-center font-[family-name:var(--font-dm-sans)] text-[16px] leading-[100%]">
              Book<br />a chat
            </div>
          </div>

          {/* Logo and Nav Links */}
          <div className="absolute left-12 bottom-[84px] flex items-center gap-8">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/5e44c87c94a4b6bddd96a758c263a588f7b3baa3?width=80" 
              className="w-[40px] h-[40px]" 
              alt="The Expréss Logo"
            />
            <nav className="flex items-center gap-5 flex-wrap">
              <FooterLink text="Services" />
              <FooterLink text="Examples" />
              <FooterLink text="Process" />
              <FooterLink text="Pricing" />
              <FooterLink text="Local Gems" />
              <FooterLink text="Partnership" />
              <FooterLink text="FAQ & Testimonials" />
              <FooterLink text="Contact us" />
            </nav>
          </div>

          {/* Contact Info */}
          <div className="absolute right-12 bottom-[73px] flex items-center gap-5 flex-wrap">
            <a href="tel:832-693-9729" className="text-[#0D0D0D] text-center font-[family-name:var(--font-dm-sans)] text-[14px] underline hover:opacity-70 transition-opacity">
              832-693-9729
            </a>
            <a href="mailto:plan@theexpress.io" className="text-[#0D0D0D] text-center font-[family-name:var(--font-dm-sans)] text-[14px] underline hover:opacity-70 transition-opacity">
              plan@theexpress.io
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#0D0D0D] text-center font-[family-name:var(--font-dm-sans)] text-[14px] underline hover:opacity-70 transition-opacity">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Navigation Link with Star Icon
function NavLink({ text }: { text: string }) {
  return (
    <a href="#" className="flex items-center gap-[5px] group">
      <svg className="w-2 h-2 opacity-30 group-hover:opacity-50 transition-opacity" width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path 
          opacity="0.3" 
          d="M4 0C4.17967 2.13029 5.86971 3.82033 8 4C5.86971 4.17967 4.17967 5.86971 4 8C3.82033 5.86971 2.13029 4.17967 0 4C2.13029 3.82033 3.82033 2.13029 4 0Z" 
          fill="#F2F0EF"
        />
      </svg>
      <span className="text-[#F2F0EF] text-center font-[family-name:var(--font-dm-sans)] text-[14px] group-hover:opacity-80 transition-opacity">
        {text}
      </span>
    </a>
  );
}

// Component: Footer Link
function FooterLink({ text }: { text: string }) {
  return (
    <a href="#" className="text-[#0D0D0D] text-center font-[family-name:var(--font-dm-sans)] text-[14px] opacity-50 hover:opacity-100 transition-opacity whitespace-nowrap">
      {text}
    </a>
  );
}

// Component: Large Gradient Text
function BigTextGradient({ text }: { text: string }) {
  return (
    <div 
      className="text-[150px] leading-normal tracking-[-7.5px] font-[family-name:var(--font-archivo-black)]"
      style={{
        background: 'linear-gradient(135deg, #5A5A5A 0%, #E2DBDB 48.48%, #898787 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {text}
    </div>
  );
}

// Component: Large Star Icon with Gradient
function StarIconLarge() {
  return (
    <div 
      className="flex w-[110px] h-[110px] justify-center items-center rounded-full"
      style={{
        background: 'linear-gradient(135deg, #5A5A5A 0%, #E2DBDB 48.48%, #898787 100%)',
      }}
    >
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
        <path 
          d="M44 0L45.3514 17.6512C46.9629 37.2009 62.7991 53.0371 82.3488 54.6486L100 56L82.3488 57.3514C62.7991 58.9629 46.9629 74.7991 45.3514 94.3488L44 112L42.6486 94.3488C41.0371 74.7991 25.2009 58.9629 5.65116 57.3514L-12 56L5.65116 54.6486C25.2009 53.0371 41.0371 37.2009 42.6486 17.6512L44 0Z" 
          fill="#F2F0EF"
        />
      </svg>
    </div>
  );
}
