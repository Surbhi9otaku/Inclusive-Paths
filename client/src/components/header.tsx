import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle, ContrastToggle } from "./theme-toggle";
import { Menu, X, Phone, Shield, MapPin, Users, BookOpen, Mic, Home } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trip-planner", label: "Plan Trip", icon: MapPin },
  { href: "/accessibility-map", label: "Explore", icon: MapPin },
  { href: "/volunteers", label: "Volunteers", icon: Users },
  { href: "/blog", label: "Blog", icon: BookOpen },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold" data-testid="text-logo">Knight Guide</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="gap-2"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/emergency">
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2 font-semibold"
                data-testid="button-sos"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">SOS</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              className="gap-2"
              data-testid="button-voice-assist"
              aria-label="Voice assistant"
            >
              <Mic className="h-4 w-4" />
            </Button>

            <ContrastToggle />
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
