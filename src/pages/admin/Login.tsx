
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

        // Only allow HTTPS image sources.
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

  // Validate before submitting
  const isFormValid = Boolean(
    email.trim() &&
    isValidEmail(email.trim()) &&
    password.length >= 6
  );

  // Clear previous messages when the user edits fields
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
      // STEP 1: Authenticate using Supabase Auth.
      // Never authenticate using localStorage or React state.

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (authError || !authData.user) {
        throw new Error('Invalid email or password.');
      }

      const authenticatedUserId = authData.user.id;

      // STEP 2: Confirm the identity with Supabase Auth.
      // This retrieves the authenticated user from the Auth server.

      const {
        data: verifiedSession,
        error: sessionError,
      } = await supabase.auth.getUser();

      if (
        sessionError ||
        !verifiedSession.user ||
        verifiedSession.user.id !== authenticatedUserId
      ) {
        throw new Error('Unable to verify your account. Please sign in again.');
      }

      // STEP 3: Verify the administrator role against the database.
      // The query is tied to the authenticated UUID.
      // RLS must allow users to read ONLY their own role.

      const {
        data: roleRecord,
        error: roleError,
      } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authenticatedUserId)
        .eq('role', 'admin')
        .maybeSingle();

      // STEP 4: Fail closed.
      // Any database verification failure means no admin access.

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

      // STEP 5: Clear sensitive form data.

      setPassword('');
      setSuccess('Administrator verified. Opening dashboard...');

      // STEP 6: Navigate only after successful role verification.

      navigate('/admin', { replace: true });

    } catch (err: unknown) {
      // STEP 7: Remove the authenticated session if any
      // part of the administrator verification process fails.

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

      setError('Enter your valid email address to request password recovery.');
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

      // Generic response to avoid exposing account existence.
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
    <div className="min-h-screen flex bg-gray-50">

      {/* ================================================= */}
      {/* LEFT SIDE: HOSPITAL BRANDING                       */}
      {/* ================================================= */}

      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-emerald-950">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-900/90 to-emerald-950/95" />

        <div className="relative z-10 flex flex-col justify-between h-full w-full p-10 xl:p-14 text-white">

          {/* Hospital identity */}

          <div className="flex items-center gap-4">

            {siteLogo ? (
              <img
                src={siteLogo}
                alt={`${siteName} logo`}
                className="h-14 w-14 object-contain rounded-xl bg-white/10 p-1"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <span className="text-xl font-bold">CK</span>
              </div>
            )}

            <div>
              <h1 className="text-xl xl:text-2xl font-bold leading-tight">
                Charles Kulwa Memorial
              </h1>
              <p className="text-emerald-200 text-sm tracking-wide">
                HOSPITAL
              </p>
            </div>

          </div>

          {/* Welcome content */}

          <div className="flex-1 flex flex-col justify-center max-w-xl">

            <div className="mb-8">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
                <Shield className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-semibold tracking-wider text-emerald-100">
                  SECURE ADMINISTRATOR PORTAL
                </span>
              </div>

              <p className="text-emerald-200 text-lg font-medium italic mb-1">
                "Mahitaji ya Mgonjwa Kwanza"
              </p>

              <p className="text-emerald-300 text-sm">
                Patient Needs Come First
              </p>

            </div>

            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block text-emerald-300">
                {siteName}
              </span>
            </h2>

            <p className="text-emerald-100 text-base xl:text-lg leading-relaxed mb-10 max-w-lg">
              Providing compassionate, high-quality healthcare through
              experienced professionals, modern medical technology,
              and patient-centered care.
            </p>

            {/* Feature cards */}

            <div className="space-y-4">

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-emerald-200" />
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    Qualified Medical Specialists
                  </p>
                  <p className="text-xs text-emerald-200 mt-1">
                    Professional patient-centered healthcare
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-200" />
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    Modern Healthcare Facilities
                  </p>
                  <p className="text-xs text-emerald-200 mt-1">
                    Integrated hospital management
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-200" />
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    Secure Digital Hospital Management
                  </p>
                  <p className="text-xs text-emerald-200 mt-1">
                    Protected administrative access
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Copyright */}

          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>
              © {new Date().getFullYear()} {siteName}
            </span>
            <span>All Rights Reserved.</span>
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* RIGHT SIDE: ADMIN LOGIN                            */}
      {/* ================================================= */}

      <div className="w-full lg:w-[42%] flex items-center justify-center p-4 sm:p-8 lg:p-10">

        <div className="w-full max-w-md">

          {/* Mobile branding */}

          <div className="lg:hidden flex items-center justify-center gap-3 mb-9">

            {siteLogo ? (
              <img
                src={siteLogo}
                alt={`${siteName} logo`}
                className="h-12 w-12 object-contain rounded-xl bg-white shadow-sm p-1"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg">
                CK
              </div>
            )}

            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Charles Kulwa Memorial
              </h1>
              <p className="text-sm text-emerald-700 font-semibold">
                HOSPITAL
              </p>
            </div>

          </div>

          {/* Authentication card */}

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-6 sm:p-9 border border-gray-100">

            {/* Header */}

            <div className="mb-8">

              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                <LockKeyhole className="w-6 h-6 text-emerald-700" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Administrator Sign In
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed">
                Sign in with your authorized hospital administrator credentials.
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
                <span>{error}</span>
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
                <span>{success}</span>
              </div>
            )}

            {/* Login form */}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email */}

              <div>

                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

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
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${
                      emailError
                        ? 'border-red-400'
                        : 'border-gray-200'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50`}
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
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">

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
                    className={`w-full px-4 py-3.5 pr-12 rounded-xl border ${
                      passwordError
                        ? 'border-red-400'
                        : 'border-gray-200'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50`}
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
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >

                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying administrator...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In Securely</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}

              </button>

            </form>

            {/* Security notice */}

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-semibold tracking-wider">
                RESTRICTED ACCESS
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">

              <div className="flex items-start gap-3">

                <Shield className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />

                <p className="text-xs text-gray-600 leading-relaxed">
                  This portal is restricted to accounts assigned the
                  administrator role. Access is verified against the
                  hospital authorization database. Contact the hospital
                  system administrator if you require access.
                </p>

              </div>

            </div>

          </div>

          {/* Footer */}

          <div className="mt-6 text-center space-y-2">

            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>

            <p className="text-xs text-gray-400">
              Secure Hospital Administration Portal
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
