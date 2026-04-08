import { Link } from "react-router-dom"
import { 
  HiOutlineBriefcase, 
  HiOutlineUsers, 
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineCheckCircle
} from "react-icons/hi"

function HomePage() {
  return (
    <div className="bg-white">
      {/* ── Hero Section ── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600">
              Trusted by 500+ Top Companies
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Find Your <span className="text-indigo-600">Dream Job</span> <br className="hidden md:block" />
            <span className="text-slate-400">&</span> Perfect Candidate
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12">
            The bridge between talent and opportunity. Join our ecosystem to discover verified roles or hire world-class professionals.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Browse Jobs
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Features</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Why Choose JobPortal</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={HiOutlineBriefcase}
              title="Job Opportunities"
              desc="Access thousands of job listings from top companies across various industries."
            />
            <FeatureCard 
              icon={HiOutlineUsers}
              title="Talent Pool"
              desc="Find skilled professionals with verified credentials and experience in their field."
            />
            <FeatureCard 
              icon={HiOutlineShieldCheck}
              title="Secure Process"
              desc="Our verification system ensures legitimate job listings and qualified candidates."
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-slate-100 -z-10"></div>
            
            <Step number="01" title="Create Account" desc="Recruiter or Seeker" />
            <Step number="02" title="Complete Profile" desc="Showcase your best" />
            <Step number="03" title="Browse & Apply" desc="Match with skills" />
            <Step number="04" title="Get Connected" desc="Interview & Hire" />
          </div>
        </div>
      </section>

      {/* ── Call to Action ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Ready to Get Started?</h2>
          <p className="text-indigo-100 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto">
            Join thousands of professionals and companies already using our platform.
          </p>
          <Link
            to="/signup"
            className="inline-flex px-12 py-5 bg-white text-indigo-600 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 active:scale-95"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

// ── Sub-Components ──

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 hover:-translate-y-2 transition-all duration-300">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:border-indigo-100 group-hover:shadow-md transition-all">
        <span className="text-2xl font-black text-indigo-600">{number}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 font-semibold uppercase tracking-tighter">{desc}</p>
    </div>
  )
}

export default HomePage