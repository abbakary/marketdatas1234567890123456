import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
  Chip, LinearProgress, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Snackbar, Alert,
} from "@mui/material";
import {
  Search, Wallet, ChevronUp, Calendar, FileIcon, HardDrive, Download,
  MoreVertical, TrendingUp, Users, Target, Clock, CheckCircle, ArrowUpRight, Plus, Send, Grid3x3, List,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import fundRequestService from "../../../utils/fundRequestService";

const PRIMARY = "#61C5C3";
const USER_KEY = "dali-user";

const fundedDatasets = [
  { id: 1, title: "Global Climate Data 2024", author: "GreenData Inc.", category: "Agriculture and Environment", usability: "10.0", updated: "Updated 2 days ago", files: "3 Files (CSV)", size: "2.5 GB", downloads: "1,245 downloads", votes: 48, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80", price: "299.00", fundingGoal: 50000, fundingRaised: 42300, backers: 142, daysLeft: 12, fundingType: "Grant", description: "Funding to expand climate monitoring to 50 additional regions globally." },
  { id: 2, title: "AI Training Dataset - Images", author: "AIDataHub", category: "Computer Science", usability: "10.0", updated: "Updated 3 days ago", files: "5 Files (Images)", size: "15 GB", downloads: "2,100 downloads", votes: 67, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80", price: "899.00", fundingGoal: 120000, fundingRaised: 98500, backers: 287, daysLeft: 5, fundingType: "Investment", description: "Expanding AI training dataset to 10M labeled images across 500 categories." },
  { id: 3, title: "Healthcare Analytics Dataset", author: "MedData Corp", category: "Social Services", usability: "9.5", updated: "Updated 1 day ago", files: "4 Files (JSON)", size: "5.2 GB", downloads: "0 downloads", votes: 0, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", price: "899.00", fundingGoal: 80000, fundingRaised: 31200, backers: 89, daysLeft: 21, fundingType: "Research Grant", description: "Anonymizing and expanding patient outcome data for public health research." },
  { id: 4, title: "Energy Consumption Patterns", author: "EnergyStats", category: "Natural Resources and Energy", usability: "9.8", updated: "Updated 8 days ago", files: "5 Files (CSV)", size: "4.2 GB", downloads: "678 downloads", votes: 38, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80", price: "449.00", fundingGoal: 35000, fundingRaised: 35000, backers: 203, daysLeft: 0, fundingType: "Crowdfund", description: "Fully funded! Expanding renewable energy data to 80 countries." },
  { id: 5, title: "Urban Development Stats", author: "CityData Labs", category: "Urban Development and Housing", usability: "9.7", updated: "Updated 7 days ago", files: "3 Files (CSV)", size: "1.2 GB", downloads: "560 downloads", votes: 29, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80", price: "349.00", fundingGoal: 25000, fundingRaised: 8900, backers: 44, daysLeft: 30, fundingType: "Grant", description: "Funding urban data collection for 30 emerging cities in Southeast Asia." },
  { id: 6, title: "Genomics Research Data", author: "BioData Institute", category: "Social Services", usability: "10.0", updated: "Updated 4 days ago", files: "6 Files (CSV, JSON)", size: "8.4 GB", downloads: "340 downloads", votes: 52, image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?auto=format&fit=crop&w=900&q=80", price: "799.00", fundingGoal: 200000, fundingRaised: 156000, backers: 412, daysLeft: 8, fundingType: "Research Grant", description: "Expanding genomics sequencing to rare disease populations worldwide." },
];

const fundingStats = [
  { label: "Total Funded", value: "$2.4M", change: "+18%", icon: <Wallet size={22} color={PRIMARY} /> },
  { label: "Active Campaigns", value: "47", change: "+12", icon: <Target size={22} color={PRIMARY} /> },
  { label: "Total Backers", value: "8,320", change: "+24%", icon: <Users size={22} color={PRIMARY} /> },
  { label: "Success Rate", value: "78%", change: "+5%", icon: <TrendingUp size={22} color={PRIMARY} /> },
];

const fundingTypes = ["All", "Grant", "Investment", "Research Grant", "Crowdfund"];

export default function FundsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [viewType, setViewType] = useState("grid");
  const [requestOpen, setRequestOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });
  const [authUser, setAuthUser] = useState(null);
  const [latestRequest, setLatestRequest] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Finance and Investment",
    dataType: "CSV",
    fundingType: "Grant",
    amount: "",
    amountCurrency: "USD",
    timeline: "0-30 days",
    company: "",
    contactName: "",
    contactEmail: "",
  });

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      const parsed = rawUser ? JSON.parse(rawUser) : null;
      setAuthUser(parsed);
    } catch {
      setAuthUser(null);
    }
  }, []);

  const userId = authUser?.id || authUser?._id || authUser?.userId || null;

  const refresh = () => {
    if (!userId) {
      setLatestRequest(null);
      return;
    }
    setLatestRequest(fundRequestService.getLatestRequestByUser(String(userId)));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const openRequest = () => {
    setForm((p) => ({
      ...p,
      company: p.company || authUser?.company || "",
      contactName: p.contactName || authUser?.full_name || authUser?.name || "",
      contactEmail: p.contactEmail || authUser?.email || "",
    }));
    setRequestOpen(true);
  };

  const validate = () => {
    const errors = [];
    if (!userId) errors.push("Please sign in first to request funding.");
    if (!form.title.trim()) errors.push("Title is required.");
    if (!form.description.trim()) errors.push("Description is required.");
    if (!form.company.trim()) errors.push("Company is required.");
    if (!form.contactName.trim()) errors.push("Contact name is required.");
    if (!form.contactEmail.trim() || !form.contactEmail.includes("@")) errors.push("A valid email is required.");
    if (!String(form.amount).trim() || Number(form.amount) <= 0) errors.push("Requested amount must be greater than 0.");
    return errors;
  };

  const submitFundRequest = () => {
    const errors = validate();
    if (errors.length) {
      setSnack({ open: true, severity: "error", message: errors[0] });
      return;
    }

    const req = fundRequestService.createRequest({
      userId: String(userId),
      userName: form.contactName.trim(),
      userEmail: form.contactEmail.trim(),
      company: form.company.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      dataType: form.dataType,
      fundingType: form.fundingType,
      amount: Number(form.amount),
      amountCurrency: form.amountCurrency,
      timeline: form.timeline,
    });

    setLatestRequest(req);
    setRequestOpen(false);
    setSnack({ open: true, severity: "success", message: "Fund request submitted. Awaiting Admin/Editor review." });
    refresh();
  };

  const sortOptions = [
    { value: "trending", label: "Hotness" },
    { value: "funded", label: "Most Funded" },
    { value: "ending", label: "Ending Soon" },
  ];

  const filtered = fundedDatasets
    .filter((d) => {
      const ms =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.author.toLowerCase().includes(search.toLowerCase());
      const mt = selectedType === "All" || d.fundingType === selectedType;
      return ms && mt;
    })
    .sort((a, b) => {
      if (sortBy === "trending") return b.backers - a.backers;
      if (sortBy === "ending") return a.daysLeft - b.daysLeft;
      if (sortBy === "funded") return b.fundingRaised / b.fundingGoal - a.fundingRaised / a.fundingGoal;
      return 0;
    });

  return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-gray)", py: 4, transition: "background-color 0.3s ease" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 4,
              flexWrap: { xs: "wrap", md: "nowrap" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Wallet size={28} color={PRIMARY} />
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)" }}>Dataset Funds</Typography>
              </Box>
              <Typography sx={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                Support dataset creation through grants, investments, and crowdfunding campaigns. Or request funding for a dataset initiative that fits your need.
              </Typography>
            </Box>
            <Box
              onClick={openRequest}
              sx={{
                px: 2.5,
                py: 1.2,
                backgroundColor: PRIMARY,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
                whiteSpace: "nowrap",
                flexShrink: 0,
                "&:hover": { backgroundColor: "#49b2b1" },
              }}
            >
              <Plus size={16} color="#fff" />
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Request Custom Fund</Typography>
            </Box>
          </Box>

          {latestRequest && (
            <Card sx={{ borderRadius: 2, border: `1px solid ${PRIMARY}55`, boxShadow: "none", mb: 3, backgroundColor: `${PRIMARY}10` }}>
              <CardContent sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ fontWeight: 900, color: "var(--text-dark)" }}>Latest fund request</Typography>
                  <Typography sx={{ color: "var(--text-muted)", fontSize: "0.9rem", mt: 0.3 }}>
                    {latestRequest.title} • {latestRequest.amountCurrency} {Number(latestRequest.amount || 0).toLocaleString()} • {latestRequest.timeline}
                  </Typography>
                </Box>
                <Chip
                  label={String(latestRequest.status).toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    backgroundColor:
                      latestRequest.status === "PENDING" ? "#fffbeb" : latestRequest.status === "APPROVED" ? "#f0fdf4" : latestRequest.status === "REJECTED" ? "#fef2f2" : "#f9fafb",
                    color:
                      latestRequest.status === "PENDING" ? "#f59e0b" : latestRequest.status === "APPROVED" ? "#16a34a" : latestRequest.status === "REJECTED" ? "#dc2626" : "#6b7280",
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 4 }}>
            {fundingStats.map(s => (
              <Card key={s.label} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 0.5 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-dark)" }}>{s.value}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <ArrowUpRight size={13} color="#16a34a" />
                        <Typography sx={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600 }}>{s.change}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: "#e6f7f6" }}>{s.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Search + Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField flex={1} placeholder="Search funding campaigns..." value={search} onChange={e => setSearch(e.target.value)} variant="outlined" size="small"
              sx={{ flex: 1, minWidth: 280, backgroundColor: "#fff", borderRadius: "8px", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color="#6b7280" /></InputAdornment> }}
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {fundingTypes.map(t => (
                <Chip key={t} label={t} onClick={() => setSelectedType(t)} variant={selectedType === t ? "filled" : "outlined"}
                  sx={{ borderRadius: "6px", fontSize: "0.82rem", backgroundColor: selectedType === t ? PRIMARY : "#fff", color: selectedType === t ? "#fff" : "#374151", borderColor: "#d1d5db", "&:hover": { backgroundColor: selectedType === t ? PRIMARY : "#e6f7f6" } }}
                />
              ))}
            </Box>
          </Box>

          {/* Controls: sort + view (always visible) */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {sortOptions.map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: sortBy === opt.value ? PRIMARY : "#fff",
                    border: `1px solid ${sortBy === opt.value ? PRIMARY : "#e5e7eb"}`,
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: sortBy === opt.value ? "#fff" : "#374151" }}>
                    {opt.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 0.5, backgroundColor: "#fff", borderRadius: "8px", padding: "4px", border: "1px solid #e5e7eb" }}>
              <Box
                onClick={() => setViewType("grid")}
                sx={{
                  p: 0.8,
                  borderRadius: "6px",
                  backgroundColor: viewType === "grid" ? "#f9fafb" : "transparent",
                  border: viewType === "grid" ? "1px solid #e5e7eb" : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
                title="Grid View"
              >
                <Grid3x3 size={18} color={viewType === "grid" ? PRIMARY : "#6b7280"} />
              </Box>
              <Box
                onClick={() => setViewType("list")}
                sx={{
                  p: 0.8,
                  borderRadius: "6px",
                  backgroundColor: viewType === "list" ? "#f9fafb" : "transparent",
                  border: viewType === "list" ? "1px solid #e5e7eb" : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
                title="List View"
              >
                <List size={18} color={viewType === "list" ? PRIMARY : "#6b7280"} />
              </Box>
            </Box>
          </Box>

          {/* Funding Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: viewType === "grid" ? { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" } : "1fr",
              gap: 3,
            }}
          >
            {filtered.map(d => (
              <FundingDatasetCard key={d.id} dataset={d} viewType={viewType} onOpen={() => navigate(`/dataset-info/${d.id}`, { state: { dataset: d } })} />
            ))}
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Wallet size={48} color="#d1d5db" style={{ margin: "0 auto 16px" }} />
              <Typography sx={{ color: "var(--text-muted)" }}>No funding campaigns found</Typography>
            </Box>
          )}
        </Container>

        {/* Request Custom Fund dialog */}
        <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>Request Custom Fund</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
              Your request will be reviewed and managed by Admin/Editor roles.
            </Alert>

            <Box sx={{ display: "grid", gap: 1.5 }}>
              <TextField
                label="Request title"
                placeholder="e.g. Funding for Healthcare Analytics Dataset Expansion"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Describe your funding need"
                placeholder="What dataset are you building or improving, and why you need funding?"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                fullWidth
                multiline
                minRows={3}
              />

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                <TextField select label="Funding type" value={form.fundingType} onChange={(e) => setForm((p) => ({ ...p, fundingType: e.target.value }))} fullWidth>
                  {["Grant", "Investment", "Research Grant", "Crowdfund"].map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
                <TextField select label="Data type" value={form.dataType} onChange={(e) => setForm((p) => ({ ...p, dataType: e.target.value }))} fullWidth>
                  {["CSV", "JSON", "Images", "Text", "API", "Mixed"].map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                <TextField
                  label="Requested amount"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  fullWidth
                />
                <TextField select label="Currency" value={form.amountCurrency} onChange={(e) => setForm((p) => ({ ...p, amountCurrency: e.target.value }))} fullWidth>
                  {["USD", "EUR", "GBP"].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField select label="Timeline" value={form.timeline} onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))} fullWidth>
                {["0-30 days", "1-3 months", "3-6 months", "6-12 months"].map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Company"
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                fullWidth
              />

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
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
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRequestOpen(false)} sx={{ textTransform: "none", fontWeight: 800 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitFundRequest}
              startIcon={<Send size={16} />}
              sx={{ textTransform: "none", fontWeight: 900, backgroundColor: PRIMARY, boxShadow: "none", "&:hover": { backgroundColor: "#49b2b1", boxShadow: "none" } }}
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
      </Box>
    </PageLayout>
  );
}

function FundingDatasetCard({ dataset, viewType, onOpen }) {
  const pct = Math.min(Math.round((dataset.fundingRaised / dataset.fundingGoal) * 100), 100);
  const isFunded = pct >= 100;
  const isEndingSoon = dataset.daysLeft > 0 && dataset.daysLeft <= 7;

  const typeColors = { Grant: "#3b82f6", Investment: "#8b5cf6", "Research Grant": "#f59e0b", Crowdfund: "#22c55e" };
  const typeColor = typeColors[dataset.fundingType] || PRIMARY;

  if (viewType === "list") {
    return (
      <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", display: "flex", "&:hover": { boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
        {/* Image - Left side */}
        <Box sx={{ width: 180, height: 160, flexShrink: 0, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
          <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: typeColor }}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.fundingType}</Typography>
          </Box>
          {isFunded && (
            <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "#16a34a", display: "flex", alignItems: "center", gap: 0.5 }}>
              <CheckCircle size={11} color="#fff" />
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>Funded!</Typography>
            </Box>
          )}
          {isEndingSoon && !isFunded && (
            <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "#dc2626", display: "flex", alignItems: "center", gap: 0.5 }}>
              <Clock size={11} color="#fff" />
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.daysLeft}d left</Typography>
            </Box>
          )}
        </Box>

        {/* Content - Right side */}
        <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.6 }}>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-dark)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.82rem", color: "#1f2937", fontWeight: 500, mb: 0.4 }}>{dataset.author}</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.description}</Typography>

            {/* Funding Progress */}
            <Box sx={{ mb: 0.8 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-dark)" }}>${dataset.fundingRaised.toLocaleString()}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>of ${dataset.fundingGoal.toLocaleString()}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, backgroundColor: "#e5e7eb", "& .MuiLinearProgress-bar": { backgroundColor: isFunded ? "#16a34a" : PRIMARY, borderRadius: 3 } }} />
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden" }}>
                <Box sx={{ px: 0.6, py: 0.2, borderRight: "1px solid #d1d5db", display: "flex", alignItems: "center" }}><ChevronUp size={11} /></Box>
                <Box sx={{ px: 0.8, py: 0.2 }}><Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>{dataset.votes}</Typography></Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                <Users size={11} color="#6b7280" />
                <Typography sx={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{dataset.backers}</Typography>
              </Box>
            </Box>
            <Box sx={{ px: 1.5, py: 0.5, backgroundColor: isFunded ? "#f0fdf4" : "#e6f7f6", borderRadius: "6px", border: `1px solid ${isFunded ? "#bbf7d0" : PRIMARY}` }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: isFunded ? "#16a34a" : PRIMARY }}>{isFunded ? "View" : "Back"}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
      {/* Image */}
      <Box sx={{ height: 160, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: typeColor }}>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.fundingType}</Typography>
        </Box>
        {isFunded && (
          <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "#16a34a", display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircle size={11} color="#fff" />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>Funded!</Typography>
          </Box>
        )}
        {isEndingSoon && !isFunded && (
          <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "#dc2626", display: "flex", alignItems: "center", gap: 0.5 }}>
            <Clock size={11} color="#fff" />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.daysLeft}d left</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.8 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-dark)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
          <MoreVertical size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
        </Box>
        <Typography sx={{ fontSize: "0.82rem", color: "#1f2937", fontWeight: 500, mb: 0.8 }}>{dataset.author}</Typography>
        <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.description}</Typography>

        {/* File Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0.6, mb: 1.5, pb: 1.5, borderBottom: "1px solid #e5e7eb" }}>
          {[{ icon: <FileIcon size={12} color={PRIMARY} />, label: dataset.files }, { icon: <HardDrive size={12} color={PRIMARY} />, label: dataset.size }, { icon: <Download size={12} color={PRIMARY} />, label: dataset.downloads }].map((item, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3, p: 0.6, borderRadius: 1, backgroundColor: "#f9fafb" }}>
              {item.icon}
              <Typography sx={{ fontSize: "0.62rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.2 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Funding Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>${dataset.fundingRaised.toLocaleString()}</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>of ${dataset.fundingGoal.toLocaleString()}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, backgroundColor: "#e5e7eb", "& .MuiLinearProgress-bar": { backgroundColor: isFunded ? "#16a34a" : PRIMARY, borderRadius: 4 } }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.8 }}>
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: isFunded ? "#16a34a" : PRIMARY }}>{pct}% funded</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Users size={12} color="#6b7280" />
              <Typography sx={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{dataset.backers} backers</Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden" }}>
            <Box sx={{ px: 0.8, py: 0.3, borderRight: "1px solid #d1d5db", display: "flex", alignItems: "center" }}><ChevronUp size={12} /></Box>
            <Box sx={{ px: 1, py: 0.3 }}><Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>{dataset.votes}</Typography></Box>
          </Box>
          <Box sx={{ px: 2, py: 0.8, backgroundColor: isFunded ? "#f0fdf4" : "#e6f7f6", borderRadius: "8px", border: `1px solid ${isFunded ? "#bbf7d0" : PRIMARY}`, cursor: "pointer" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: isFunded ? "#16a34a" : PRIMARY }}>{isFunded ? "View Dataset" : "Back This"}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
