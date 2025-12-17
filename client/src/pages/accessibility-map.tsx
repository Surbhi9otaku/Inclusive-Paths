import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  MapPin, 
  Search,
  Accessibility,
  Eye,
  Ear,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  List,
  Map as MapIcon,
  Navigation
} from "lucide-react";
import type { Destination } from "@shared/schema";

const accessibilityFilters = [
  { key: "wheelchairAccess", label: "Wheelchair Access", icon: Accessibility },
  { key: "tactilePaths", label: "Tactile Paths", icon: Navigation },
  { key: "audioGuides", label: "Audio Guides", icon: Ear },
  { key: "signLanguageSupport", label: "Sign Language", icon: Eye },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "museum", label: "Museums" },
  { value: "park", label: "Parks" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
  { value: "attraction", label: "Attractions" },
];

function getScoreColor(score: number): string {
  if (score >= 4) return "#22c55e";
  if (score >= 3) return "#eab308";
  return "#ef4444";
}

function getScoreBadge(score: number) {
  if (score >= 4) return { variant: "default" as const, label: "Fully Accessible", icon: CheckCircle, className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" };
  if (score >= 3) return { variant: "default" as const, label: "Partially Accessible", icon: AlertCircle, className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" };
  return { variant: "default" as const, label: "Limited Access", icon: XCircle, className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" };
}

function createCustomIcon(score: number) {
  const color = getScoreColor(score);
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${score}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function MapUpdater({ destinations }: { destinations: Destination[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = L.latLngBounds(
        destinations
          .filter(d => d.latitude && d.longitude)
          .map(d => [parseFloat(d.latitude!), parseFloat(d.longitude!)] as [number, number])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [destinations, map]);
  
  return null;
}

function DestinationCard({ destination }: { destination: Destination }) {
  const scoreBadge = getScoreBadge(destination.accessibilityScore);
  const ScoreIcon = scoreBadge.icon;

  return (
    <Card className="hover-elevate overflow-hidden" data-testid={`card-destination-${destination.id}`}>
      <div className="relative h-40 bg-muted">
        {destination.imageUrl ? (
          <img 
            src={destination.imageUrl} 
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <MapPin className="h-12 w-12 text-primary/40" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={scoreBadge.className} size="sm">
            <ScoreIcon className="h-3 w-3 mr-1" />
            {scoreBadge.label}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{destination.name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3" />
          {destination.location}
        </div>
        <div className="flex flex-wrap gap-1">
          {destination.wheelchairAccess && (
            <Badge variant="outline" size="sm"><Accessibility className="h-3 w-3" /></Badge>
          )}
          {destination.tactilePaths && (
            <Badge variant="outline" size="sm"><Navigation className="h-3 w-3" /></Badge>
          )}
          {destination.audioGuides && (
            <Badge variant="outline" size="sm"><Ear className="h-3 w-3" /></Badge>
          )}
          {destination.signLanguageSupport && (
            <Badge variant="outline" size="sm"><Eye className="h-3 w-3" /></Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DestinationCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccessibilityMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [filters, setFilters] = useState({
    wheelchairAccess: false,
    tactilePaths: false,
    audioGuides: false,
    signLanguageSupport: false,
  });

  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", selectedCategory, filters],
  });

  const filteredDestinations = destinations?.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
    
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return dest[key as keyof Destination];
    });

    return matchesSearch && matchesCategory && matchesFilters;
  }) || [];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-3">
              <MapPin className="h-3 w-3 mr-1" />
              Explore
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-map-title">
              Accessibility Score Map
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find accessible destinations with our color-coded rating system.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-green-600 dark:text-green-400">Fully Accessible</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="h-3 w-3 rounded-full bg-yellow-500 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-yellow-600 dark:text-yellow-400">Partial Access</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="h-3 w-3 rounded-full bg-red-500 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-red-600 dark:text-red-400">Limited Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge size="sm">{activeFiltersCount}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-destinations"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm">Accessibility</Label>
                  {accessibilityFilters.map((filter) => (
                    <div key={filter.key} className="flex items-center justify-between">
                      <Label 
                        htmlFor={filter.key} 
                        className="flex items-center gap-2 text-xs font-normal cursor-pointer"
                      >
                        <filter.icon className="h-3 w-3 text-muted-foreground" />
                        {filter.label}
                      </Label>
                      <Switch
                        id={filter.key}
                        checked={filters[filter.key as keyof typeof filters]}
                        onCheckedChange={(checked) => 
                          setFilters((prev) => ({ ...prev, [filter.key]: checked }))
                        }
                        data-testid={`switch-filter-${filter.key}`}
                      />
                    </div>
                  ))}
                </div>

                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => setFilters({
                      wheelchairAccess: false,
                      tactilePaths: false,
                      audioGuides: false,
                      signLanguageSupport: false,
                    })}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground" data-testid="text-results-count">
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  `${filteredDestinations.length} destinations found`
                )}
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")}>
                <TabsList>
                  <TabsTrigger value="map" className="gap-2" data-testid="button-view-map">
                    <MapIcon className="h-4 w-4" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2" data-testid="button-view-list">
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              viewMode === "map" ? (
                <Skeleton className="h-[500px] w-full rounded-xl" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <DestinationCardSkeleton key={i} />
                  ))}
                </div>
              )
            ) : viewMode === "map" ? (
              <Card className="overflow-hidden">
                <div className="h-[500px] relative" data-testid="map-container">
                  <MapContainer
                    center={[40, 0]}
                    zoom={2}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredDestinations
                      .filter(d => d.latitude && d.longitude)
                      .map((destination) => (
                        <Marker
                          key={destination.id}
                          position={[parseFloat(destination.latitude!), parseFloat(destination.longitude!)]}
                          icon={createCustomIcon(destination.accessibilityScore)}
                        >
                          <Popup>
                            <div className="p-1 min-w-[200px]">
                              {destination.imageUrl && (
                                <img 
                                  src={destination.imageUrl} 
                                  alt={destination.name}
                                  className="w-full h-24 object-cover rounded mb-2"
                                />
                              )}
                              <h3 className="font-semibold text-sm">{destination.name}</h3>
                              <p className="text-xs text-gray-600 mb-1">{destination.location}</p>
                              <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < destination.accessibilityScore
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {destination.description}
                              </p>
                              <div className="flex gap-1 mt-2">
                                {destination.wheelchairAccess && (
                                  <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Wheelchair</span>
                                )}
                                {destination.audioGuides && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">Audio</span>
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    <MapUpdater destinations={filteredDestinations} />
                  </MapContainer>
                </div>
              </Card>
            ) : filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDestinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setFilters({
                        wheelchairAccess: false,
                        tactilePaths: false,
                        audioGuides: false,
                        signLanguageSupport: false,
                      });
                    }}
                    data-testid="button-reset-filters"
                  >
                    Reset All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 8px;
        }
      `}</style>
    </div>
  );
}
