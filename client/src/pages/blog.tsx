import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen, 
  Search,
  Eye,
  Ear,
  Accessibility,
  ArrowRight,
  Calendar,
  User,
  Clock
} from "lucide-react";
import type { BlogPost } from "@shared/schema";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "travel-stories", label: "Travel Stories" },
  { value: "tips", label: "Tips & Advice" },
  { value: "guides", label: "Destination Guides" },
  { value: "accessibility", label: "Accessibility News" },
];

const disabilityIcons: Record<string, typeof Eye> = {
  visual: Eye,
  hearing: Ear,
  mobility: Accessibility,
};

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group hover-elevate overflow-hidden" data-testid={`card-blog-${post.id}`}>
      <div className="relative h-48 bg-muted overflow-hidden">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="capitalize">
            {post.category?.replace("-", " ") || "Article"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            5 min read
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 150) + "..."}
        </p>
        
        {post.disabilityTags && post.disabilityTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.disabilityTags.map((tag) => {
              const Icon = disabilityIcons[tag] || Accessibility;
              return (
                <Badge key={tag} variant="outline" size="sm" className="gap-1 capitalize">
                  <Icon className="h-3 w-3" />
                  {tag}
                </Badge>
              );
            })}
          </div>
        )}

        <Button variant="ghost" className="gap-2 p-0 h-auto text-primary" data-testid={`button-read-${post.id}`}>
          Read More
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid="card-featured-post">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-64 lg:h-auto bg-muted">
          {post.imageUrl ? (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}
        </div>
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-4">
            Featured Story
          </Badge>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">{post.title}</h2>
          <p className="text-muted-foreground mb-6 line-clamp-3">
            {post.excerpt || post.content.substring(0, 200) + "..."}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            {post.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              8 min read
            </div>
          </div>
          <Button className="w-fit gap-2" data-testid="button-read-featured">
            Read Full Story
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts?.[0];
  const remainingPosts = filteredPosts?.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Blog
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-blog-title">
              Inclusive Travel Stories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Inspiring stories, practical tips, and destination guides from travelers with disabilities around the world.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-blog"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-blog-category">
                <SelectValue placeholder="Category" />
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
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 lg:h-80 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="space-y-8">
            {featuredPost && <FeaturedPost post={featuredPost} />}
            
            {remainingPosts && remainingPosts.length > 0 && (
              <>
                <h2 className="text-2xl font-bold">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search query or category filter.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                data-testid="button-reset-blog-filters"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="py-8">
            <div className="text-center max-w-2xl mx-auto">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
              <p className="opacity-90 mb-6">
                Have an inspiring travel story to share? We'd love to feature your experience 
                and help inspire other travelers with disabilities.
              </p>
              <Button size="lg" variant="secondary" className="gap-2" data-testid="button-submit-story">
                <BookOpen className="h-5 w-5" />
                Submit Your Story
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
