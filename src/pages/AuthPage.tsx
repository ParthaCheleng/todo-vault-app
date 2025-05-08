
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        navigate("/");
      } else if (mode === "signup") {
        await signUp(email, password);
        setMode("signin");
      } else if (mode === "forgot") {
        // Handle forgot password
        // Not implemented in this version
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "signin":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-xs"
                      onClick={() => setMode("forgot")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-todo-purple hover:bg-todo-purple-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </Button>
                </p>
              </CardFooter>
            </form>
          </>
        );

      case "signup":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Sign up to get started with TodoTrack</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-todo-purple hover:bg-todo-purple-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={() => setMode("signin")}
                  >
                    Sign in
                  </Button>
                </p>
              </CardFooter>
            </form>
          </>
        );

      case "forgot":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>We'll send you a link to reset your password</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-todo-purple hover:bg-todo-purple-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Remember your password?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={() => setMode("signin")}
                  >
                    Sign in
                  </Button>
                </p>
              </CardFooter>
            </form>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-todo-dark">
      <Card className="w-full max-w-md bg-todo-dark-card text-foreground border-0">
        {renderForm()}
      </Card>
    </div>
  );
}
