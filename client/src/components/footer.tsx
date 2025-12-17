import { Link } from "wouter";
import { Shield, Heart, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Knight Guide</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making travel accessible for everyone. Because accessibility is not a privilege, it's a right.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Footer navigation">
              <Link href="/trip-planner" className="hover:text-foreground transition-colors" data-testid="link-footer-planner">
                Plan Your Trip
              </Link>
              <Link href="/accessibility-map" className="hover:text-foreground transition-colors" data-testid="link-footer-map">
                Accessibility Map
              </Link>
              <Link href="/volunteers" className="hover:text-foreground transition-colors" data-testid="link-footer-volunteers">
                Find Volunteers
              </Link>
              <Link href="/blog" className="hover:text-foreground transition-colors" data-testid="link-footer-blog">
                Travel Stories
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground" aria-label="Support links">
              <Link href="/emergency" className="hover:text-foreground transition-colors" data-testid="link-footer-emergency">
                Emergency Help
              </Link>
              <a href="#accessibility" className="hover:text-foreground transition-colors">
                Accessibility Statement
              </a>
              <a href="#faq" className="hover:text-foreground transition-colors">
                FAQs
              </a>
              <a href="#contact" className="hover:text-foreground transition-colors">
                Contact Us
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Emergency: 112</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>help@knightguide.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Available Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive" aria-label="love" /> by Team Checkmate
          </p>
          <p>2024 Knight Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
