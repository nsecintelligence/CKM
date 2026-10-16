import { useState } from 'react';
import { ExternalLink, Calendar, Clock, Stethoscope, Phone, Mail, MapPin, ChevronRight, UserRound, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

export default function Clinic() {
  const timetableUrl = 'https://timetable.ckmhospital.org';
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const contactCards = [
    { icon: Phone, title: 'Piga Simu', text: '+255 786 013 232 / +255 756 339 619', accent: 'emerald' },
    { icon: Mail, title: 'Tuma Ujumbe', text: 'Wasiliana nasi kupitia fomu ya mawasiliano.', accent: 'sky' },
    { icon: MapPin, title: 'Fika Hospitali', text: 'Runzewe Wilayani Bukombe Mkoani Geita', accent: 'amber' },
  ];

  const accentMap: Record<string, { bg: string; text: string; ring: string; hoverBg: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', hoverBg: 'group-hover:bg-emerald-100' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-200', hoverBg: 'group-hover:bg-sky-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200', hoverBg: 'group-hover:bg-amber-100' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />

        {/* Floating decorative shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/5 blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative container-width section-padding py-16 md:py-24 text-center">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-5 border border-white/20">
              <Stethoscope className="w-4 h-4" />
              Specialist Clinic
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Madaktari Bingwa
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Tazama ratiba ya madaktari bingwa wetu. Piga simu au fika hospitali kwa miadi.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={300}>
            <a
              href={timetableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 bg-white text-emerald-700 px-7 py-4 rounded-xl font-semibold shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
              View Hospital Timetable
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Timetable Portal Card */}
      <section className="bg-white -mt-8 relative z-10">
        <div className="container-width">
          <ScrollReveal animation="scale">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center overflow-hidden relative">
              {/* Decorative gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600" />

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Hospital Timetable Portal</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                Our full specialist doctor timetable is available on our dedicated timetable portal.
                Click the button below to view the complete schedule.
              </p>
              <a
                href={timetableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                <ExternalLink className="w-5 h-5 transition-transform group-hover:rotate-12" />
                Open timetable.ckmhospital.org
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How to Get an Appointment */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-50 section-padding">
        <div className="container-width">
          <ScrollReveal animation="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <UserRound className="w-4 h-4" />
              Miadi
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Jinsi ya Kupata Miadi</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Piga simu au fika hospitali kupata miadi na daktari bingwa wetu.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactCards.map((card, i) => {
              const accent = accentMap[card.accent];
              const Icon = card.icon;
              return (
                <ScrollReveal key={i} animation="fade-up" delay={i * 120}>
                  <div
                    className="group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1"
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`w-14 h-14 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center mb-5 ring-4 ${accent.ring} transition-all duration-300 ${hoveredCard === i ? 'scale-110' : ''} ${accent.hoverBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal animation="fade-up" delay={400} className="text-center mt-10">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-7 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
              Wasiliana Nasi
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
