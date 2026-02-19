import React from "react";
import useLogin from "./useLogin";
import { AnimatedGrid } from "./AnimatedGrid";
import { GlassCard } from "./GlassCard";
import { PasswordInput } from "./PasswordInput";
import { FloatingParticles } from "../../../src/utils/FloatingParticles.jsx";
import { useSelector } from "react-redux";

const AuthForm: React.FC = () => {
  const { form, onSubmit, loading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // Get siteConfig (admin first, then user fallback)
  const adminSiteConfig = useSelector((state: any) => state.admin?.siteConfig);
  const userSiteConfig = useSelector((state: any) => state.user?.siteConfig);
  const siteConfig = adminSiteConfig || userSiteConfig || {};
  const baseHeight = siteConfig.logoSize || 4; // rem

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#0a0b1a] to-[#0a0616] text-white">
      <AnimatedGrid />

      <FloatingParticles />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2 md:gap-10 lg:py-16">
        {/* Left: Branding */}
        <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
          {/* {siteConfig.logo && (
            <img
              src={siteConfig.logo}
              alt={siteConfig.siteName || "CRM Logo"}
              className="mb-6 rounded-xl ring-1 ring-white/10 object-contain"
              style={{ height: `${baseHeight * 1.2}rem`, width: `${baseHeight * 1.2}rem` }}
            />
          )} */}

          <h1 className="bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            {/* Admin Portal */}

          {siteConfig?.logo && (
            <img
              src={siteConfig.logo}
              alt={siteConfig?.siteName || "Logo"}
              className="object-contain w-44"
              style={{ height: `${baseHeight}rem` }} // main logo height
            />
          )}
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/70">
            Real-time market data, advanced analytics, and client management — in one elegant
            dashboard.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur">
              Approved
            </span>
            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300 backdrop-blur">
              Pending
            </span>
            <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-300 backdrop-blur">
              Rejected
            </span>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex items-center justify-center">
          <GlassCard className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Admin Login
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/70"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/30"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-rose-300">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/70"
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  registration={register("password")}
                  error={errors.password?.message as string | undefined}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600/50 to-fuchsia-600/50 px-4 py-3 font-semibold text-white shadow-2xl backdrop-blur transition hover:from-indigo-600/70 hover:to-fuchsia-600/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
                    Please wait…
                  </span>
                ) : (
                  "Login"
                )}
                <span
                  className="absolute inset-0 -z-10 opacity-0 blur-2xl transition will-change-transform group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(40% 60% at 50% 50%, rgba(99,102,241,0.35), rgba(236,72,153,0.15) 70%, transparent 80%)",
                  }}
                />
              </button>

              {/* Server error */}
              {errors.root?.message && (
                <p className="text-center text-sm font-medium text-rose-300">
                  {errors.root.message as string}
                </p>
              )}
            </form>

            <div className="mt-8 text-center text-xs text-white/50">
              &copy; {new Date().getFullYear()} Admin Portal. All rights reserved.
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
