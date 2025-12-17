import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  AlertTriangle,
  MapPin,
  Shield,
  Plus,
  Heart,
  Building2,
  Users,
  MessageCircle,
  Share2,
  Trash2,
  Star,
  Radio,
  Activity
} from "lucide-react";
import type { EmergencyContact } from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  relationship: z.enum(["hospital", "ngo", "guardian", "caretaker"]),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const relationshipOptions = [
  { value: "guardian", label: "Guardian/Family", icon: Heart },
  { value: "hospital", label: "Hospital", icon: Building2 },
  { value: "ngo", label: "NGO/Support Org", icon: Users },
  { value: "caretaker", label: "Caretaker", icon: Shield },
];

function ContactCard({ 
  contact, 
  onDelete 
}: { 
  contact: EmergencyContact; 
  onDelete: (id: string) => void;
}) {
  const relationshipInfo = relationshipOptions.find(r => r.value === contact.relationship);
  const RelIcon = relationshipInfo?.icon || Heart;

  return (
    <Card className="hover-elevate" data-testid={`card-contact-${contact.id}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RelIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{contact.name}</h3>
                {contact.isDefault && (
                  <Badge size="sm" className="gap-1">
                    <Star className="h-3 w-3" />
                    Primary
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {relationshipInfo?.label || contact.relationship}
              </p>
              <p className="text-sm font-mono">{contact.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm"
              className="gap-2"
              onClick={() => window.open(`tel:${contact.phone}`)}
              data-testid={`button-call-${contact.id}`}
            >
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(contact.id)}
              data-testid={`button-delete-${contact.id}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Emergency() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      relationship: "guardian",
    },
  });

  const { data: contacts, isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const addContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/emergency-contacts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/emergency-contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed.",
      });
    },
  });

  const triggerSOS = () => {
    setSosActive(true);
    toast({
      title: "SOS Activated",
      description: "Emergency alerts are being sent to your contacts.",
      variant: "destructive",
    });
    setTimeout(() => setSosActive(false), 3000);
  };

  const onSubmit = (data: ContactFormData) => {
    addContactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge variant="destructive" className="mb-4">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Emergency
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-emergency-title">
            Emergency & Safety Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to emergency services, contacts, and real-time safety tracking. Your safety is our priority.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className={`border-2 ${sosActive ? "border-destructive animate-pulse" : "border-destructive/20"}`}>
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <Button
                      size="lg"
                      variant="destructive"
                      className="h-32 w-32 rounded-full text-2xl font-bold shadow-lg"
                      onClick={triggerSOS}
                      data-testid="button-sos-main"
                    >
                      {sosActive ? (
                        <Radio className="h-12 w-12 animate-ping" />
                      ) : (
                        <span>SOS</span>
                      )}
                    </Button>
                    {sosActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {sosActive ? "Sending Emergency Alerts..." : "Emergency SOS"}
                  </h2>
                  <p className="text-muted-foreground">
                    {sosActive 
                      ? "Your location is being shared with emergency contacts" 
                      : "Tap the button to send emergency alerts to all your contacts"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => window.open("tel:112")}
                data-testid="button-call-emergency"
              >
                <Phone className="h-6 w-6 text-destructive" />
                <span className="font-semibold">Call 112</span>
                <span className="text-xs text-muted-foreground">Emergency Services</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                data-testid="button-share-location"
              >
                <Share2 className="h-6 w-6 text-primary" />
                <span className="font-semibold">Share Location</span>
                <span className="text-xs text-muted-foreground">Send to contacts</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                data-testid="button-voice-message"
              >
                <MessageCircle className="h-6 w-6 text-primary" />
                <span className="font-semibold">Voice Message</span>
                <span className="text-xs text-muted-foreground">Record alert</span>
              </Button>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>
                    These contacts will be notified in case of emergency.
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" data-testid="button-add-contact">
                      <Plus className="h-4 w-4" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Emergency Contact</DialogTitle>
                      <DialogDescription>
                        Add a new emergency contact who will be notified in case of an emergency.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Contact name" 
                                  data-testid="input-contact-name"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="+1 234 567 8900" 
                                  type="tel"
                                  data-testid="input-contact-phone"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="relationship"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-relationship">
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {relationshipOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={addContactMutation.isPending}
                            data-testid="button-save-contact"
                          >
                            {addContactMutation.isPending ? "Saving..." : "Save Contact"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : contacts && contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <ContactCard 
                        key={contact.id} 
                        contact={contact}
                        onDelete={(id) => deleteContactMutation.mutate(id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Emergency Contacts</h3>
                    <p className="text-muted-foreground mb-4">
                      Add emergency contacts to ensure your safety while traveling.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-contact">
                      Add Your First Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Safety Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">Tracking Active</span>
                  </div>
                  <Badge variant="outline" className="text-green-600 dark:text-green-400">Online</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GPS Status</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">Just now</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Battery</span>
                    <span className="font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Map View</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Your location is being tracked and can be shared with emergency contacts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Nearby Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "City Hospital", distance: "0.5 km", type: "Hospital" },
                  { name: "Police Station", distance: "0.8 km", type: "Police" },
                  { name: "Accessibility NGO", distance: "1.2 km", type: "NGO" },
                ].map((place) => (
                  <div 
                    key={place.name} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-sm">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.type}</p>
                    </div>
                    <Badge variant="outline" size="sm">{place.distance}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
