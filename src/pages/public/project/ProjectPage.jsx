import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
  Chip, Avatar, AvatarGroup, LinearProgress, Modal, Fade, Backdrop, MenuItem,
  IconButton, Button,
} from "@mui/material";
import {
  Search, FolderOpen, ChevronUp, Calendar, FileIcon, HardDrive, Download,
  MoreVertical, Users, GitFork, Star, Clock, CheckCircle, Play,
  SlidersHorizontal, TrendingUp, ArrowUpRight, Plus, X, Image as ImageIcon,
  Tag, Info, DollarSign, Upload, FileText,
} from "lucide-react";
import ProjectFiltersPanel from "../components/ProjectFiltersPanel";
import PageLayout from "../components/PageLayout";
import { categoriesData } from "../components/CategorySidebar";

const PRIMARY = "#FF8C00"; // Orange
const SECONDARY = "#20B2AA"; // Teal

const projectDatasets = [
  { id: 1, title: "Open Climate Monitoring Network", author: "ClimateResearch Lab", category: "Agriculture and Environment", projectType: "New Dataset Creation", monetization: "Open Data", fundingGoal: "$15,000", usability: "10.0", updated: "Updated 1 day ago", files: "8 Files (CSV, JSON)", size: "12.4 GB", downloads: "3,841 downloads", votes: 89, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80", price: "$449.00 USD", status: "Open for Investment", contributors: 42, forks: 128, stars: 384, progress: 72, tags: ["climate", "open-data", "monitoring"], avatars: ["https://i.pravatar.cc/40?img=11", "https://i.pravatar.cc/40?img=14", "https://i.pravatar.cc/40?img=21"] },
  { id: 2, title: "AI Benchmark Suite 2024", author: "AIResearch Hub", category: "Computer Science", projectType: "AI Training Set Prep", monetization: "Commercial", fundingGoal: "$50,000", usability: "10.0", updated: "Updated 5 hours ago", files: "12 Files (CSV, JSON)", size: "28.1 GB", downloads: "5,214 downloads", votes: 124, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80", price: "Negotiable", status: "Active Collaboration", contributors: 87, forks: 342, stars: 1240, progress: 88, tags: ["AI", "benchmarks", "NLP", "vision"], avatars: ["https://i.pravatar.cc/40?img=31", "https://i.pravatar.cc/40?img=41", "https://i.pravatar.cc/40?img=51"] },
  { id: 3, title: "Global Health Data Commons", author: "WHO Data Initiative", category: "Social Services", projectType: "Data Enrichment", monetization: "Subscription", fundingGoal: "$25,000", usability: "9.8", updated: "Updated 2 days ago", files: "6 Files (JSON, CSV)", size: "18.7 GB", downloads: "2,103 downloads", votes: 76, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", price: "Premium Access", status: "Active", contributors: 63, forks: 198, stars: 892, progress: 65, tags: ["health", "WHO", "public-health"], avatars: ["https://i.pravatar.cc/40?img=61", "https://i.pravatar.cc/40?img=71", "https://i.pravatar.cc/40?img=81"] },
  { id: 4, title: "Financial Inclusion Dataset Project", author: "FinTech Research", category: "Finance and Investment", projectType: "New Dataset Creation", monetization: "Commercial", fundingGoal: "$10,000", usability: "9.6", updated: "Updated 3 days ago", files: "5 Files (CSV)", size: "4.8 GB", downloads: "1,432 downloads", votes: 54, image: "https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80", price: "$299.00 USD", status: "Seeking Collaborators", contributors: 18, forks: 67, stars: 234, progress: 40, tags: ["finance", "inclusion", "banking"], avatars: ["https://i.pravatar.cc/40?img=91", "https://i.pravatar.cc/40?img=101"] },
  { id: 5, title: "Smart City Infrastructure Atlas", author: "Urban Data Collective", category: "Urban Development and Housing", projectType: "Data Cleaning", monetization: "One-time Sale", fundingGoal: "$8,000", usability: "9.5", updated: "Updated 6 days ago", files: "9 Files (CSV, GeoJSON)", size: "7.2 GB", downloads: "987 downloads", votes: 41, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80", price: "$199.00 USD", status: "Active", contributors: 29, forks: 84, stars: 312, progress: 55, tags: ["smart-city", "GIS", "urban"], avatars: ["https://i.pravatar.cc/40?img=111", "https://i.pravatar.cc/40?img=121"] },
  { id: 6, title: "Renewable Energy Open Dataset", author: "EnergyStats Collective", category: "Natural Resources and Energy", projectType: "Open Source Prep", monetization: "Open Data", fundingGoal: "$5,000", usability: "9.9", updated: "Updated 4 days ago", files: "7 Files (CSV, JSON)", size: "9.8 GB", downloads: "2,341 downloads", votes: 68, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80", price: "Free Listing", status: "Completed", contributors: 51, forks: 156, stars: 678, progress: 100, tags: ["energy", "renewable", "solar", "wind"], avatars: ["https://i.pravatar.cc/40?img=131", "https://i.pravatar.cc/40?img=141", "https://i.pravatar.cc/40?img=151"] },
];

const projectStats = [
  { label: "Listed Projects", value: "284", change: "+18", icon: <FolderOpen size={22} color={PRIMARY} /> },
  { label: "Expert Partners", value: "12.4K", change: "+24%", icon: <Users size={22} color={PRIMARY} /> },
  { label: "Active Collabs", value: "8,920", change: "+31%", icon: <GitFork size={22} color={PRIMARY} /> },
  { label: "Market Trust", value: "48.2K", change: "+22%", icon: <Star size={22} color={PRIMARY} /> },
];

const statusColors = { Active: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" }, "Seeking Contributors": { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" }, Completed: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" } };

export default function ProjectPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    tagSearch: "",
    selectedStatuses: [],
    selectedCategories: [],
    selectedProjectTypes: [],
    selectedMonetizationTypes: [],
    progressRange: [0, 100],
    minContributors: "",
    minStars: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });
  const [projects, setProjects] = useState(projectDatasets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    // Project Identity
    title: "",
    description: "",
    category: "",
    dataType: "CSV",
    datasetSize: "1-10GB",

    // Budget & Timeline
    budgetMin: "",
    budgetMax: "",
    deadline: "",

    // Collaboration
    preferredCollaborator: "",
    openToSuggestions: true,

    // Priority & Requirements
    priorityLevel: "Medium",
    sourcePreference: "",
    attachmentUrl: "",
  });

  const [imageType, setImageType] = useState("url"); 
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageName: file.name, image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80" }); 
    }
  };

  const categories = ["All", ...categoriesData.slice(0, 6).map(c => c.name)];
  const statuses = ["All", "Active", "Seeking Contributors", "Completed"];

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setIsFiltersPanelOpen(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      tagSearch: "",
      selectedStatuses: [],
      selectedCategories: [],
      selectedProjectTypes: [],
      selectedMonetizationTypes: [],
      progressRange: [0, 100],
      minContributors: "",
      minStars: ""
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  const filtered = projects.filter(d => {
    const ms = d.title.toLowerCase().includes(search.toLowerCase()) || 
               d.author.toLowerCase().includes(search.toLowerCase()) || 
               d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const mc = selectedCategory === "All" || d.category === selectedCategory;
    const mst = selectedStatus === "All" || d.status === selectedStatus;
    
    const matchAdvancedStatus = appliedFilters.selectedStatuses.length === 0 || 
                                appliedFilters.selectedStatuses.includes(d.status);
    const matchAdvancedCategory = appliedFilters.selectedCategories.length === 0 || 
                                  appliedFilters.selectedCategories.includes(d.category);
    const matchProjectType = appliedFilters.selectedProjectTypes.length === 0 || 
                             appliedFilters.selectedProjectTypes.includes(d.projectType);
    const matchMonetization = appliedFilters.selectedMonetizationTypes.length === 0 || 
                              appliedFilters.selectedMonetizationTypes.includes(d.monetization);
    const matchProgress = d.progress >= appliedFilters.progressRange[0] && 
                          d.progress <= appliedFilters.progressRange[1];
    const matchContributors = !appliedFilters.minContributors || 
                              d.contributors >= parseInt(appliedFilters.minContributors);
    const matchStars = !appliedFilters.minStars || 
                        d.stars >= parseInt(appliedFilters.minStars);
    const matchTags = !appliedFilters.tagSearch || 
                       d.tags.some(t => t.toLowerCase().includes(appliedFilters.tagSearch.toLowerCase()));

    return ms && mc && mst && matchAdvancedStatus && matchAdvancedCategory && 
           matchProjectType && matchMonetization && matchProgress && 
           matchContributors && matchStars && matchTags;
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm({
      title: "",
      description: "",
      category: "",
      dataType: "CSV",
      datasetSize: "1-10GB",
      budgetMin: "",
      budgetMax: "",
      deadline: "",
      preferredCollaborator: "",
      openToSuggestions: true,
      priorityLevel: "Medium",
      sourcePreference: "",
      attachmentUrl: "",
    });
  };

  const handleInputChange = (field) => (e) => {
     setForm({ ...form, [field]: e.target.value });
   };
 
   const handleSubmit = async () => {
     if (!form.title || !form.category || !form.budgetMin || !form.budgetMax || !form.deadline) {
       alert("Please fill in all required fields");
       return;
     }

     // In production, this would call the API
     // For now, we'll store it in local state or sessionStorage
     const newRequest = {
       id: `pr_${Date.now()}`,
       ...form,
       buyerId: localStorage.getItem('dali-user') ? JSON.parse(localStorage.getItem('dali-user')).id : '4',
       buyerName: localStorage.getItem('dali-user') ? JSON.parse(localStorage.getItem('dali-user')).name : 'You',
       status: 'PENDING',
       createdAt: new Date(),
       bids: [],
     };

     // Save to sessionStorage for demo
     const existingRequests = JSON.parse(sessionStorage.getItem('projectRequests') || '[]');
     existingRequests.push(newRequest);
     sessionStorage.setItem('projectRequests', JSON.stringify(existingRequests));

     alert('Request created successfully! Redirecting to buyer dashboard...');
     handleCloseModal();
     navigate('/dashboard/buyer/requests');
   };

   const handleVote = (id, e) => {
    e.stopPropagation();
    setProjects(projects.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fb", py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <FolderOpen size={28} color={PRIMARY} />
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#111827" }}>Project Marketplace</Typography>
              </Box>
              <Typography sx={{ color: "#6b7280", fontSize: "1rem" }}>
                Discover and invest in high-quality dataset projects. Request collaboration or purchase ownership of innovative data initiatives.
              </Typography>
            </Box>
            <Box
              onClick={handleOpenModal}
              sx={{ px: 2.5, py: 1.2, backgroundColor: PRIMARY, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 1, "&:hover": { backgroundColor: "#e67e00" } }}>
              <Plus size={16} color="#fff" />
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Request Collaborator Project</Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 4 }}>
            {projectStats.map(s => (
              <Card key={s.label} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 0.5 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827" }}>{s.value}</Typography>
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

          {/* Search */}
          <TextField fullWidth placeholder="Search projects, tags, contributors..." value={search} onChange={e => setSearch(e.target.value)} variant="outlined"
            sx={{ mb: 3, backgroundColor: "#fff", borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 50, fontSize: '0.95rem' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={20} color="#111827" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <Box 
                    onClick={() => setIsFiltersPanelOpen(true)}
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1, 
                      color: PRIMARY, 
                      cursor: "pointer",
                      padding: '6px 12px',
                      borderRadius: '8px',
                      '&:hover': { background: `${PRIMARY}10` }
                    }}
                  >
                    <SlidersHorizontal size={18} />
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: PRIMARY }}>Filters</Typography>
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.map(cat => (
                <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)} variant={selectedCategory === cat ? "filled" : "outlined"}
                  sx={{ borderRadius: "6px", fontSize: "0.82rem", height: 30, backgroundColor: selectedCategory === cat ? PRIMARY : "#fff", color: selectedCategory === cat ? "#fff" : "#374151", borderColor: "#d1d5db", "&:hover": { backgroundColor: selectedCategory === cat ? PRIMARY : "#e6f7f6" } }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {statuses.map(s => (
                <Chip key={s} label={s} onClick={() => setSelectedStatus(s)} variant={selectedStatus === s ? "filled" : "outlined"}
                  sx={{ borderRadius: "6px", fontSize: "0.82rem", height: 30, backgroundColor: selectedStatus === s ? "#111827" : "#fff", color: selectedStatus === s ? "#fff" : "#374151", borderColor: "#d1d5db" }}
                />
              ))}
            </Box>
          </Box>

          {/* Project Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 3 }}>
            {filtered.map(d => (
              <ProjectDatasetCard
                key={d.id}
                dataset={d}
                onOpen={() => navigate(`/dataset-info/${d.id}`, { state: { dataset: d } })}
                onVote={(e) => handleVote(d.id, e)}
              />
            ))}
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <FolderOpen size={48} color="#d1d5db" style={{ margin: "0 auto 16px" }} />
              <Typography sx={{ color: "#6b7280" }}>No projects found</Typography>
            </Box>
          )}

          {/* Project Form Modal */}
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, sx: { backgroundColor: "rgba(17, 24, 39, 0.7)" } }}
          >
            <Fade in={isModalOpen}>
              <Box sx={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 650, md: 750 }, bgcolor: "background.paper", borderRadius: 3,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                p: 0, overflow: "hidden", outline: "none", maxHeight: "90vh", display: "flex", flexDirection: "column"
              }}>
                {/* Modal Header */}
                <Box sx={{ px: 3, py: 2.5, backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, backgroundColor: "#e6f7f6", borderRadius: 1.5, display: "flex" }}>
                      <Plus size={20} color={PRIMARY} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Request Collaborator Project</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>Create a structured order for your dataset/project needs</Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={handleCloseModal} size="small" sx={{ color: "#9ca3af", "&:hover": { color: "#111827", backgroundColor: "#f3f4f6" } }}>
                    <X size={20} />
                  </IconButton>
                </Box>

                  <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
                    {/* Section 1: Core Request Information */}
                    <Box sx={{ mb: 3.5 }}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                        📝 Core Requirements
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Project Title *
                          </Typography>
                          <TextField fullWidth placeholder="e.g. Healthcare Claims Intelligence Dataset" value={form.title} onChange={handleInputChange("title")} required
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Box>

                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Category *
                          </Typography>
                          <TextField fullWidth select value={form.category} onChange={handleInputChange("category")} required
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                            {categories.filter(c => c !== "All").map(cat => (
                              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2.5 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                          Detailed Description *
                        </Typography>
                        <TextField fullWidth multiline rows={3} placeholder="Describe your need, technical requirements, use case, and expected outcomes..." value={form.description} onChange={handleInputChange("description")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>
                    </Box>

                    {/* Section 2: Dataset Specifications */}
                    <Box sx={{ mb: 3.5 }}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                        📊 Dataset Specifications
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Data Type *
                          </Typography>
                          <TextField fullWidth select value={form.dataType} onChange={handleInputChange("dataType")} required
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                            <MenuItem value="CSV">CSV</MenuItem>
                            <MenuItem value="JSON">JSON</MenuItem>
                            <MenuItem value="Images">Images</MenuItem>
                            <MenuItem value="Text">Text/Documents</MenuItem>
                            <MenuItem value="API">API</MenuItem>
                            <MenuItem value="Database">Database</MenuItem>
                            <MenuItem value="Mixed">Mixed Format</MenuItem>
                          </TextField>
                        </Box>

                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Dataset Size *
                          </Typography>
                          <TextField fullWidth select value={form.datasetSize} onChange={handleInputChange("datasetSize")} required
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                            <MenuItem value="<1GB">Less than 1GB</MenuItem>
                            <MenuItem value="1-10GB">1-10 GB</MenuItem>
                            <MenuItem value="10-50GB">10-50 GB</MenuItem>
                            <MenuItem value="50GB+">50GB+</MenuItem>
                            <MenuItem value="Unknown">Unknown (will determine)</MenuItem>
                          </TextField>
                        </Box>

                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Source Preference
                          </Typography>
                          <TextField fullWidth placeholder="e.g. Public APIs, Proprietary, Web scraped..." value={form.sourcePreference} onChange={handleInputChange("sourcePreference")}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Box>
                      </Box>
                    </Box>

                    {/* Section 3: Budget & Timeline */}
                    <Box sx={{ mb: 3.5 }}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: SECONDARY, mb: 2.5, borderBottom: `2px solid ${SECONDARY}`, pb: 1 }}>
                        💰 Budget & Timeline
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Budget Min (USD) *
                          </Typography>
                          <TextField fullWidth placeholder="e.g. 2000" type="number" value={form.budgetMin} onChange={handleInputChange("budgetMin")} required
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Box>

                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Budget Max (USD) *
                          </Typography>
                          <TextField fullWidth placeholder="e.g. 5000" type="number" value={form.budgetMax} onChange={handleInputChange("budgetMax")} required
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2.5 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                          Deadline (Required Completion) *
                        </Typography>
                        <TextField fullWidth type="date" value={form.deadline} onChange={handleInputChange("deadline")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>
                    </Box>

                    {/* Section 4: Collaboration Preferences */}
                    <Box sx={{ mb: 3.5 }}>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: SECONDARY, mb: 2.5, borderBottom: `2px solid ${SECONDARY}`, pb: 1 }}>
                        👥 Collaboration Preferences
                      </Typography>

                      <Box sx={{ mb: 2.5 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                          Preferred Collaborator (Optional)
                        </Typography>
                        <TextField fullWidth placeholder="Name or ID of preferred collaborator (leave empty to open bids)" value={form.preferredCollaborator} onChange={handleInputChange("preferredCollaborator")}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>

                      <Box sx={{ p: 2, backgroundColor: "#f0fdfa", borderRadius: 2, border: `1px solid ${SECONDARY}20`, display: "flex", gap: 2, alignItems: "center" }}>
                        <input type="checkbox" checked={form.openToSuggestions} onChange={(e) => setForm({ ...form, openToSuggestions: e.target.checked })} style={{ width: 18, height: 18, cursor: "pointer" }} />
                        <Box>
                          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>Open to Suggestions</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>If unchecked, only preferred collaborator will receive this request</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Section 5: Priority & Attachments */}
                    <Box>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                        ⚡ Priority & Attachments
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Priority Level
                          </Typography>
                          <TextField fullWidth select value={form.priorityLevel} onChange={handleInputChange("priorityLevel")}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Urgent">Urgent</MenuItem>
                          </TextField>
                        </Box>

                        <Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", mb: 0.8 }}>
                            Requirements Doc (URL)
                          </Typography>
                          <TextField fullWidth placeholder="Link to detailed requirements or RFP document" value={form.attachmentUrl} onChange={handleInputChange("attachmentUrl")}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                {/* Modal Footer */}
                <Box sx={{ p: 2.5, backgroundColor: "#f9fafb", borderTop: "1px solid #e5e7eb", display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button onClick={handleCloseModal} sx={{ px: 3, py: 1, color: "#6b7280", fontWeight: 700, textTransform: "none" }}>Cancel</Button>
                  <Button onClick={handleSubmit} variant="contained" disabled={!form.title || !form.category || !form.budgetMin || !form.budgetMax || !form.deadline}
                    sx={{ px: 4, py: 1, backgroundColor: PRIMARY, "&:hover": { backgroundColor: "#e67e00" }, fontWeight: 700, textTransform: "none", boxShadow: "none", borderRadius: 2 }}>
                    Submit Project Request
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>

          <ProjectFiltersPanel
            isOpen={isFiltersPanelOpen}
            onClose={() => setIsFiltersPanelOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            categories={categories}
            statuses={statuses}
          />
        </Container>
      </Box>
    </PageLayout>
  );
}

function ProjectDatasetCard({ dataset, onOpen, onVote }) {
  const sc = statusColors[dataset.status] || statusColors.Active;

  return (
    <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
      {/* Image */}
      <Box sx={{ height: 160, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: sc.color }}>{dataset.status}</Typography>
        </Box>
        <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
          <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: "0.65rem", border: "2px solid #fff" } }}>
            {dataset.avatars.map((a, i) => <Avatar key={i} src={a} />)}
          </AvatarGroup>
        </Box>
        <Box sx={{ position: "absolute", bottom: 8, right: 8, px: 1, py: 0.3, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 0.5 }}>
          <DollarSign size={10} color="#fff" />
          <Typography sx={{ fontSize: "0.7rem", color: "#fff", fontWeight: 700 }}>{dataset.fundingGoal || "Investment"}</Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.5 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <MoreVertical size={16} color="#9ca3af" />
          </IconButton>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: "0.75rem", color: SECONDARY, fontWeight: 700, backgroundColor: `${SECONDARY}10`, px: 1, py: 0.2, borderRadius: 1 }}>
            {dataset.projectType || "General Project"}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>{dataset.author}</Typography>
        </Box>

        {/* Tags */}
        <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap", mb: 1.2 }}>
          {dataset.tags.slice(0, 3).map(tag => (
            <Box key={tag} sx={{ px: 0.8, py: 0.2, borderRadius: 1, backgroundColor: "#f3f4f6" }}>
              <Typography sx={{ fontSize: "0.7rem", color: "#6b7280" }}>#{tag}</Typography>
            </Box>
          ))}
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>Progress</Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: dataset.progress === 100 ? "#16a34a" : PRIMARY }}>{dataset.progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={dataset.progress} sx={{ height: 5, borderRadius: 3, backgroundColor: "#e5e7eb", "& .MuiLinearProgress-bar": { backgroundColor: dataset.progress === 100 ? "#16a34a" : PRIMARY, borderRadius: 3 } }} />
        </Box>

        {/* File Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0.6, mb: 1.5, pb: 1.5, borderBottom: "1px solid #e5e7eb" }}>
          {[{ icon: <FileIcon size={12} color={PRIMARY} />, label: dataset.files }, { icon: <HardDrive size={12} color={PRIMARY} />, label: dataset.size }, { icon: <Download size={12} color={PRIMARY} />, label: dataset.downloads }].map((item, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3, p: 0.6, borderRadius: 1, backgroundColor: "#f9fafb" }}>
              {item.icon}
              <Typography sx={{ fontSize: "0.62rem", color: "#6b7280", textAlign: "center", lineHeight: 1.2 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2, fontSize: "0.78rem", color: "#6b7280" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Users size={12} /><span>{dataset.contributors}</span></Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Star size={12} /><span>{dataset.stars}</span></Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              onClick={onVote}
              sx={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden", cursor: "pointer", "&:hover": { borderColor: PRIMARY, backgroundColor: "#f0fdfa" } }}>
              <Box sx={{ px: 0.8, py: 0.3, borderRight: "1px solid #d1d5db", display: "flex", alignItems: "center" }}><ChevronUp size={12} color={PRIMARY} /></Box>
              <Box sx={{ px: 1, py: 0.3 }}><Typography sx={{ fontSize: "0.75rem", fontWeight: 700 }}>{dataset.votes}</Typography></Box>
            </Box>
            <Button size="small" variant="outlined"
              sx={{
                fontSize: "0.7rem", fontWeight: 700, textTransform: "none", height: 28, borderColor: PRIMARY, color: PRIMARY,
                "&:hover": { backgroundColor: PRIMARY, color: "#fff", borderColor: PRIMARY }
              }}>
              Collaborate
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
