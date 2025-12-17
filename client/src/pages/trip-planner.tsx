import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Eye, 
  Ear, 
  Accessibility, 
  Brain,
  Mic,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Calendar,
  Route,
  Building,
  Utensils,
  Camera,
  Loader2
} from "lucide-react";
import { tripPlannerFormSchema, type TripPlannerForm } from "@shared/schema";

const disabilityOptions = [
  { value: "visual", label: "Visual Impairment", icon: Eye, description: "Blindness or low vision" },
  { value: "hearing", label: "Hearing Impairment", icon: Ear, description: "Deaf or hard of hearing" },
  { value: "mobility", label: "Mobility Challenges", icon: Accessibility, description: "Wheelchair, walker, or limited mobility" },
  { value: "cognitive", label: "Cognitive Needs", icon: Brain, description: "Learning or developmental disabilities" },
  { value: "multiple", label: "Multiple Needs", icon: Sparkles, description: "More than one type of disability" },
];

const accessibilityOptions = [
  { key: "wheelchairAccess", label: "Wheelchair Access", description: "Ramps, elevators, accessible entrances" },
  { key: "tactilePaths", label: "Tactile Paths", description: "Tactile paving for navigation" },
  { key: "audioGuides", label: "Audio Guides", description: "Audio descriptions and guides" },
  { key: "signLanguageSupport", label: "Sign Language Support", description: "Sign language interpreters available" },
  { key: "quietSpaces", label: "Quiet Spaces", description: "Sensory-friendly areas available" },
  { key: "assistanceRequired", label: "Personal Assistance", description: "Staff assistance when needed" },
];

interface ItineraryDay {
  day: number;
  title: string;
  activities: Array<{
    time: string;
    activity: string;
    location: string;
    accessibilityNotes: string;
    icon: string;
  }>;
}

interface GeneratedPlan {
  title: string;
  summary: string;
  itinerary: ItineraryDay[];
  tips: string[];
}

export default function TripPlanner() {
  const [step, setStep] = useState(1);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  const form = useForm<TripPlannerForm>({
    resolver: zodResolver(tripPlannerFormSchema),
    defaultValues: {
      destination: "",
      disabilityType: "mobility",
      accessibilityNeeds: {
        wheelchairAccess: false,
        tactilePaths: false,
        audioGuides: false,
        signLanguageSupport: false,
        quietSpaces: false,
        assistanceRequired: false,
      },
      travelDates: {
        startDate: "",
        endDate: "",
      },
      additionalNotes: "",
    },
  });

  const generatePlanMutation = useMutation({
    mutationFn: async (data: TripPlannerForm) => {
      const response = await apiRequest("POST", "/api/trip-plans/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedPlan(data);
      setStep(4);
    },
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const onSubmit = (data: TripPlannerForm) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      generatePlanMutation.mutate(data);
    }
  };

  const getIconForActivity = (iconName: string) => {
    const icons: Record<string, typeof MapPin> = {
      building: Building,
      utensils: Utensils,
      camera: Camera,
      mapPin: MapPin,
      route: Route,
    };
    return icons[iconName] || MapPin;
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-planner-title">
            Plan Your Accessible Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us about your needs, and our AI will create a personalized travel itinerary with accessible routes and accommodations.
          </p>
        </div>

        {step <= 3 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Where do you want to go?
                  </CardTitle>
                  <CardDescription>
                    Enter your destination and select your disability type for personalized recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Destination</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Paris, France" 
                            className="text-lg py-6"
                            data-testid="input-destination"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a city, country, or specific location you'd like to visit.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disabilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Disability Type</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {disabilityOptions.map((option) => (
                            <div
                              key={option.value}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover-elevate ${
                                field.value === option.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                              onClick={() => field.onChange(option.value)}
                              data-testid={`button-disability-${option.value}`}
                              role="radio"
                              aria-checked={field.value === option.value}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  field.onChange(option.value);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                  field.value === option.value ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}>
                                  <option.icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{option.label}</p>
                                  <p className="text-sm text-muted-foreground">{option.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" className="gap-2" data-testid="button-next-step1">
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5 text-primary" />
                    Accessibility Requirements
                  </CardTitle>
                  <CardDescription>
                    Select all the accessibility features you need for your trip.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {accessibilityOptions.map((option) => (
                      <FormField
                        key={option.key}
                        control={form.control}
                        name={`accessibilityNeeds.${option.key as keyof TripPlannerForm["accessibilityNeeds"]}`}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover-elevate">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid={`checkbox-${option.key}`}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium cursor-pointer">
                                {option.label}
                              </FormLabel>
                              <FormDescription>
                                {option.description}
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg" 
                      onClick={() => setStep(1)}
                      className="gap-2"
                      data-testid="button-back-step2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" size="lg" className="gap-2" data-testid="button-next-step2">
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Additional Details
                  </CardTitle>
                  <CardDescription>
                    Add travel dates and any special requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="travelDates.startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              data-testid="input-start-date"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="travelDates.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              data-testid="input-end-date"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific requirements, dietary restrictions, or preferences..."
                            className="min-h-[120px]"
                            data-testid="input-additional-notes"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tell us anything else that would help us plan your perfect trip.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg" 
                      onClick={() => setStep(2)}
                      className="gap-2"
                      data-testid="button-back-step3"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="gap-2"
                      disabled={generatePlanMutation.isPending}
                      data-testid="button-generate-plan"
                    >
                      {generatePlanMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate My Plan
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>

        {step === 4 && generatedPlan && (
          <div className="space-y-6">
            <Card className="border-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <Badge>AI Generated</Badge>
                </div>
                <CardTitle className="text-2xl" data-testid="text-plan-title">{generatedPlan.title}</CardTitle>
                <CardDescription className="text-base">{generatedPlan.summary}</CardDescription>
              </CardHeader>
            </Card>

            {generatedPlan.itinerary.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Day {day.day}: {day.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => {
                      const ActivityIcon = getIconForActivity(activity.icon);
                      return (
                        <div 
                          key={index} 
                          className="flex gap-4 p-4 rounded-lg bg-muted/50"
                          data-testid={`activity-day${day.day}-${index}`}
                        >
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <ActivityIcon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" size="sm">{activity.time}</Badge>
                              <span className="font-medium">{activity.activity}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{activity.location}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Accessibility className="h-4 w-4 text-primary" />
                              <span>{activity.accessibilityNotes}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Accessibility Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedPlan.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  setStep(1);
                  setGeneratedPlan(null);
                  form.reset();
                }}
                className="gap-2"
                data-testid="button-new-plan"
              >
                <ArrowLeft className="h-4 w-4" />
                Plan Another Trip
              </Button>
              <Button size="lg" className="gap-2" data-testid="button-save-plan">
                <CheckCircle className="h-4 w-4" />
                Save This Plan
              </Button>
            </div>
          </div>
        )}

        {generatePlanMutation.isPending && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Creating Your Personalized Plan</h3>
              <p className="text-muted-foreground">
                Our AI is crafting an accessible itinerary just for you...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
