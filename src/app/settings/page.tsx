"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, Lock, User, Mail, Sparkles, Droplets, Gauge } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mutePopups, setMutePopups] = useState(false);
  const [hideBanner, setHideBanner] = useState(false);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [forceDownload, setForceDownload] = useState(false);
  const [glassTheme, setGlassTheme] = useState(true);
  const [enhancedGradients, setEnhancedGradients] = useState(true);
  const [gradientPreset, setGradientPreset] = useState<string>("aurora");
  const [forceLowPower, setForceLowPower] = useState<boolean>(false);

  // Admin-only suggested settings (local only)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApproveUploads, setAutoApproveUploads] = useState(true);
  const [maxUploadMB, setMaxUploadMB] = useState(50);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load persisted settings
  useEffect(() => {
    try {
      setReducedMotion(localStorage.getItem("settings.reducedMotion") === "true");
      setMutePopups(localStorage.getItem("settings.mutePopups") === "true");
      setHideBanner(localStorage.getItem("settings.hideBanner") === "true");
      const openTab = localStorage.getItem("settings.openDownloadsInNewTab");
      setOpenInNewTab(openTab === null ? true : openTab === "true");
      setForceDownload(localStorage.getItem("settings.forceDownload") === "true");
      const glass = localStorage.getItem("settings.glassTheme");
      setGlassTheme(glass === null ? true : glass === "true");
      const grads = localStorage.getItem("settings.enhancedGradients");
      setEnhancedGradients(grads === null ? true : grads === "true");
      const preset = localStorage.getItem("settings.gradientPreset");
      setGradientPreset(preset ?? "aurora");
      setForceLowPower(localStorage.getItem("settings.forceLowPower") === "true");

      // Admin (suggested)
      setMaintenanceMode(localStorage.getItem("admin.maintenanceMode") === "true");
      const autoApprove = localStorage.getItem("admin.autoApproveUploads");
      setAutoApproveUploads(autoApprove === null ? true : autoApprove === "true");
      const maxMb = localStorage.getItem("admin.maxUploadMB");
      if (maxMb) setMaxUploadMB(parseInt(maxMb, 10));
    } catch {}
  }, []);

  // Apply reduced motion attribute
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.setAttribute("data-reduced-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduced-motion");
    }
  }, [reducedMotion]);

  // Apply glass and gradient attributes
  useEffect(() => {
    if (glassTheme) {
      document.documentElement.setAttribute("data-glass", "true");
    } else {
      document.documentElement.removeAttribute("data-glass");
    }
  }, [glassTheme]);

  useEffect(() => {
    if (enhancedGradients) {
      document.documentElement.setAttribute("data-gradients", "true");
    } else {
      document.documentElement.removeAttribute("data-gradients");
    }
  }, [enhancedGradients]);

  // Apply gradient preset attribute
  useEffect(() => {
    if (gradientPreset) {
      document.documentElement.setAttribute("data-preset", gradientPreset);
    }
  }, [gradientPreset]);

  // Persist settings on change
  useEffect(() => {
    localStorage.setItem("settings.reducedMotion", String(reducedMotion));
  }, [reducedMotion]);
  useEffect(() => {
    localStorage.setItem("settings.mutePopups", String(mutePopups));
  }, [mutePopups]);
  useEffect(() => {
    localStorage.setItem("settings.hideBanner", String(hideBanner));
  }, [hideBanner]);
  useEffect(() => {
    localStorage.setItem("settings.openDownloadsInNewTab", String(openInNewTab));
  }, [openInNewTab]);
  useEffect(() => {
    localStorage.setItem("settings.forceDownload", String(forceDownload));
  }, [forceDownload]);
  useEffect(() => {
    localStorage.setItem("settings.glassTheme", String(glassTheme));
  }, [glassTheme]);
  useEffect(() => {
    localStorage.setItem("settings.enhancedGradients", String(enhancedGradients));
  }, [enhancedGradients]);
  useEffect(() => {
    localStorage.setItem("settings.gradientPreset", String(gradientPreset));
  }, [gradientPreset]);
  useEffect(() => {
    localStorage.setItem("settings.forceLowPower", String(forceLowPower));
    if (forceLowPower) {
      document.documentElement.setAttribute("data-low-power", "true");
    } else {
      document.documentElement.removeAttribute("data-low-power");
    }
  }, [forceLowPower]);
  // Admin persistence
  useEffect(() => {
    localStorage.setItem("admin.maintenanceMode", String(maintenanceMode));
  }, [maintenanceMode]);
  useEffect(() => {
    localStorage.setItem("admin.autoApproveUploads", String(autoApproveUploads));
  }, [autoApproveUploads]);
  useEffect(() => {
    localStorage.setItem("admin.maxUploadMB", String(maxUploadMB));
  }, [maxUploadMB]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container mx-auto p-8 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Account Information */}
          <Card className="animate-scaleIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {session.user?.name}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {session.user?.email}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div className="p-3 bg-muted rounded-md text-sm capitalize">
                  {(session.user as any)?.role || "user"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
                <ModeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mute Urgent Popups</Label>
                  <p className="text-sm text-muted-foreground">Hide urgent broadcast popups</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={mutePopups}
                  onChange={(e) => setMutePopups(e.target.checked)}
                  aria-label="Mute urgent broadcast popups"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Hide Banner Announcements</Label>
                  <p className="text-sm text-muted-foreground">Do not show the banner on top</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={hideBanner}
                  onChange={(e) => setHideBanner(e.target.checked)}
                  aria-label="Hide banner announcements"
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.25s' }}>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Improve comfort and readability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  aria-label="Reduce motion"
                />
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Downloads</CardTitle>
              <CardDescription>Choose how files open</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open in New Tab</Label>
                  <p className="text-sm text-muted-foreground">Open files in a new browser tab</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  aria-label="Open downloads in new tab"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Force Download</Label>
                  <p className="text-sm text-muted-foreground">Download file instead of inline preview</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={forceDownload}
                  onChange={(e) => setForceDownload(e.target.checked)}
                  aria-label="Force file download"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Style */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.33s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Visual Style
              </CardTitle>
              <CardDescription>Turn on glass and enhanced gradients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Glass Theme</Label>
                  <p className="text-sm text-muted-foreground">Translucent surfaces with blur and soft borders</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={glassTheme}
                  onChange={(e) => setGlassTheme(e.target.checked)}
                  aria-label="Enable glass theme"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enhanced Gradients</Label>
                  <p className="text-sm text-muted-foreground">Ambient animated gradients in backgrounds</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={enhancedGradients}
                  onChange={(e) => setEnhancedGradients(e.target.checked)}
                  aria-label="Enable enhanced gradients"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Preset</Label>
                  <p className="text-sm text-muted-foreground">Choose a gradient palette</p>
                </div>
                <select
                  className="h-9 rounded-md border bg-background px-2"
                  value={gradientPreset}
                  onChange={(e) => setGradientPreset(e.target.value)}
                  aria-label="Gradient preset"
                >
                  <option value="aurora">Aurora</option>
                  <option value="sunset">Sunset</option>
                  <option value="ocean">Ocean</option>
                  <option value="pastel">Pastel</option>
                  <option value="neon">Neon</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.34s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Performance
              </CardTitle>
              <CardDescription>Reduce effects on low-power devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Prefer Performance Mode</Label>
                  <p className="text-sm text-muted-foreground">Lower blur and stop animated gradients</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={forceLowPower}
                  onChange={(e) => setForceLowPower(e.target.checked)}
                  aria-label="Prefer performance mode"
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Settings (suggested) */}
          {((session.user as any)?.role === "admin" || (session.user as any)?.role === "founder") && (
            <Card className="animate-scaleIn" style={{ animationDelay: '0.35s' }}>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Suggested options (local-only for now)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily hide uploads and show notice</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    aria-label="Toggle maintenance mode"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Approve Uploads</Label>
                    <p className="text-sm text-muted-foreground">Skip manual review for trusted users</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={autoApproveUploads}
                    onChange={(e) => setAutoApproveUploads(e.target.checked)}
                    aria-label="Auto-approve uploads"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Max Upload Size (MB)</Label>
                    <p className="text-sm text-muted-foreground">Current: {maxUploadMB} MB</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    className="h-9 w-24 rounded-md border bg-background px-2"
                    value={maxUploadMB}
                    onChange={(e) => setMaxUploadMB(Number(e.target.value))}
                    aria-label="Max upload size in MB"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href="/admin/reviewers">Manage Reviewers</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="/admin/broadcasts">Manage Broadcasts</a>
                  </Button>
                  {(session.user as any)?.role === "founder" && (
                    <Button asChild variant="outline" size="sm">
                      <a href="/admin/users">Manage Admins</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Privacy & Security */}
          <Card className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Change your password
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
