import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import logo from "../assets/logo1.png";
import banner1 from "../assets/banner1.png";

import { Mail, Lock, Eye, EyeOff, Search, ChevronLeft } from "lucide-react";

import {
  Box, Typography, TextField, Button, Checkbox, FormControlLabel,
  Link, IconButton, InputAdornment, Divider, Paper, InputBase, Stack,
} from "@mui/material";

import { getDashboardPath } from "../utils/roleRedirect";
import { validateMockCredentials } from "../utils/mockCredentials";
import { useThemeColors } from "../utils/useThemeColors";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const TOKEN_KEY = "dali-token";
const USER_KEY = "dali-user";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json", Accept: "application/json" } });

const toast = (icon, title) => Swal.fire({ toast: true, position: "top-end", icon, title, timer: 3000, showConfirmButton: false });

const marketplaceTags = [
  "Administrative","Mining","Sensors","Satellite Images","Rivers","Tourism","Health","Agriculture",
  "Weather","Forestry","Transport","Hydrology","Topography","Land Use","Population","Education",
  "Energy","Markets","Boundaries","Climate","Water","Roads","Buildings","Soils","Urban Planning",
  "Geology","Environment","Disaster Risk","Biodiversity","Census","Public Safety","Marine",
  "Infrastructure","Telecommunication","Drainage","Real Estate","Investment","Meteorology",
  "Natural Resources","Livestock","Fisheries","Demography","Elections","Waste Management",
  "Groundwater","Wetlands","Navigation","Logistics","Economic Zones","Public Services",
  "Renewable Energy","Air Quality","Pollution","Cartography","Geospatial AI","Drone Mapping",
  "Elevation Models","Land Cover","Urban Growth",
];

