import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
  Chip, Avatar, Tab, Tabs, Button, Modal, Fade, Backdrop, MenuItem, IconButton,
  Alert,
} from "@mui/material";
import {
  Search, FileText, ChevronUp, Calendar, FileIcon, HardDrive, Download,
  MoreVertical, TrendingUp, Eye, Star, BookOpen, Share2, Bookmark,
  ArrowUpRight, BarChart3, Users, Plus, X, Info, Send, FilePlus,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import PageLayout from "../components/PageLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

const reportTrendsData = [
  { month: "Jan", reports: 45, citations: 120 },
  { month: "Feb", reports: 52, citations: 150 },
  { month: "Mar", reports: 48, citations: 180 },
  { month: "Apr", reports: 61, citations: 210 },
  { month: "May", reports: 55, citations: 240 },
  { month: "Jun", reports: 72, citations: 310 },
];

const categoryDistribution = [
  { name: "Environment", value: 35 },
  { name: "Technology", value: 25 },
  { name: "Healthcare", value: 20 },
  { name: "Finance", value: 12 },
  { name: "Urban", value: 8 },
];

const COLORS = ["#61C5C3", "#4fb3b1", "#3d9e9c", "#2b8987", "#1a7472"];


const reportDatasets = [
  { id: 1, title: "Q2 2024 Global Climate Impact Report", author: "ClimateResearch Lab", authorAvatar: "CR", category: "Agriculture and Environment", usability: "10.0", updated: "Updated 1 day ago", files: "5 Files (CSV, PDF)", size: "3.2 GB", downloads: "2,841 downloads", votes: 72, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80", price: "349.00", views: 9420, rating: 4.9, reportType: "Quarterly", pages: 84, citations: 127, abstract: "Comprehensive analysis of climate change impacts across 120 countries with predictive models for 2025-2030." },
  { id: 2, title: "AI & Machine Learning State of the Industry 2024", author: "TechAnalytics Group", authorAvatar: "TA", category: "Computer Science", usability: "10.0", updated: "Updated 3 days ago", files: "3 Files (PDF, CSV)", size: "1.4 GB", downloads: "4,562 downloads", votes: 98, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80", price: "599.00", views: 18300, rating: 4.9, reportType: "Annual", pages: 156, citations: 284, abstract: "Deep dive into AI adoption rates, model performance benchmarks, and industry transformation metrics." },
  { id: 3, title: "Global Healthcare Outcomes Annual Report", author: "MedAnalytics Institute", authorAvatar: "MI", category: "Social Services", usability: "9.7", updated: "Updated 2 days ago", files: "4 Files (PDF, JSON)", size: "2.8 GB", downloads: "1,987 downloads", votes: 54, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", price: "799.00", views: 7210, rating: 4.8, reportType: "Annual", pages: 212, citations: 341, abstract: "Patient outcome analysis across 50+ healthcare systems with treatment efficacy comparisons." },
  { id: 4, title: "Financial Markets Volatility Report H1 2024", author: "QuantAnalytics", authorAvatar: "QA", category: "Finance and Investment", usability: "9.8", updated: "Updated 5 days ago", files: "2 Files (PDF, CSV)", size: "980 MB", downloads: "3,102 downloads", votes: 67, image: "https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80", price: "499.00", views: 12400, rating: 4.8, reportType: "Semi-Annual", pages: 98, citations: 189, abstract: "Risk analysis and volatility metrics for global equity, bond, and commodity markets." },
  { id: 5, title: "Urban Mobility & Smart Cities Report 2024", author: "CityMetrics Lab", authorAvatar: "CM", category: "Infrastructure and Transport", usability: "9.5", updated: "Updated 4 days ago", files: "3 Files (PDF, CSV)", size: "1.9 GB", downloads: "1,243 downloads", votes: 43, image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&w=900&q=80", price: "449.00", views: 5890, rating: 4.6, reportType: "Annual", pages: 134, citations: 98, abstract: "Smart city infrastructure analysis covering 50 metropolitan areas and mobility pattern insights." },
  { id: 6, title: "Renewable Energy Transition Report 2024", author: "EnergyStats Institute", authorAvatar: "ES", category: "Natural Resources and Energy", usability: "9.8", updated: "Updated 6 days ago", files: "4 Files (PDF, CSV)", size: "2.1 GB", downloads: "1,678 downloads", votes: 58, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80", price: "399.00", views: 8340, rating: 4.7, reportType: "Annual", pages: 118, citations: 156, abstract: "Global renewable energy adoption rates, investment flows, and carbon reduction progress." },
];

const reportTypes = ["All", "Annual", "Quarterly", "Semi-Annual", "Monthly", "Special"];

export default function ReportsPage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();
  const PRIMARY = themeColors.teal;

  const reportStats = [
    { label: "Published Reports", value: "3,840", change: "+22%", icon: <FileText size={22} color={PRIMARY} /> },
    { label: "Total Citations", value: "48.2K", change: "+18%", icon: <BookOpen size={22} color={PRIMARY} /> },
    { label: "Total Views", value: "1.2M", change: "+31%", icon: <Eye size={22} color={PRIMARY} /> },
    { label: "Contributors", value: "2,140", change: "+14%", icon: <Users size={22} color={PRIMARY} /> },
  ];
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(0);
  const [selectedType, setSelectedType] = useState("All");
  const [bookmarked, setBookmarked] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", deadline: "", budget: "", priority: "Medium" });
  const [submitted, setSubmitted] = useState(false);

  const chartTooltipStyle = {
    backgroundColor: themeColors.isDarkMode ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
    border: `1px solid var(--border-color)`,
    borderRadius: 8,
    boxShadow: themeColors.isDarkMode ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    color: themeColors.text,
  };

  const sortedAndFiltered = useMemo(() => {
    let result = reportDatasets.filter(d => {
      const ms = d.title.toLowerCase().includes(search.toLowerCase()) || d.author.toLowerCase().includes(search.toLowerCase());
      const mt = selectedType === "All" || d.reportType === selectedType;
      return ms && mt;
    });

    if (tab === 1) result = [...result].sort((a, b) => b.citations - a.citations);
    if (tab === 2) result = [...result].sort((a, b) => b.views - a.views);
    if (tab === 3) result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));

    return result;
   }, [search, selectedType, tab]);

   const toggleBookmark = (id) => setBookmarked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
 
   const handleOpenModal = () => setIsModalOpen(true);
   const handleCloseModal = () => {
     setIsModalOpen(false);
     setForm({ title: "", description: "", deadline: "", budget: "", priority: "Medium" });
     setSubmitted(false);
   };
 
   const handleInputChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });
 
   const handleSubmit = () => {
     if (!form.title || !form.description) return;
     setSubmitted(true);
     setTimeout(() => handleCloseModal(), 2000);
   };
 
   return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-gray)", py: 4, transition: "background-color 0.3s ease" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <FileText size={28} color={PRIMARY} />
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)" }}>Dataset Reports</Typography>
              </Box>
              <Typography sx={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                Access published research reports, industry analyses, and data-driven insights
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" startIcon={<Plus size={18} />} onClick={handleOpenModal}
                sx={{ borderRadius: "8px", borderColor: PRIMARY, color: PRIMARY, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#4fb3b1", backgroundColor: "#f0fdfa" } }}>
                Request Custom Report
              </Button>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 4 }}>
            {reportStats.map(s => (
              <Card key={s.label} sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none" }}>
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
                    <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: "rgba(97, 197, 195, 0.1)" }}>{s.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Charts Section */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3, mb: 4 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid var(--border-color)", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography sx={{ fontWeight: 800, color: "var(--text-dark)" }}>Report & Citation Trends</Typography>
                  <Chip label="Last 6 Months" size="small" sx={{ borderRadius: "4px", fontSize: "0.7rem" }} />
                </Box>
                <Box sx={{ height: 280, width: "100%", minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportTrendsData}>
                      <defs>
                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={PRIMARY} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.border} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: themeColors.textMuted }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: themeColors.textMuted }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Area type="monotone" dataKey="reports" stroke={PRIMARY} strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                      <Area type="monotone" dataKey="citations" stroke={themeColors.text} strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, border: "1px solid var(--border-color)", boxShadow: "none" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--text-dark)", mb: 3 }}>Report Categories</Typography>
                <Box sx={{ height: 280, width: "100%", minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Search */}
          <TextField fullWidth placeholder="Search reports, authors, topics..." value={search} onChange={e => setSearch(e.target.value)} variant="outlined"
            sx={{ mb: 3, backgroundColor: "var(--card-bg)", borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 50 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={20} color={themeColors.textMuted} /></InputAdornment> }}
          />


          {/* Type Filter */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {reportTypes.map(t => (
              <Chip key={t} label={t} onClick={() => setSelectedType(t)} variant={selectedType === t ? "filled" : "outlined"}
                sx={{ borderRadius: "6px", fontSize: "0.82rem", backgroundColor: selectedType === t ? PRIMARY : "var(--card-bg)", color: selectedType === t ? "#fff" : "var(--text-dark)", borderColor: "var(--border-color)", "&:hover": { backgroundColor: selectedType === t ? PRIMARY : themeColors.hoverBg } }}
              />
            ))}
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: "1px solid var(--border-color)", mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)" }, "& .MuiTabs-indicator": { backgroundColor: PRIMARY } }}>
              <Tab label="All Reports" />
              <Tab label="Most Cited" />
              <Tab label="Most Viewed" />
              <Tab label="Recent" />
            </Tabs>
          </Box>

          {/* Report Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 3 }}>
            {sortedAndFiltered.map(d => (
              <ReportDatasetCard key={d.id} dataset={d} isBookmarked={bookmarked.includes(d.id)}
                onBookmark={() => toggleBookmark(d.id)}
                onOpen={() => navigate(`/dataset-info/${d.id}`, { state: { dataset: d } })}
                themeColors={themeColors}
                PRIMARY={PRIMARY}
              />
            ))}
          </Box>

          {sortedAndFiltered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <FileText size={48} color={themeColors.border} style={{ margin: "0 auto 16px" }} />
              <Typography sx={{ color: "var(--text-muted)" }}>No reports found</Typography>
            </Box>
          )}

          {/* Request Report Modal */}
          <Modal open={isModalOpen} onClose={handleCloseModal} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, sx: { backgroundColor: "rgba(17, 24, 39, 0.7)" } }}>
            <Fade in={isModalOpen}>
              <Box sx={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 550 }, bgcolor: "var(--card-bg)", borderRadius: 3,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", p: 0, overflow: "hidden", outline: "none"
              }}>
                <Box sx={{ px: 3, py: 2.5, backgroundColor: themeColors.isDarkMode ? "rgba(30, 41, 59, 0.5)" : "#f9fafb", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, backgroundColor: "rgba(97, 197, 195, 0.1)", borderRadius: 1.5, display: "flex" }}><FilePlus size={20} color={PRIMARY} /></Box>
                    <Box>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-dark)" }}>Request Custom Report</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tell us what research you need</Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={handleCloseModal} size="small"><X size={20} /></IconButton>
                </Box>

                <Box sx={{ p: 3 }}>
                  {submitted ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <Box sx={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(22, 163, 74, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Send size={32} color="#16a34a" />
                      </Box>
                      <Typography sx={{ fontWeight: 800, mb: 1 }}>Request Sent Successfully!</Typography>
                      <Typography sx={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Our analysts will review your request and get back to you within 24 hours.</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                      <TextField fullWidth label="Report Title / Topic" placeholder="e.g. Impact of AI on Fintech in West Africa" value={form.title} onChange={handleInputChange("title")} required />
                      <TextField fullWidth multiline rows={4} label="Detailed Requirements" placeholder="Describe the specific data points, regions, and metrics you need..." value={form.description} onChange={handleInputChange("description")} required />
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <TextField fullWidth label="Budget (USD)" type="number" value={form.budget} onChange={handleInputChange("budget")} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                        <TextField fullWidth select label="Priority" value={form.priority} onChange={handleInputChange("priority")}>
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Urgent">Urgent</MenuItem>
                        </TextField>
                      </Box>
                      <TextField fullWidth label="Deadline" type="date" value={form.deadline} onChange={handleInputChange("deadline")} InputLabelProps={{ shrink: true }} />
                      <Button fullWidth variant="contained" onClick={handleSubmit} disabled={!form.title || !form.description}
                        sx={{ mt: 1, py: 1.5, backgroundColor: PRIMARY, "&:hover": { backgroundColor: "#4fb3b1" }, fontWeight: 700, textTransform: "none", borderRadius: 2, boxShadow: "none" }}>
                        Submit Request
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Container>
      </Box>
    </PageLayout>
  );
}

function ReportDatasetCard({ dataset, isBookmarked, onBookmark, onOpen, themeColors, PRIMARY }) {
  const typeColors = { Annual: "#3b82f6", Quarterly: "#22c55e", "Semi-Annual": "#8b5cf6", Monthly: "#f59e0b" };
  const typeColor = typeColors[dataset.reportType] || PRIMARY;

  return (
    <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
      {/* Image */}
      <Box sx={{ height: 160, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: typeColor }}>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff" }}>{dataset.reportType}</Typography>
        </Box>
        <Box onClick={e => { e.stopPropagation(); onBookmark(); }}
          sx={{
            position: "absolute", top: 8, right: 8, p: 0.8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", "&:hover": { backgroundColor: "#fff" }
          }}>
          <Bookmark size={14} color={isBookmarked ? PRIMARY : "#9ca3af"} fill={isBookmarked ? PRIMARY : "none"} />
        </Box>
        <Box sx={{ position: "absolute", bottom: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{dataset.pages} Pages</Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Author */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 22, height: 22, fontSize: "0.65rem", backgroundColor: themeColors.hoverBg, color: "var(--text-dark)", border: "1px solid var(--border-color)" }}>{dataset.authorAvatar}</Avatar>
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)" }}>{dataset.author}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-dark)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
          <IconButton size="small" sx={{ p: 0.5 }}><MoreVertical size={16} color={themeColors.textMuted} /></IconButton>
        </Box>

        <Typography sx={{ fontSize: "0.82rem", color: "var(--text-muted)", mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>{dataset.abstract}</Typography>

        {/* Stats Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, p: 1.5, backgroundColor: themeColors.hoverBg, borderRadius: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-dark)" }}>{dataset.citations}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Citations</Typography>
          </Box>
          <Box sx={{ width: 1, height: 20, backgroundColor: themeColors.border }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-dark)" }}>{dataset.views >= 1000 ? (dataset.views/1000).toFixed(1) + "k" : dataset.views}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Views</Typography>
          </Box>
          <Box sx={{ width: 1, height: 20, backgroundColor: themeColors.border }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#16a34a" }}>{dataset.usability}</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Score</Typography>
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)" }}>{dataset.rating}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY }}>${dataset.price}</Typography>
            <Button size="small" variant="contained"
              sx={{
                px: 2, py: 0.5, borderRadius: "6px", backgroundColor: PRIMARY, color: "#fff",
                fontWeight: 700, textTransform: "none", fontSize: "0.75rem", boxShadow: "none",
                "&:hover": { backgroundColor: "#4fb3b1", boxShadow: "none" }
              }}>
              Preview
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
