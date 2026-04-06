import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import { getAvatarColor } from "../components/PostCard";
import { MOCK_USERS } from "../data/mockData";
import type { User } from "../types";
import { generateId, getInitials } from "../utils/helpers";

const AVATAR_PALETTE = [
  "#6FA3C8",
  "#8EC9A4",
  "#E8956D",
  "#C47BC8",
  "#7BBFE8",
  "#E8C46D",
];

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  // Login
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      setLoginError("Please enter your username.");
      return;
    }
    // Try to match a mock user first, otherwise create a guest user
    const existing = MOCK_USERS.find(
      (u) => u.handle.toLowerCase() === loginUsername.trim().toLowerCase(),
    );
    if (existing) {
      onLogin(existing);
    } else {
      const newUser: User = {
        id: generateId(),
        displayName:
          loginUsername.charAt(0).toUpperCase() + loginUsername.slice(1),
        handle: loginUsername.trim().toLowerCase().replace(/\s+/g, "_"),
        bio: "",
        avatarColor: AVATAR_PALETTE[0],
        joinedAt: new Date(),
      };
      onLogin(newUser);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!signupName.trim()) errs.name = "Display name is required.";
    if (!signupUsername.trim()) errs.username = "Username is required.";
    if (signupPassword.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (signupPassword !== signupConfirm)
      errs.confirm = "Passwords don't match.";
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newUser: User = {
      id: generateId(),
      displayName: signupName.trim(),
      handle: signupUsername.trim().toLowerCase().replace(/\s+/g, "_"),
      bio: `Hey, I'm ${signupName.trim()}! Excited to join ExpressMe 🎉`,
      avatarColor:
        AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)],
      joinedAt: new Date(),
    };
    onLogin(newUser);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      data-ocid="auth.page"
    >
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-4xl font-bold text-foreground mb-1">ExpressMe 💬</p>
        <p className="text-muted-foreground text-base">
          Welcome to ExpressMe! 👋
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          A safe space for students to connect &amp; share.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Tabs defaultValue="login" className="w-full" data-ocid="auth.section">
          <TabsList className="w-full rounded-full mb-6 bg-secondary">
            <TabsTrigger
              value="login"
              className="flex-1 rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm"
              data-ocid="auth.tab"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm"
              data-ocid="auth.tab"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form
              onSubmit={handleLogin}
              className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col gap-4"
              data-ocid="auth.panel"
            >
              <h2 className="text-lg font-bold text-foreground">
                Welcome back! 😊
              </h2>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Enter your username"
                  className="rounded-xl"
                  data-ocid="auth.input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="rounded-xl"
                  data-ocid="auth.input"
                />
              </div>

              {loginError && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="auth.error_state"
                >
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="rounded-full font-semibold mt-1"
                data-ocid="auth.submit_button"
              >
                Log In
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-1">
                Try logging in as: <strong>mia_j</strong>,{" "}
                <strong>alex_b</strong>, or <strong>cool_coder</strong>
              </p>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form
              onSubmit={handleSignup}
              className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col gap-4"
              data-ocid="auth.panel"
            >
              <h2 className="text-lg font-bold text-foreground">
                Create your account ✨
              </h2>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-name">Display Name</Label>
                <Input
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => {
                    setSignupName(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Your name (e.g. Alex B.)"
                  className="rounded-xl"
                  data-ocid="auth.input"
                />
                {signupErrors.name && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  value={signupUsername}
                  onChange={(e) => {
                    setSignupUsername(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  placeholder="e.g. cool_coder"
                  className="rounded-xl"
                  data-ocid="auth.input"
                />
                {signupErrors.username && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.username}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="At least 6 characters"
                  className="rounded-xl"
                  data-ocid="auth.input"
                />
                {signupErrors.password && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  value={signupConfirm}
                  onChange={(e) => {
                    setSignupConfirm(e.target.value);
                    setSignupErrors((prev) => ({ ...prev, confirm: "" }));
                  }}
                  placeholder="Repeat your password"
                  className="rounded-xl"
                  data-ocid="auth.input"
                />
                {signupErrors.confirm && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.confirm}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="rounded-full font-semibold mt-1"
                data-ocid="auth.submit_button"
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
