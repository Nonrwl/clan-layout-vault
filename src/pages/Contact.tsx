import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageCircle, 
  HelpCircle, 
  Bug,
  Lightbulb,
  Shield,
  MessageSquare,
  Hash,
  Video
} from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-16 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="gradient-accent rounded-full w-16 h-16 flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-6">
            <span className="gradient-primary bg-clip-text text-transparent">Contact Us</span>
          </h1>
          
          <p className="text-xl text-foreground/90 mb-8 max-w-3xl mx-auto">
            Have a question, suggestion, or found a bug? We'd love to hear from you! 
            <br />
            <span className="text-primary font-semibold">Your feedback helps us build the best CoC community.</span>
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-gaming">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">General Questions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about bases, strategies, or the website
                </p>
                <Button variant="outline" size="sm">
                  Ask Question
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-gaming">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bug className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">Bug Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Found something broken? Let us know!
                </p>
                <Button variant="outline" size="sm">
                  Report Bug
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-gaming">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Feature Ideas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have an idea to make us better?
                </p>
                <Button variant="outline" size="sm">
                  Share Idea
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-gaming">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-war/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-war" />
                </div>
                <h3 className="font-semibold mb-2">Base Submissions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Want to submit your own base?
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your question, feedback, or suggestion..." 
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Community & Social */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect with other Clash of Clans players, share strategies, and get help from the community.
                  </p>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Join Discord Server
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Hash className="mr-2 h-4 w-4" />
                      Follow on Twitter
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Video className="mr-2 h-4 w-4" />
                      Subscribe to YouTube
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How do I download base layouts?</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the download button on any base card, or use the copy link button to share with friends.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Can I submit my own base?</h4>
                    <p className="text-sm text-muted-foreground">
                      Base submissions are coming soon! We're building a review system to ensure quality.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Are these bases tested?</h4>
                    <p className="text-sm text-muted-foreground">
                      All featured bases are tested by our community and have proven defensive records.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;