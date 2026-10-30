
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Stethoscope,
  Building2,
  Shield,
  Loader2,
  LockKeyhole,
  ArrowRight,
  Mail,
  Activity,
  HeartPulse,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { isValidEmail } from '../../lib/security';

export default function AdminLogin() {
  const navigate = useNavigate();

  // Authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Feedback state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation state
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Hospital branding
  const [siteName, setSiteName] = useState(
    'Charles Kulwa Memorial Hospital'
  );
  const [siteLogo, setSiteLogo] = useState<string | null>(null);

  // Prevent repeated submissions
  const [submitting, setSubmitting] = useState(false);

  // Load public hospital branding
  useEffect(() => {
    let active = true;

    const loadHospitalBranding = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_content')
          .select('site_name, site_logo_url')
          .maybeSingle();

        if (error) {
          console.error('Unable to load hospital branding:', error);
          return;
        }

        if (!active || !data) return;

        if (data.site_name) {
          setSiteName(data.site_name);
        }

        if (
          data.site_logo_url &&
          typeof data.site_logo_url === 'string' &&
          data.site_logo_url.startsWith('https://')
        ) {
          setSiteLogo(data.site_logo_url);
        }
      } catch (err) {
        console.error('Hospital branding error:', err);
      }
    };

    loadHospitalBranding();

    return () => {
      active = false;
    };
  }, []);

  // Email validation
  const emailError = useMemo(() => {
    const normalizedEmail = email.trim();

    if (!touched.email || !normalizedEmail) return null;

    if (!isValidEmail(normalizedEmail)) {
      return 'Please enter a valid email address.';
    }

    return null;
  }, [email, touched.email]);

  // Password validation
  const passwordError = useMemo(() => {
    if (!touched.password || !password) return null;

    if (password.length < 6) {
      return 'Password must contain at least 6 characters.';
    }

    return null;
  }, [password, touched.password]);

  const isFormValid = Boolean(
    email.trim() &&
    isValidEmail(email.trim()) &&
    password.length >= 6
  );

  // Clear messages when editing fields
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError('');
    setSuccess('');
  };

  // =====================================================
  // SECURE ADMIN AUTHENTICATION
  // =====================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || submitting) return;

    setError('');
    setSuccess('');

    setTouched({
      email: true,
      password: true,
    });

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Please enter a valid password.');
      return;
    }

    setLoading(true);
    setSubmitting(true);

    try {
      // STEP 1: Authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (authError || !authData.user) {
        throw new Error('Invalid email or password.');
      }

      const authenticatedUserId = authData.user.id;

      // STEP 2: Verify authenticated identity
      const {
        data: verifiedSession,
        error: sessionError,
      } = await supabase.auth.getUser();

      if (
        sessionError ||
        !verifiedSession.user ||
        verifiedSession.user.id !== authenticatedUserId
      ) {
        throw new Error(
          'Unable to verify your account. Please sign in again.'
        );
      }

      // STEP 3: Verify administrator role
      const {
        data: roleRecord,
        error: roleError,
      } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authenticatedUserId)
        .eq('role', 'admin')
        .maybeSingle();

      // STEP 4: Fail closed
      if (roleError) {
        console.error('Administrator verification failed:', roleError);

        throw new Error(
          'Unable to verify administrator permissions. Please try again.'
        );
      }

      if (!roleRecord || roleRecord.role !== 'admin') {
        throw new Error(
          'Access denied. Your account is not authorized to access the administrator panel.'
        );
      }

      // STEP 5: Clear sensitive form data
      setPassword('');
      setSuccess('Administrator verified. Opening dashboard...');

      // STEP 6: Navigate after verification
      navigate('/admin', { replace: true });

    } catch (err: unknown) {
      // STEP 7: Remove session if verification fails
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Session cleanup failed:', signOutError);
      }

      const message =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please try again.';

      setError(message);
      setPassword('');

    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // =====================================================
  // PASSWORD RECOVERY
  // =====================================================

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      setTouched((current) => ({
        ...current,
        email: true,
      }));

      setError(
        'Enter your valid email address to request password recovery.'
      );
      return;
    }

    if (loading || submitting) return;

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) {
        throw resetError;
      }

      setSuccess(
        'If an account exists for this email, password recovery instructions will be sent.'
      );

    } catch (err) {
      console.error('Password recovery error:', err);

      setError(
        'Unable to process your password recovery request. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ================================================= */}
      {/* LEFT SIDE: HOSPITAL BRANDING                       */}
      {/* ================================================= */}

      <section className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-emerald-950 min-h-screen">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        />

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/85 to-emerald-950/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-emerald-950/20" />

        {/* Decorative elements */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute bottom-20 -left-32 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between min-h-screen w-full p-10 xl:p-14 text-white">

          {/* Hospital identity */}
          <div className="flex items-center gap-4">

            {siteLogo ? (
              <img
                src={siteLogo}
                alt={`${siteName} logo`}
                className="h-14 w-14 object-contain rounded-2xl bg-white/10 border border-white/20 p-1.5 shadow-xl"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-md">
                <span className="text-xl font-bold tracking-tight">CK</span>
              </div>
            )}

            <div>
              <h1 className="text-xl xl:text-2xl font-bold leading-tight tracking-tight">
                {siteName}
              </h1>
              <p className="text-emerald-300 text-xs tracking-[0.25em] font-semibold mt-1">
                HOSPITAL
              </p>
            </div>

          </div>

          {/* Welcome content */}
          <div className="flex-1 flex flex-col justify-center max-w-xl py-12">

            <div className="mb-9">

              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md mb-7 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.18em] text-emerald-100">
                  SECURE ADMINISTRATOR PORTAL
                </span>
              </div>

              <p className="text-emerald-200 text-lg xl:text-xl font-medium italic mb-1">
                "Mahitaji ya Mgonjwa Kwanza"
              </p>

              <p className="text-emerald-300/80 text-sm tracking-wide">
                Patient Needs Come First
              </p>

            </div>

            <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-6 leading-[1.12] tracking-tight">
              Welcome to
              <span className="block text-emerald-300 mt-2">
                {siteName}
              </span>
            </h2>

            <p className="text-emerald-100/85 text-base xl:text-lg leading-relaxed mb-10 max-w-lg">
              Providing compassionate, high-quality healthcare through
              experienced professionals, modern medical technology,
              and patient-centered care.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-3">

              <div className="group flex items-center gap-4 bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 hover:border-emerald-300/30 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-400/15 border border-emerald-300/10 flex items-center justify-center group-hover:bg-emerald-400/25 transition-colors">
                  <Stethoscope className="w-5 h-5 text-emerald-200" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">
                    Qualified Medical Specialists
                  </p>
                  <p className="text-xs text-emerald-200/75 mt-1">
                    Professional patient-centered healthcare
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-emerald-300/50 group-hover:text-emerald-200 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="group flex items-center gap-4 bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 hover:border-emerald-300/30 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-400/15 border border-emerald-300/10 flex items-center justify-center group-hover:bg-emerald-400/25 transition-colors">
                  <Building2 className="w-5 h-5 text-emerald-200" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">
                    Modern Healthcare Facilities
                  </p>
                  <p className="text-xs text-emerald-200/75 mt-1">
                    Integrated hospital management
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-emerald-300/50 group-hover:text-emerald-200 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="group flex items-center gap-4 bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10 hover:border-emerald-300/30 transition-all duration-300">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-400/15 border border-emerald-300/10 flex items-center justify-center group-hover:bg-emerald-400/25 transition-colors">
                  <Shield className="w-5 h-5 text-emerald-200" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">
                    Secure Digital Management
                  </p>
                  <p className="text-xs text-emerald-200/75 mt-1">
                    Protected administrative access
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-emerald-300/50 group-hover:text-emerald-200 group-hover:translate-x-1 transition-all" />
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-emerald-200/70 text-xs border-t border-white/10 pt-5">
            <span>
              © {new Date().getFullYear()} {siteName}
            </span>
            <span className="tracking-wide">
              ALL RIGHTS RESERVED
            </span>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* RIGHT SIDE: ADMIN LOGIN                            */}
      {/* ================================================= */}

      <section className="w-full lg:w-[42%] flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-white to-emerald-50/50 px-5 py-8 sm:px-8 lg:px-10 relative overflow-hidden">

        {/* Subtle background decoration */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">

          {/* Mobile branding */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

            {siteLogo ? (
              <img
                src={siteLogo}
                alt={`${siteName} logo`}
                className="h-12 w-12 object-contain rounded-xl bg-white shadow-md p-1"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-700/20">
                CK
              </div>
            )}

            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {siteName}
              </h1>
              <p className="text-xs text-emerald-700 font-bold tracking-[0.2em] mt-1">
                HOSPITAL
              </p>
            </div>

          </div>

          {/* Authentication card */}
          <div className="bg-white rounded-3xl shadow-[0_20px_70px_-25px_rgba(15,23,42,0.16)] p-6 sm:p-9 border border-gray-100/90">

            {/* Header */}
            <div className="mb-8">

              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 flex items-center justify-center shadow-sm">
                  <LockKeyhole className="w-6 h-6 text-emerald-700" />
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[10px] font-bold tracking-wider text-emerald-800">
                    SECURE ACCESS
                  </span>
                </div>

              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Sign In
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed">
                Welcome back. Sign in using your authorized  credentials.
              </p>

            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div
                role="status"
                aria-live="polite"
                className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{success}</span>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}
              <div>

                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Email Address
                </label>

                <div className="relative group">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    onBlur={() =>
                      setTouched((current) => ({
                        ...current,
                        email: true,
                      }))
                    }
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    placeholder="you@example.com"
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border ${
                      emailError
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-gray-200 bg-gray-50/60 hover:border-gray-300'
                    } focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100`}
                  />

                </div>

                {emailError && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-red-600 text-xs mt-2"
                  >
                    {emailError}
                  </p>
                )}

              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Password
                </label>

                <div className="relative group">

                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />

                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    onBlur={() =>
                      setTouched((current) => ({
                        ...current,
                        password: true,
                      }))
                    }
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    placeholder="Enter your password"
                    disabled={loading}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl border ${
                      passwordError
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-gray-200 bg-gray-50/60 hover:border-gray-300'
                    } focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-emerald-700 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

                {passwordError && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-red-600 text-xs mt-2"
                  >
                    {passwordError}
                  </p>
                )}

              </div>

              {/* Forgot password */}
              <div className="flex justify-end">

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-sm text-emerald-700 hover:text-emerald-900 font-semibold transition-colors disabled:opacity-50"
                >
                  Forgot Password?
                </button>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                aria-busy={loading}
                className="group w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-4 px-5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:shadow-emerald-700/25 hover:-translate-y-0.5 disabled:shadow-none disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
              >

                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying administrator...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In Securely</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}

              </button>

            </form>

            {/* Restricted access divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-bold tracking-[0.18em] whitespace-nowrap">
                RESTRICTED ACCESS
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Security notice */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-emerald-50/50 border border-gray-100 p-4">

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-xl bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Shield className="w-4 h-4 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-800 mb-1">
                    Protected Administrator Area
                  </p>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Contact the hospital
                    system administrator.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="mt-7 text-center space-y-2">

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
              <span>Patient Needs Come First</span>
            </div>

            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>

            <div className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
              <Activity className="w-3 h-3 text-emerald-600" />
              SECURE HOSPITAL ADMINISTRATION PORTAL
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