const DEMO_ACCOUNTS = [
  { label: "Viewer",  email: "viewer@demo.com" },
  { label: "Buyer",   email: "buyer@demo.com" },
  { label: "Seller",  email: "seller@demo.com" },
  { label: "Editor",  email: "editor@demo.com" },
  { label: "Admin",   email: "admin@demo.com" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { isDarkMode, bg, text, textMuted, border, orange, teal, darkBg } = useThemeColors();

  const ACCENT = teal;
  const TITLE_GRADIENT = `linear-gradient(90deg,${teal},${orange})`;

  // Panel colors — always dark-toned (design intent), but lighter in light mode
  const panelBg      = isDarkMode ? "#071A29" : "#f0f4f8";
  const panelText    = isDarkMode ? "#fff" : text;
  const panelMuted   = isDarkMode ? "rgba(255,255,255,0.62)" : textMuted;
  const panelBorder  = isDarkMode ? "rgba(255,255,255,0.12)" : border;
  const inputBg      = isDarkMode ? "#04121D" : "#fff";
  const inputText    = isDarkMode ? "#fff" : text;
  const inputLabel   = isDarkMode ? "rgba(255,255,255,0.85)" : textMuted;
  const inputBorder  = isDarkMode ? "rgba(255,255,255,0.22)" : border;
  const iconBtnColor = isDarkMode ? "#fff" : text;
  const iconBtnBorder= isDarkMode ? "rgba(255,255,255,0.10)" : border;
  const iconBtnBg    = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const iconBtnHover = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const demoCardBg   = isDarkMode ? "rgba(94,196,195,0.10)" : "rgba(94,196,195,0.08)";
  const demoCardBorder = isDarkMode ? "rgba(94,196,195,0.25)" : "rgba(94,196,195,0.40)";
  const demoCardHoverBg = isDarkMode ? "rgba(94,196,195,0.20)" : "rgba(94,196,195,0.16)";
  const sidebarLabel = isDarkMode ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";

  const textFieldSx = {
    "& .MuiInputLabel-root": { color: inputLabel },
    "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
    "& .MuiOutlinedInput-root": {
      color: inputText,
      borderRadius: 2,
      backgroundColor: inputBg,
      "& input": { color: inputText },
      "& fieldset": { borderColor: inputBorder },
      "&:hover fieldset": { borderColor: "rgba(94,196,195,0.70)" },
      "&.Mui-focused fieldset": { borderColor: ACCENT },
    },
    "& .MuiFormHelperText-root": { color: panelMuted },
  };

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [searchRef, setSearchRef] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  const groupedTags = useMemo(() => {
    const groups = [];
    for (let i = 0; i < marketplaceTags.length; i += 12) groups.push(marketplaceTags.slice(i, i + 12));
    return groups;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const user  = localStorage.getItem(USER_KEY)  || sessionStorage.getItem(USER_KEY);
    if (!token || !user) return;
    try { navigate(getDashboardPath(JSON.parse(user)?.role), { replace: true }); } catch {}
  }, [navigate]);

  useEffect(() => {
    if (groupedTags.length <= 1) return;
    const id = setInterval(() => setCurrentSlide(p => (p + 1) % groupedTags.length), 3500);
    return () => clearInterval(id);
  }, [groupedTags.length]);

  useEffect(() => { setAnimateKey(p => p + 1); }, [currentSlide]);

  const handleSearch = useCallback(() => {
    if (!searchRef.trim()) { toast("error", "Please enter a search keyword"); return; }
    toast("success", `Searching for "${searchRef.trim()}"`);
  }, [searchRef]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const clearStoredAuth = () => {
    [TOKEN_KEY, USER_KEY].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
  };

  const validateForm = () => {
    if (!form.email.trim())    { toast("error", "Email is required"); return false; }
    if (!form.password.trim()) { toast("error", "Password is required"); return false; }
    if (form.password.length < 6)  { toast("error", "Password must be at least 6 characters"); return false; }
    if (form.password.length > 72) { toast("error", "Password must not exceed 72 characters"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const email = form.email.trim().toLowerCase();
      const mockUser = validateMockCredentials(email, form.password);
      if (mockUser) {
        clearStoredAuth();
        const storage = form.remember ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, `mock_token_${Date.now()}`);
        storage.setItem(USER_KEY, JSON.stringify(mockUser));
        window.dispatchEvent(new Event("auth:updated"));
        toast("success", `Welcome ${mockUser.name}! (${mockUser.role})`);
        navigate(getDashboardPath(mockUser?.role), { replace: true });
        return;
      }
      const { data } = await api.post("/auth/login", { email, password: form.password });
      const token = data?.access_token;
      if (!token) throw new Error("No access token returned");
      clearStoredAuth();
      const storage = form.remember ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      let meData = null;
      try {
        const me = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        meData = me?.data || null;
      } catch {
        meData = { email, role: "viewer", status: "pending" };
      }
      storage.setItem(USER_KEY, JSON.stringify(meData));
      window.dispatchEvent(new Event("auth:updated"));
      toast("success", "Welcome to DALI Data Portal");
      navigate(getDashboardPath(meData?.role), { replace: true });
    } catch (err) {
      toast("error", err?.response?.data?.detail || err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", bgcolor: darkBg, fontFamily: "'Poppins', sans-serif",
      "@keyframes fadeUp": { "0%": { opacity: 0, transform: "translateY(28px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      "@keyframes fadeUpSoft": { "0%": { opacity: 0, transform: "translateY(18px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      "@keyframes portalGlow": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
    }}>
      <Box sx={{ display: "flex", minHeight: "100vh", flexWrap: "nowrap" }}>

        {/* LEFT — always dark photo banner */}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", inset: 0, backgroundImage: `url(${banner1})`, backgroundSize: "cover", backgroundPosition: "center", transform: "scale(1.03)" }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,18,29,0.58), rgba(4,18,29,0.90))" }} />
          <Box sx={{ position: "relative", width: "100%", maxWidth: 960, display: "flex", flexDirection: "column", alignItems: "center", px: { xs: 2, md: 3 }, py: 4, color: "#fff" }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "28px", sm: "40px", md: "54px" }, lineHeight: 1.1, textAlign: "center", mb: 1.5, background: TITLE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Dali Data Portal
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: { xs: "14px", md: "17px" }, textAlign: "center", maxWidth: 760, mb: 4 }}>
              A trusted data marketplace platform
            </Typography>

            <Box sx={{ width: "100%", maxWidth: 680, borderRadius: "999px", p: "2px", background: `linear-gradient(120deg,${ACCENT},transparent,${ACCENT},transparent)`, backgroundSize: "300% 300%", animation: "portalGlow 6s linear infinite" }}>
              <Paper elevation={0} sx={{ height: 60, display: "flex", alignItems: "center", borderRadius: "999px", px: 1.2, bgcolor: "rgba(7,26,41,0.85)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)" }}>
                <InputBase fullWidth value={searchRef} onChange={e => setSearchRef(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Search datasets, sectors, or keywords..."
                  sx={{ pl: 2, color: "#fff", fontSize: "16px", "& input::placeholder": { color: "rgba(255,255,255,0.65)", opacity: 1 } }} />
                <IconButton onClick={handleSearch} sx={{ mr: 0.5, width: 44, height: 44, bgcolor: ACCENT, color: darkBg, "&:hover": { bgcolor: "#4eb3b1" } }}>
                  <Search size={18} />
                </IconButton>
              </Paper>
            </Box>

            <Box sx={{ mt: 4, width: "100%", maxWidth: 960, minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Stack key={animateKey} direction="row" flexWrap="wrap" justifyContent="center" gap={1.5} sx={{ maxWidth: 860 }}>
                {groupedTags[currentSlide]?.map((tag, i) => (
                  <Box key={`${tag}-${i}`} onClick={() => setSearchRef(tag)} sx={{ px: 2.2, py: 1.1, borderRadius: "999px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#fff", bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(97,197,195,0.35)", backdropFilter: "blur(8px)", transition: "all 0.25s ease", userSelect: "none", opacity: 0, animation: "fadeUp 0.65s ease forwards", animationDelay: `${i * 0.07}s`, "&:hover": { transform: "translateY(-2px)", bgcolor: "rgba(97,197,195,0.18)", border: "1px solid rgba(97,197,195,0.60)" } }}>
                    {tag}
                  </Box>
                ))}
              </Stack>
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 3, animation: "fadeUpSoft 0.6s ease" }}>
                {groupedTags.map((_, i) => (
                  <Box key={i} onClick={() => setCurrentSlide(i)} sx={{ width: currentSlide === i ? 22 : 9, height: 9, borderRadius: "999px", cursor: "pointer", bgcolor: currentSlide === i ? ACCENT : "rgba(255,255,255,0.35)", transition: "all 0.3s ease" }} />
                ))}
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 5, width: "100%", maxWidth: 320, justifyContent: "center" }}>
              <Button fullWidth variant="outlined" onClick={() => navigate("/public/home")} sx={{ borderRadius: "999px", py: 1.4, color: "#fff", borderColor: "rgba(255,255,255,0.28)", textTransform: "none", fontWeight: 600, fontSize: "15px", "&:hover": { borderColor: ACCENT, bgcolor: "rgba(255,255,255,0.05)" } }}>
                Guest
              </Button>
              <Button fullWidth variant="contained" onClick={() => setIsFormExpanded(true)} sx={{ borderRadius: "999px", py: 1.4, bgcolor: ACCENT, color: darkBg, textTransform: "none", fontWeight: 700, fontSize: "15px", boxShadow: "0 10px 25px rgba(97,197,195,0.25)", "&:hover": { bgcolor: "#4eb3b1" } }}>
                Login
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* RIGHT — theme-aware panel */}
        <Box sx={{
          width: { xs: isFormExpanded ? "100%" : "84px", md: isFormExpanded ? "420px" : "84px" },
          minWidth: { xs: isFormExpanded ? "100%" : "84px", md: isFormExpanded ? "420px" : "84px" },
          maxWidth: { xs: isFormExpanded ? "100%" : "84px", md: isFormExpanded ? "420px" : "84px" },
          minHeight: "100vh", display: "flex", flexDirection: "column",
          bgcolor: panelBg, position: "relative",
          borderLeft: `1px solid ${panelBorder}`,
          transition: "all 0.35s ease", overflow: "hidden",
        }}>
          {!isFormExpanded ? (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
              <IconButton onClick={() => setIsFormExpanded(true)} sx={{ mt: 1, color: iconBtnColor, border: `1px solid ${iconBtnBorder}`, bgcolor: iconBtnBg, "&:hover": { bgcolor: iconBtnHover } }}>
                <ChevronLeft size={18} style={{ transform: "rotate(180deg)" }} />
              </IconButton>
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Typography sx={{ fontSize: 10, fontWeight: 600, color: sidebarLabel, letterSpacing: "1.8px", userSelect: "none", whiteSpace: "nowrap", transform: "rotate(-90deg)" }}>
                  DALI DATA PORTAL
                </Typography>
              </Box>
              <Box sx={{ height: 48 }} />
            </Box>
          ) : (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 3, py: 4, overflowY: "auto" }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Box component="img" src={logo} alt="Dali Data Portal" sx={{ height: 44, objectFit: "contain", mb: 1 }} />
                  <Typography sx={{ color: panelText, fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>Sign in</Typography>
                  <Typography sx={{ color: panelMuted, fontSize: 12, mt: 0.5 }}>Access your DALI account</Typography>
                </Box>
                <IconButton onClick={() => setIsFormExpanded(false)} sx={{ color: iconBtnColor, border: `1px solid ${iconBtnBorder}`, bgcolor: iconBtnBg, "&:hover": { bgcolor: iconBtnHover } }}>
                  <ChevronLeft size={18} />
                </IconButton>
              </Box>

              <Divider sx={{ borderColor: panelBorder, mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color={ACCENT} /></InputAdornment> }}
                  sx={textFieldSx} />

                <TextField fullWidth label="Password" name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} margin="normal" helperText="Password must be 6 to 72 characters"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={18} color={ACCENT} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(p => !p)} edge="end" sx={{ color: ACCENT }}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</IconButton></InputAdornment>,
                  }}
                  sx={textFieldSx} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, gap: 1, flexWrap: "wrap" }}>
                  <FormControlLabel
                    control={<Checkbox checked={form.remember} onChange={handleChange} name="remember" sx={{ color: panelMuted, "&.Mui-checked": { color: ACCENT } }} />}
                    label={<Typography sx={{ fontSize: 14, opacity: 0.9, color: panelText }}>Remember me</Typography>}
                  />
                  <Link component={RouterLink} to="/forgot-password" underline="none" sx={{ color: ACCENT, fontWeight: 800, fontSize: 14 }}>Forgot?</Link>
                </Box>

                <Button type="submit" fullWidth disabled={loading} sx={{ mt: 2.5, height: 48, borderRadius: 2, fontWeight: 900, textTransform: "none", bgcolor: ACCENT, color: "#04121D", boxShadow: "0 12px 24px rgba(94,196,195,0.15)", "&:hover": { bgcolor: "#49b2b1" }, "&.Mui-disabled": { bgcolor: "rgba(94,196,195,0.5)", color: "#04121D" } }}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <Typography sx={{ textAlign: "center", mt: 2, fontSize: 12, opacity: 0.7, color: panelText }}>
                  © {new Date().getFullYear()} Dali Data Portal
                </Typography>

                <Divider sx={{ borderColor: panelBorder, my: 2 }} />

                <Typography sx={{ fontSize: 11, fontWeight: 600, color: panelMuted, textTransform: "uppercase", mb: 1.5, letterSpacing: "0.5px" }}>
                  Demo Credentials
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {DEMO_ACCOUNTS.map(({ label, email }) => (
                    <Box key={email} onClick={() => setForm({ email, password: "demo123", remember: true })}
                      sx={{ p: 1.2, borderRadius: 1, backgroundColor: demoCardBg, border: `1px solid ${demoCardBorder}`, cursor: "pointer", transition: "all 0.25s", "&:hover": { backgroundColor: demoCardHoverBg, borderColor: "rgba(94,196,195,0.55)" } }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: panelText }}>{label}</Typography>
                      <Typography sx={{ fontSize: 10, color: panelMuted, mt: 0.3 }}>{email}</Typography>
                    </Box>
                  ))}
                  <Typography sx={{ fontSize: 9, color: panelMuted, mt: 1, textAlign: "center" }}>
                    Password: demo123 (for all demo accounts)
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
