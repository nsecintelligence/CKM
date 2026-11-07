import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bug, Ribbon, HeartPulse, Flower2, Activity, Apple, ShieldCheck, Brain, Syringe, CheckCircle2, BookOpen, type LucideIcon } from 'lucide-react';
import { healthTopics } from '../data/healthTopics';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';

const iconMap: Record<string, LucideIcon> = {
  Bug,
  Ribbon,
  HeartPulse,
  Flower2,
  Activity,
  Apple,
  ShieldCheck,
  Brain,
  Syringe,
};

export default function HealthTopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const { language, t } = useLanguage();

  const topic = useMemo(() => healthTopics.find((tp) => tp.id === topicId), [topicId]);
  const relatedTips = useMemo(
    () => healthTopics.filter((tp) => tp.id !== topicId).slice(0, 3),
    [topicId],
  );

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('healthTopic.notFound')}</h2>
          <p className="text-gray-600 mb-6">{t('healthTopic.notFoundDesc')}</p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">
            <ArrowLeft className="h-4 w-4" /> {t('healthTopic.back')}
          </Link>
        </div>
      </div>
    );
  }

  const content = topic[language];
  const Icon = iconMap[topic.icon] ?? BookOpen;
  const otherLang = language === 'en' ? 'sw' : 'en';

  return (
    <div className="bg-white">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative container-width py-12 md:py-20">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm font-medium transition" aria-label={t('healthTopic.back')}>
            <ArrowLeft className="h-4 w-4" /> {t('healthTopic.back')}
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md md:h-20 md:w-20">
              <Icon className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div>
              <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">{content.label}</span>
              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight md:text-4xl">{content.summary.split('.')[0]}.</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <section className="section-padding bg-white">
        <div className="container-width max-w-4xl">
          <ScrollReveal animation="fade-up" className="mb-10 md:mb-14">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 md:p-7">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-700" /> {t('healthTopic.summary')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{content.summary}</p>
            </div>
          </ScrollReveal>

          <div className="space-y-10 md:space-y-14">
            {content.sections.map((section, index) => (
              <ScrollReveal key={section.heading} animation="fade-up" delay={Math.min(index * 80, 240)}>
                <article>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-700 text-sm font-bold text-white">{index + 1}</span>
                    <h3 className="text-xl font-bold text-gray-900 md:text-2xl">{section.heading}</h3>
                  </div>
                  <p className="ml-11 text-gray-700 leading-relaxed text-sm md:text-base md:text-lg">{section.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Prevention tips */}
          {content.prevention && content.prevention.length > 0 && (
            <ScrollReveal animation="fade-up" className="mt-12 md:mt-16">
              <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-700" /> {t('healthTopic.prevention')}
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {content.prevention.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-700 md:text-base">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          )}

          {/* Language toggle hint */}
          <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-center text-sm text-gray-600">
            {language === 'en'
              ? <>This article is also available in Kiswahili — toggle the language switcher in the top bar.</>
              : <>Makala hii ipo pia kwa Kiingereza — badilisha lugha kwenye sehemu ya juu ya ukurasa.</>}
          </div>
        </div>
      </section>

      {/* Related tips */}
      {relatedTips.length > 0 && (
        <section className="bg-gray-50 py-12 md:py-16 border-t border-gray-100">
          <div className="container-width">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">{t('healthTopic.relatedTips')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTips.map((rel, index) => {
                const RelIcon = iconMap[rel.icon] ?? BookOpen;
                const relContent = rel[language];
                return (
                  <ScrollReveal key={rel.id} animation="fade-up" delay={Math.min(index * 100, 200)}>
                    <Link
                      to={`/health-topic/${rel.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                        <RelIcon className="h-6 w-6 text-green-700" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-green-700">{relContent.label}</span>
                      <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-green-800">{relContent.summary.split('.')[0]}.</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-600">{relContent.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700 transition group-hover:gap-2">
                        {t('home.healthTips.readArticle')} <ArrowLeft className="h-4 w-4 rotate-180" />
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
