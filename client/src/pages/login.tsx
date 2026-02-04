import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2 } from "lucide-react";
// import { Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

import kaplanLogo from "@assets/kaplan.svg";
import alpadiaLogo from "@assets/alpadia.svg";
import eslLogo from "@assets/esl.svg";
import azurlinguaLogo from "@assets/azurlingua.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, login } = useAuth();
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const passwordLoginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/auth/login", { password });
      return response.json();
    },
    onSuccess: () => {
      login();
      toast({
        title: "Login successful",
        description: "Welcome to the IT Projects Dashboard",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid password",
        variant: "destructive",
      });
    },
  });

  /* Magic link login - temporarily disabled
  const magicLinkMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/magic-link", { email });
      return response.json();
    },
    onSuccess: () => {
      setMagicLinkSent(true);
      toast({
        title: "Magic link sent",
        description: "Check your email for the login link",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send magic link",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      magicLinkMutation.mutate(email);
    }
  };
  */

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      passwordLoginMutation.mutate(password);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            KLG Group
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            IT Projects Dashboard
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 py-6">
            <div className="bg-slate-800 dark:bg-slate-700 rounded-lg p-3 h-14 flex items-center justify-center">
              <img
                src={kaplanLogo}
                alt="Kaplan International"
                className="h-8 w-auto"
                data-testid="img-logo-kaplan"
              />
            </div>
            <img
              src={alpadiaLogo}
              alt="Alpadia"
              className="h-10 w-auto"
              data-testid="img-logo-alpadia"
            />
            <img
              src={eslLogo}
              alt="ESL"
              className="h-8 w-auto"
              data-testid="img-logo-esl"
            />
            <img
              src={azurlinguaLogo}
              alt="Azurlingua"
              className="h-10 w-auto"
              data-testid="img-logo-azurlingua"
            />
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access the IT Projects Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Password login only - Magic link temporarily disabled */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Master Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter master password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={passwordLoginMutation.isPending}
                data-testid="button-login"
              >
                {passwordLoginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Magic link login - temporarily disabled
            <Tabs defaultValue="magic-link" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="magic-link" data-testid="tab-magic-link">
                  <Mail className="w-4 h-4 mr-2" />
                  Magic Link
                </TabsTrigger>
                <TabsTrigger value="password" data-testid="tab-password">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="magic-link">
                {magicLinkSent ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Check your email
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      We sent a login link to <strong>{email}</strong>
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setMagicLinkSent(false)}
                      data-testid="button-try-again"
                    >
                      Use a different email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={magicLinkMutation.isPending}
                      data-testid="button-send-magic-link"
                    >
                      {magicLinkMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Magic Link
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </TabsContent>
              
              <TabsContent value="password">
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Master Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter master password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-testid="input-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={passwordLoginMutation.isPending}
                    data-testid="button-login"
                  >
                    {passwordLoginMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            */}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Authorized personnel only. For access requests, contact IT support.
        </p>
      </div>
    </div>
  );
}
