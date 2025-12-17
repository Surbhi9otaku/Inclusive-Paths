import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Shield, 
  Users, 
  Mic, 
  Eye, 
  Ear, 
  Accessibility, 
  Brain,
  Phone,
  Map,
  MessageCircle,
  Heart,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import heroImage from "@assets/generated_images/diverse_accessible_travelers_exploring.png";

const features = [
  {
    icon: MapPin,
    title: "AI Trip Planner",
    description: "Personalized travel plans based on your accessibility needs using advanced AI technology.",
  },
  {
    icon: Mic,
    title: "Voice Navigation",
    description: "Voice-based guidance for visually impaired travelers. Hear directions and information clearly.",
  },
  {
    icon: MessageCircle,
    title: "Sign Language Support",
    description: "Communication assistance for deaf and mute travelers with text-to-speech and speech-to-text.",
  },
  {
    icon: Map,
    title: "Accessibility Map",
    description: "Find accessible destinations with color-coded ratings for wheelchair access, tactile paths, and more.",
  },
  {
    icon: Phone,
    title: "Emergency SOS",
    description: "One-tap emergency alerts to hospitals, NGOs, and guardians. Your safety is our priority.",
  },
  {
    icon: Users,
    title: "Volunteer Network",
    description: "Connect with trained volunteers and caretakers who can assist you during your travels.",
  },
];

const disabilityTypes = [
  { icon: Eye, label: "Visual Impairment", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { icon: Ear, label: "Hearing Impairment", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { icon: Accessibility, label: "Mobility Challenges", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { icon: Brain, label: "Cognitive Needs", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
];

const testimonials = [
  {
    name: "Sarah M.",
    type: "Wheelchair User",
    text: "Knight Guide helped me explore Paris like never before. Every route was accessible!",
    rating: 5,
  },
  {
    name: "James L.",
    type: "Visually Impaired",
    text: "The voice navigation is incredible. I felt confident traveling solo for the first time.",
    rating: 5,
  },
  {
    name: "Maria K.",
    type: "Deaf Traveler",
    text: "Sign language support and the volunteer network made my trip to Japan unforgettable.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden" aria-label="Hero section">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
          role="img"
          aria-label="Diverse travelers with disabilities exploring scenic destinations"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm" variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            Trusted by 10,000+ Travelers
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Everyone Deserves <br className="hidden sm:block" />
            <span className="text-primary-foreground">a Journey</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8" data-testid="text-hero-subtitle">
            AI-powered accessible travel platform designed specifically for people with disabilities. 
            Travel safely, independently, and confidently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/trip-planner">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg" data-testid="button-hero-plan-trip">
                <MapPin className="h-5 w-5" />
                Plan Your Trip
              </Button>
            </Link>
            <Link href="/accessibility-map">
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 px-8 py-6 text-lg bg-white/10 border-white/30 text-white backdrop-blur-sm"
                data-testid="button-hero-explore"
              >
                <Map className="h-5 w-5" />
                Explore Destinations
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {disabilityTypes.map((type) => (
              <div 
                key={type.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm"
              >
                <type.icon className="h-4 w-4" />
                <span>{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background" aria-label="Features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-features-title">
              Travel Without Barriers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of tools ensures you can explore the world with confidence and independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover-elevate">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-card" aria-label="How it works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Your Accessible Journey in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Tell Us Your Needs", desc: "Select your disability type and accessibility requirements for a personalized experience." },
              { step: "2", title: "Get AI-Powered Plan", desc: "Our AI creates a custom itinerary with accessible routes, accommodations, and activities." },
              { step: "3", title: "Travel Confidently", desc: "Enjoy voice navigation, emergency support, and volunteer assistance throughout your journey." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/trip-planner">
              <Button size="lg" className="gap-2" data-testid="button-start-planning">
                Start Planning Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background" aria-label="Testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stories from Our Travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-primary text-primary-foreground" aria-label="Call to action">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Explore the World?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of travelers who have discovered the joy of accessible travel with Knight Guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trip-planner">
              <Button size="lg" variant="secondary" className="gap-2 px-8" data-testid="button-cta-plan">
                <MapPin className="h-5 w-5" />
                Plan Your Trip
              </Button>
            </Link>
            <Link href="/volunteers">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 px-8 border-primary-foreground/30 text-primary-foreground"
                data-testid="button-cta-volunteer"
              >
                <Heart className="h-5 w-5" />
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-card" aria-label="Accessibility commitment">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              "Accessibility is not a privilege, it's a right."
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: CheckCircle, label: "WCAG AAA Compliant" },
              { icon: Mic, label: "Voice Controlled" },
              { icon: Eye, label: "Screen Reader Ready" },
              { icon: Accessibility, label: "Keyboard Navigation" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
