import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommunicationFAB } from "@/components/communication-tools";
import Home from "@/pages/home";
import TripPlanner from "@/pages/trip-planner";
import AccessibilityMap from "@/pages/accessibility-map";
import Emergency from "@/pages/emergency";
import Volunteers from "@/pages/volunteers";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trip-planner" component={TripPlanner} />
      <Route path="/accessibility-map" component={AccessibilityMap} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/volunteers" component={Volunteers} />
      <Route path="/blog" component={Blog} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <CommunicationFAB />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
