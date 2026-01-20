'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clock, Users, BarChart3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import { LoginModal } from '@/components/auth/login-modal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/slices/uiSlice';

const features = [
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Easily clock in and out with real-time attendance monitoring.',
  },
  {
    icon: Users,
    title: 'Team Directory',
    description: 'Connect with colleagues and view team information.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track your work hours with detailed statistics and graphs.',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Enterprise-grade security for your workforce data.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGetStarted = () => {
    dispatch(openModal('LOGIN'));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        {/* Animated background shapes */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />
      </div>

      <Navbar isTranslucent />
      <LoginModal />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
              Employee Management Platform
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Streamline Your
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {' '}Workforce Management
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl text-pretty">
              A comprehensive platform for attendance tracking, team collaboration, and workplace insights. 
              Empower your organization with modern workforce tools.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleGetStarted}>
                View Demo
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-sm">Scroll to explore</span>
              <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 p-1">
                <div className="h-2 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative bg-background/80 py-24 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to manage your workforce
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Our platform provides all the tools you need for efficient employee management.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join your organization's workforce platform and start tracking your attendance today.
            </p>
            <div className="mt-8">
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Sign In Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
