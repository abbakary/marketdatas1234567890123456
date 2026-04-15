import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { CreditCard, CheckCircle, Clock, XCircle, Send, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import PageLayout from "../components/PageLayout";
import subscriptionRequestService from "../../../utils/subscriptionRequestService";

const USER_KEY = "dali-user";
const PRIMARY = "#61C5C3";
const SUBSCRIPTION_HEADER_COLOR = "#8b5cf6";

const PLANS = [
  {
    key: "basic",
    name: "Basic",
    emoji: "🆓",
    price: "$200/month",
    tagline: "Best for individuals getting started",
    features: ["Email notifications only", "Single user license", "Limited dataset access", "Basic support"],
    cta: "Get Started",
    accent: "#22c55e",
  },
  {
    key: "standard",
    name: "Standard",
    emoji: "📊",
    price: "$500/month",
    tagline: "For small teams and growing projects",
    features: ["Up to 5 users", "Access to multiple formats (CSV, JSON)", "More dataset categories", "Priority support"],
    cta: "Most Popular",
    accent: "#3b82f6",
    popular: true,
  },
  {
    key: "premium",
    name: "Premium",
    emoji: "🚀",
    price: "$1500/month",
    tagline: "For advanced users and data-driven teams",
    features: ["Up to 20 users", "All dataset formats + API access", "Real-time updates", "Dedicated support"],
    cta: "Upgrade Now",
    accent: "#8b5cf6",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    emoji: "🏢",
    price: "Custom pricing",
    tagline: "For large organizations",
    features: ["Unlimited users", "Full dataset access", "Custom datasets available", "24/7 dedicated support", "SLA & onboarding support"],
    cta: "Contact Sales",
    accent: "#f59e0b",
  },
];

function safeParseJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });
  const [latestRequest, setLatestRequest] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [pendingPlanKey, setPendingPlanKey] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [form, setForm] = useState({
    planKey: "standard",
    billingCycle: "monthly",
    seats: 1,
    company: "",
    notes: "",
    contactEmail: "",
    contactName: "",
  });

  useEffect(() => {
    const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    const parsed = rawUser ? safeParseJSON(rawUser) : null;
    setAuthUser(parsed);
  }, []);

  const userId = authUser?.id || authUser?._id || authUser?.userId || null;

  const selectedPlan = useMemo(() => PLANS.find((p) => p.key === form.planKey) || PLANS[1], [form.planKey]);

  const statusMeta = (status) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending review", bg: "#fffbeb", color: "#f59e0b", icon: <Clock size={14} color="#f59e0b" /> };
      case "APPROVED":
        return { label: "Approved", bg: "#f0fdf4", color: "#16a34a", icon: <CheckCircle size={14} color="#16a34a" /> };
      case "REJECTED":
        return { label: "Rejected", bg: "#fef2f2", color: "#dc2626", icon: <XCircle size={14} color="#dc2626" /> };
      case "CANCELLED":
        return { label: "Cancelled", bg: "#f9fafb", color: "#6b7280", icon: <XCircle size={14} color="#6b7280" /> };
      default:
        return { label: status || "—", bg: "#f9fafb", color: "#6b7280", icon: null };
    }
  };

  const refreshUserState = () => {
    if (!userId) {
      setLatestRequest(null);
      setActiveSubscription(null);
      return;
    }
    setLatestRequest(subscriptionRequestService.getLatestRequestByUser(String(userId)));
    setActiveSubscription(subscriptionRequestService.getUserSubscription(String(userId)));
  };

  useEffect(() => {
    refreshUserState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const openRequestDialog = (planKey) => {
    if (!userId) {
      setPendingPlanKey(planKey);
      setLoginModalOpen(true);
      return;
    }
    const plan = PLANS.find((p) => p.key === planKey) || PLANS[1];
    setForm((p) => ({
      ...p,
      planKey: plan.key,
      contactName: p.contactName || authUser?.full_name || authUser?.name || "",
      contactEmail: p.contactEmail || authUser?.email || "",
      company: p.company || authUser?.company || "",
    }));
    setRequestOpen(true);
  };

  const validate = () => {
    const errors = [];
    if (!userId) errors.push("Please sign in first to submit a subscription request.");
    if (!form.contactName.trim()) errors.push("Contact name is required.");
    if (!form.contactEmail.trim() || !form.contactEmail.includes("@")) errors.push("A valid email is required.");
    if (!form.company.trim()) errors.push("Company is required.");
    if (!Number.isFinite(Number(form.seats)) || Number(form.seats) < 1) errors.push("Seats must be 1 or more.");
    return errors;
  };

  const handleSubmit = () => {
    const errors = validate();
    if (errors.length) {
      setSnack({ open: true, severity: "error", message: errors[0] });
      return;
    }

    const request = subscriptionRequestService.createRequest({
      userId: String(userId),
      userName: form.contactName.trim(),
      userEmail: form.contactEmail.trim(),
      company: form.company.trim(),
      planKey: form.planKey,
      planName: selectedPlan.name,
      billingCycle: form.billingCycle,
      seats: Number(form.seats),
      notes: form.notes.trim(),
    });

    setLatestRequest(request);
    setRequestOpen(false);
    setSnack({ open: true, severity: "success", message: "Subscription request submitted. Awaiting Admin/Editor review." });
    refreshUserState();
  };

  const handleCancelRequest = () => {
    if (!latestRequest?.id) return;
    try {
      subscriptionRequestService.cancelRequest(latestRequest.id);
      setSnack({ open: true, severity: "info", message: "Request cancelled." });
      refreshUserState();
    } catch (e) {
      setSnack({ open: true, severity: "error", message: e?.message || "Unable to cancel request." });
    }
  };

  const handleLoginSubmit = () => {
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setSnack({ open: true, severity: "error", message: "Please enter email and password." });
      return;
    }
    // Simulate login (in a real app, this would call an API)
    const mockUser = {
      id: Date.now(),
      email: loginForm.email,
      name: loginForm.email.split("@")[0],
      company: "",
      role: "viewer",
    };
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    window.dispatchEvent(new Event("auth:updated"));
    setAuthUser(mockUser);
    setLoginModalOpen(false);
    setLoginForm({ email: "", password: "" });
    setSnack({ open: true, severity: "success", message: "Logged in successfully!" });
    // Open the subscription request dialog for the pending plan
    if (pendingPlanKey) {
      setTimeout(() => openRequestDialog(pendingPlanKey), 300);
    }
  };

  return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-gray)", py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <CreditCard size={28} color={SUBSCRIPTION_HEADER_COLOR} />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: SUBSCRIPTION_HEADER_COLOR }}>
                Subscription
              </Typography>
            </Box>
            <Typography sx={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              Pick a plan and submit a request. Your subscription is activated after Admin/Editor approval.
            </Typography>
          </Box>

          {/* Current state */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 4 }}>
            <Card sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--text-dark)", mb: 0.8 }}>
                  Current Subscription
                </Typography>
                {!userId ? (
                  <Typography sx={{ color: "var(--text-muted)" }}>
                    Sign in to view your subscription status and submit a request.
                  </Typography>
                ) : activeSubscription?.status === "active" ? (
                  <>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{ mb: 1.5, backgroundColor: "#f0fdf4", color: "#16a34a", fontWeight: 700 }}
                    />
                    <Typography sx={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-dark)" }}>
                      {activeSubscription.planName}
                    </Typography>
                    <Typography sx={{ color: "var(--text-muted)", mt: 0.5 }}>
                      {activeSubscription.billingCycle} • {activeSubscription.seats} seat{activeSubscription.seats > 1 ? "s" : ""} • {activeSubscription.company}
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ color: "var(--text-muted)" }}>
                    No active subscription yet.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--text-dark)", mb: 0.8 }}>
                  Latest Request
                </Typography>
                {!userId ? (
                  <Typography sx={{ color: "var(--text-muted)" }}>
                    Sign in to submit a subscription request.
                  </Typography>
                ) : !latestRequest ? (
                  <Typography sx={{ color: "var(--text-muted)" }}>
                    No request submitted yet.
                  </Typography>
                ) : (
                  <>
                    {(() => {
                      const s = statusMeta(latestRequest.status);
                      return (
                        <Chip
                          icon={s.icon}
                          label={s.label}
                          size="small"
                          sx={{ mb: 1.5, backgroundColor: s.bg, color: s.color, fontWeight: 700 }}
                        />
                      );
                    })()}
                    <Typography sx={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-dark)" }}>
                      {latestRequest.planName} ({latestRequest.billingCycle})
                    </Typography>
                    <Typography sx={{ color: "var(--text-muted)", mt: 0.5 }}>
                      Seats: {latestRequest.seats} • Company: {latestRequest.company}
                    </Typography>
                    {latestRequest.reviewNotes ? (
                      <Typography sx={{ color: "var(--text-muted)", mt: 1 }}>
                        Review notes: <b style={{ color: "var(--text-dark)" }}>{latestRequest.reviewNotes}</b>
                      </Typography>
                    ) : null}
                    <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancelRequest}
                        disabled={latestRequest.status !== "PENDING"}
                        sx={{ textTransform: "none", fontWeight: 800, borderRadius: 1.5, borderColor: "var(--border-color)", color: "var(--text-dark)" }}
                      >
                        Cancel request
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => openRequestDialog(latestRequest.planKey)}
                        disabled={latestRequest.status !== "PENDING"}
                        startIcon={<Send size={16} />}
                        sx={{ textTransform: "none", fontWeight: 800, borderRadius: 1.5, backgroundColor: PRIMARY, color: "#fff", boxShadow: "none", "&:hover": { backgroundColor: "#49b2b1", boxShadow: "none" } }}
                      >
                        Resubmit
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Plans */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 900, color: "var(--text-dark)", fontSize: "1.1rem" }}>💼 Subscription Plans</Typography>
              <Typography sx={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Choose a plan that works for you</Typography>
            </Box>
            <Chip icon={<ShieldCheck size={16} />} label="Reviewed by Admin/Editor" variant="outlined" />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5 }}>
            {PLANS.map((plan) => (
              <Card key={plan.key} sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.3, height: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: "var(--text-dark)", fontSize: "1.05rem" }}>
                        {plan.emoji} {plan.name}
                      </Typography>
                      <Typography sx={{ color: "var(--text-muted)", fontSize: "0.82rem", mt: 0.3 }}>
                        {plan.tagline}
                      </Typography>
                    </Box>
                    {plan.popular ? (
                      <Chip
                        label="Popular"
                        size="small"
                        sx={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY, fontWeight: 800 }}
                      />
                    ) : null}
                  </Box>

                  <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: plan.accent }}>
                    {plan.price}
                  </Typography>

                  <Box sx={{ display: "grid", gap: 0.6, mt: 0.5, mb: 0.5 }}>
                    {plan.features.map((f) => (
                      <Box key={f} sx={{ display: "flex", alignItems: "flex-start", gap: 0.8 }}>
                        <CheckCircle size={14} color={plan.accent} style={{ marginTop: 3 }} />
                        <Typography sx={{ fontSize: "0.86rem", color: "var(--text-dark)" }}>{f}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ flex: 1 }} />
                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    onClick={() => openRequestDialog(plan.key)}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: "none",
                      fontWeight: 900,
                      backgroundColor: plan.popular ? PRIMARY : "transparent",
                      borderColor: PRIMARY,
                      color: plan.popular ? "#fff" : PRIMARY,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: plan.popular ? "#49b2b1" : PRIMARY,
                        color: plan.popular ? "#fff" : "#fff",
                        boxShadow: "none"
                      },
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>

        {/* Submit request dialog */}
        <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>
            Submit Subscription Request
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
              Requests are reviewed and activated by Admin/Editor roles.
            </Alert>

            <Box sx={{ display: "grid", gap: 1.5 }}>
              <TextField
                select
                label="Plan"
                value={form.planKey}
                onChange={(e) => setForm((p) => ({ ...p, planKey: e.target.value }))}
                fullWidth
              >
                {PLANS.map((p) => (
                  <MenuItem key={p.key} value={p.key}>
                    {p.name} — {p.price}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Billing cycle"
                value={form.billingCycle}
                onChange={(e) => setForm((p) => ({ ...p, billingCycle: e.target.value }))}
                fullWidth
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="annual">Annual</MenuItem>
              </TextField>

              <TextField
                label="Seats"
                type="number"
                inputProps={{ min: 1 }}
                value={form.seats}
                onChange={(e) => setForm((p) => ({ ...p, seats: e.target.value }))}
                fullWidth
              />

              <TextField
                label="Company"
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                fullWidth
              />

              <TextField
                label="Contact name"
                value={form.contactName}
                onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                fullWidth
              />

              <TextField
                label="Contact email"
                value={form.contactEmail}
                onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                fullWidth
              />

              <TextField
                label="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                fullWidth
                multiline
                minRows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRequestOpen(false)} sx={{ textTransform: "none", fontWeight: 800 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<Send size={16} />}
              sx={{ textTransform: "none", fontWeight: 900, backgroundColor: PRIMARY, color: "#fff", boxShadow: "none", "&:hover": { backgroundColor: "#49b2b1", boxShadow: "none" } }}
            >
              Submit request
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>

        {/* Slide-in Login Modal */}
        <Dialog
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 2,
              animation: "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "@keyframes slideInRight": {
                "0%": { transform: "translateX(100%)", opacity: 0 },
                "100%": { transform: "translateX(0)", opacity: 1 },
              },
            },
          }}
          BackdropProps={{
            sx: { backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" },
          }}
        >
          <DialogTitle sx={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-dark)" }}>
            Sign in to Continue
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography sx={{ color: "var(--text-muted)", fontSize: "0.9rem", mb: 2 }}>
              Please sign in to access subscription plans and submit your request.
            </Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Mail size={18} color={PRIMARY} /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Enter password"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock size={18} color={PRIMARY} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography sx={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>
                Demo: Use any email with password <b>demo123</b>
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={() => {
                setLoginModalOpen(false);
                setLoginForm({ email: "", password: "" });
              }}
              sx={{ textTransform: "none", fontWeight: 800, color: "var(--text-dark)" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleLoginSubmit}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                backgroundColor: PRIMARY,
                color: "#fff",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#49b2b1", boxShadow: "none" },
              }}
            >
              Sign In
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageLayout>
  );
}
