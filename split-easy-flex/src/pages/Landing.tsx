import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Calculator, Crown } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      title: "Smart Bill Splitting",
      description: "Automatically calculate and split expenses among friends with precision and ease."
    },
    {
      icon: Users,
      title: "Guest Invitations", 
      description: "Invite friends via email or share invitation codes for quick access to bills."
    },
    {
      icon: Crown,
      title: "Premium Features",
      description: "Upgrade to Premium for unlimited bills, advanced analytics, and priority support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SplitWise</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button variant="hero" onClick={() => navigate("/register")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Split Bills
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Effortlessly</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The modern way to share expenses with friends. Track spending, split costs fairly, 
                  and settle up seamlessly. No more awkward money conversations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="text-lg px-8 py-6"
                >
                  Start Splitting Bills
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="text-lg px-8 py-6"
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden card-large">
                <img 
                  src={heroImage} 
                  alt="Bill splitting interface showing shared expenses and collaboration"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Split Bills
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make sharing expenses simple, fair, and stress-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-smooth hover-scale bg-card">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white card-large">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Splitting Bills?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who have simplified their shared expenses. 
              Create your account today and start splitting bills the smart way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/register")}
                className="bg-white text-primary border-white hover:bg-gray-50 text-lg px-8 py-6"
              >
                Create Free Account
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => navigate("/login")}
                className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">SplitWise</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 SplitWise. Making bill splitting simple and fair.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;