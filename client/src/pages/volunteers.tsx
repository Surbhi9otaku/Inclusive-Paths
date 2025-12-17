import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Search,
  MapPin,
  Star,
  MessageCircle,
  Phone,
  Eye,
  Ear,
  Accessibility,
  Filter,
  Heart,
  Globe,
  Clock
} from "lucide-react";
import type { Volunteer } from "@shared/schema";

const specializationIcons: Record<string, typeof Eye> = {
  visual: Eye,
  hearing: Ear,
  mobility: Accessibility,
};

const availabilityColors: Record<string, string> = {
  available: "bg-green-500",
  busy: "bg-yellow-500",
  offline: "bg-gray-400",
};

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const matchScore = Math.floor(Math.random() * 20) + 80;

  return (
    <Card className="hover-elevate" data-testid={`card-volunteer-${volunteer.id}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={volunteer.photo || undefined} alt={volunteer.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {volunteer.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div 
              className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${
                availabilityColors[volunteer.availability || "offline"]
              }`}
              aria-label={`Status: ${volunteer.availability}`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{volunteer.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              {volunteer.location || "Location not specified"}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (volunteer.rating || 5)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                ({volunteer.rating || 5}.0)
              </span>
            </div>
          </div>
        </div>

        {volunteer.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {volunteer.bio}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Match Score</span>
              <span className="font-semibold text-primary">{matchScore}%</span>
            </div>
            <Progress value={matchScore} className="h-2" />
          </div>

          {volunteer.languages && volunteer.languages.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Globe className="h-4 w-4" />
                Languages
              </div>
              <div className="flex flex-wrap gap-1">
                {volunteer.languages.map((lang) => (
                  <Badge key={lang} variant="outline" size="sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {volunteer.specializations && volunteer.specializations.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Heart className="h-4 w-4" />
                Specializations
              </div>
              <div className="flex flex-wrap gap-1">
                {volunteer.specializations.map((spec) => {
                  const Icon = specializationIcons[spec] || Heart;
                  return (
                    <Badge key={spec} variant="secondary" size="sm" className="gap-1 capitalize">
                      <Icon className="h-3 w-3" />
                      {spec}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button className="flex-1 gap-2" data-testid={`button-connect-${volunteer.id}`}>
            <MessageCircle className="h-4 w-4" />
            Connect
          </Button>
          <Button variant="outline" size="icon" data-testid={`button-call-volunteer-${volunteer.id}`}>
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function VolunteerCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-2 w-full mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-2 mt-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Volunteers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  const { data: volunteers, isLoading } = useQuery<Volunteer[]>({
    queryKey: ["/api/volunteers"],
  });

  const filteredVolunteers = volunteers?.filter((volunteer) => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (volunteer.location?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialization = selectedSpecialization === "all" || 
      volunteer.specializations?.includes(selectedSpecialization);
    
    const matchesAvailability = selectedAvailability === "all" || 
      volunteer.availability === selectedAvailability;

    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              Community
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-volunteers-title">
              Volunteer & Caretaker Network
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with trained volunteers and caretakers who can assist you during your travels. Our network is here to help.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-volunteers"
              />
            </div>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-specialization">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="visual">Visual Impairment</SelectItem>
                <SelectItem value="hearing">Hearing Impairment</SelectItem>
                <SelectItem value="mobility">Mobility Assistance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-availability">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground" data-testid="text-volunteer-count">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              `${filteredVolunteers?.length || 0} volunteers available`
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VolunteerCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredVolunteers && filteredVolunteers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((volunteer) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query to find volunteers.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialization("all");
                  setSelectedAvailability("all");
                }}
                data-testid="button-reset-volunteer-filters"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="py-8">
            <div className="text-center max-w-2xl mx-auto">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Become a Volunteer</h2>
              <p className="text-muted-foreground mb-6">
                Join our community of volunteers and help make travel accessible for everyone. 
                Your support can make a real difference in someone's journey.
              </p>
              <Button size="lg" className="gap-2" data-testid="button-become-volunteer">
                <Users className="h-5 w-5" />
                Apply to Volunteer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
