import { useEffect, useState } from 'react';
import { Stethoscope, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service } from '../types';
import ScrollReveal from '../components/ScrollReveal';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      if (data) setServices(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-emerald-700 to-green-800 text-white overflow-hidden py-16 md:py-20">
        <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative container-width text-center">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-5 border border-white/20">
              <Stethoscope className="w-4 h-4" />
              Services
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Services</h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/80 text-lg max-w-xl mx-auto">Comprehensive healthcare services tailored to your needs.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Service Cards */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.id} animation="fade-up" delay={i * 100}>
                <div className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-emerald-200">
                  {service.image_url && (
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Stethoscope className="w-5 h-5 text-green-700" />
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {!service.image_url && <Stethoscope className="w-5 h-5 text-green-700 flex-shrink-0" />}
                      <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-green-700">{service.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                    {service.details && (
                      <p className="text-gray-500 text-sm mt-3 leading-relaxed">{service.details}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {services.length > 0 && (
            <ScrollReveal animation="fade-up" delay={300} className="text-center mt-12">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white px-7 py-4 rounded-xl font-semibold shadow-lg shadow-green-700/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Book an Appointment
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}
