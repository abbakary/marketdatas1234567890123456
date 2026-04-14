import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import logo from "../assets/logo1.png";
import banner1 from "../assets/banner1.png";

import {
  User, Mail, Lock, Eye, EyeOff, Phone, Globe, Briefcase,
  ShoppingCart, Store, ShieldCheck, Search, Upload, BadgeCheck, Wallet,
} from "lucide-react";

import {
  Box, Typography, TextField, Button, Link, InputAdornment,
  IconButton, Divider, MenuItem, Stack,
} from "@mui/material";

import { useThemeColors } from "../utils/useThemeColors";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const TOKEN_KEY = "dali-token";
const USER_KEY  = "dali-user";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json", Accept: "application/json" } });
const toast = (icon, title) => Swal.fire({ toast: true, position: "top-end", icon, title, timer: 3000, showConfirmButton: false });

const COUNTRIES = [
  { name: "Tanzania",      code: "TZ", dial_code: "+255" },
  { name: "Kenya",         code: "KE", dial_code: "+254" },
  { name: "Uganda",        code: "UG", dial_code: "+256" },
  { name: "Rwanda",        code: "RW", dial_code: "+250" },
  { name: "Burundi",       code: "BI", dial_code: "+257" },
  { name: "South Africa",  code: "ZA", dial_code: "+27"  },
  { name: "Nigeria",       code: "NG", dial_code: "+234" },
  { name: "Ghana",         code: "GH", dial_code: "+233" },
  { name: "United States", code: "US", dial_code: "+1"   },
  { name: "United Kingdom",code: "GB", dial_code: "+44"  },
  { name: "Canada",        code: "CA", dial_code: "+1"   },
  { name: "India",         code: "IN", dial_code: "+91"  },
];

const portalAdvantages = [
  { icon: Search,      title: "Buyer Access",           description: "Browse, preview, and download trusted datasets from one secure marketplace." },
  { icon: ShoppingCart,title: "Simple Purchase Flow",   description: "Select datasets, make payments, and instantly access your downloads." },
  { icon: Store,       title: "Seller Opportunities",   description: "Upload datasets and publish valuable data to a global audience." },
  { icon: Upload,      title: "Monetize Your Data",     description: "Earn income from paid datasets and track performance in real time." },
  { icon: ShieldCheck, title: "Editor Quality Control", description: "All datasets are reviewed to ensure accuracy, reliability, and compliance." },
  { icon: BadgeCheck,  title: "Trusted Marketplace",    description: "Connect buyers, sellers, and editors through a structured approval workflow." },
  { icon: Wallet,      title: "Transparent Payments",   description: "Payments are processed securely and seller earnings are credited automatically." },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isDarkMode, text, textMuted, border, teal, darkBg } = useThemeColors();

  const ACCENT = teal;

  // Panel colors
  const panelBg     = isDarkMode ? "#071A29" : "#f0f4f8";
  const panelText   = isDarkMode ? "#fff" : text;
  const panelMuted  = isDarkMode ? "rgba(255,255,255,0.75)" : textMuted;
  const panelBorder = isDarkMode ? "rgba(255,255,255,0.12)" : border;
  const inputBg     = isDarkMode ? "#04121D" : "#fff";
  const inputText   = isDarkMode ? "#fff" : text;
  const inputLabel  = isDarkMode ? "rgba(255,255,255,0.85)" : textMuted;
  const inputBorder = isDarkMode ? "rgba(255,255,255,0.22)" : border;
  const menuBg      = isDarkMode ? "#071A29" : "#fff";
  const menuText    = isDarkMode ? "#fff" : text;

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
    "& .MuiSelect-select": { color: inputText },
    "& .MuiSvgIcon-root": { color: isDarkMode ? "rgba(255,255,255,0.82)" : textMuted },
    "& .MuiFormHelperText-root": { color: panelMuted },
    "& .MuiPaper-root": { bgcolor: menuBg },
  };

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", password: "", confirm_password: "",
    country: "", country_code: "", phone: "", business_type_id: "", role: "buyer",
  });
  const [businessTypes, setBusinessTypes] = useState([]);
  const [businessTypesLoading, setBusinessTypesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const fullName = useMemo(() => `${form.first_name} ${form.last_name}`.trim(), [form.first_name, form.last_name]);

  useEffect(() => {
    (async () => {
      try {
        setBusinessTypesLoading(true);
        const res = await api.get("/business-types");
        const raw = res?.data;
        setBusinessTypes(Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.results) ? raw.results : []);
      } catch { setBusinessTypes([]); }
      finally { setBusinessTypesLoading(false); }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const c = COUNTRIES.find(c => c.name === value);
      setForm(p => ({ ...p, country: value, country_code: c?.dial_code || "" }));
    } else if (name === "phone") {
      setForm(p => ({ ...p, phone: value.replace(/[^\d]/g, "") }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const normalizePhone = () => {
    const local = form.phone.replace(/[^\d]/g, "");
    if (!local) return null;
    if (form.country_code) {
      const code = form.country_code.replace("+", "");
      return `+${code}${local.startsWith("0") ? local.slice(1) : local}`;
    }
    return local;
  };

  const validateForm = () => {
    if (!form.first_name.trim())      { toast("error", "First name is required"); return false; }
    if (!form.last_name.trim())       { toast("error", "Last name is required"); return false; }
    if (!form.email.trim())           { toast("error", "Email is required"); return false; }
    if (!form.password.trim())        { toast("error", "Password is required"); return false; }
    if (!form.confirm_password.trim()){ toast("error", "Please confirm your password"); return false; }
    if (form.password.length < 6)     { toast("error", "Password must be at least 6 characters"); return false; }
    if (form.password.length > 72)    { toast("error", "Password must not exceed 72 characters"); return false; }
    if (form.password !== form.confirm_password) { toast("error", "Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const payload = {
        full_name: fullName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        country: form.country.trim() || null,
        phone: normalizePhone(),
        business_type_id: form.business_type_id ? Number(form.business_type_id) : null,
        role: form.role || "buyer",
      };
      const { data } = await api.post("/auth/register", payload);
      const token = data?.access_token;
      if (!token) throw new Error("No access token returned");
      localStorage.setItem(TOKEN_KEY, token);
      const me = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem(USER_KEY, JSON.stringify(me.data || {}));
      toast("success", "Account created successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast("error", err?.response?.data?.detail || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: isDarkMode ? darkBg : "#f0f4f8", fontFamily: "'Poppins', sans-serif" }}>
      <Box sx={{ display: "flex", minHeight: "100vh", flexWrap: "wrap" }}>

        {/* LEFT — always dark photo banner */}
        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 58%" }, minHeight: { xs: "70vh", lg: "100vh" }, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", inset: 0, backgroundImage: `url(${banner1})`, backgroundSize: "cover", backgroundPosition: "center", transform: "scale(1.03)" }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,18,29,.20), rgba(4,18,29,.92))" }} />
          <Box sx={{ position: "relative", px: { xs: 3, md: 5 }, py: { xs: 5, md: 6 }, maxWidth: 940, width: "100%", color: "#fff" }}>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 24, md: 30 }, lineHeight: 1.05, color: "#fff", mb: 2 }}>
              Join DALI Data Portal
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, md: 18 }, color: "rgba(255,255,255,0.88)", lineHeight: 1.8, fontWeight: 400, maxWidth: 760, mb: 4 }}>
              Register once and become part of a modern data marketplace where buyers access trusted datasets,
              sellers publish and monetize their data, and editors maintain quality through structured review and approval workflows.
            </Typography>
            <Stack spacing={2.1}>
              {portalAdvantages.map(({ icon: Icon, title, description }, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 2, p: 2, borderRadius: 3, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(6px)" }}>
                  <Box sx={{ minWidth: 48, width: 48, height: 48, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(94,196,195,0.14)", border: "1px solid rgba(94,196,195,0.35)", color: ACCENT, mt: 0.2 }}>
                    <Icon size={22} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: { xs: 15, md: 18 }, fontWeight: 800, color: "#fff", mb: 0.4 }}>{title}</Typography>
                    <Typography sx={{ fontSize: { xs: 13, md: 14.5 }, color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>{description}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* RIGHT — theme-aware form panel */}
        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 42%" }, minHeight: { xs: "45vh", lg: "100vh" }, display: "flex", flexDirection: "column", bgcolor: panelBg, borderLeft: { lg: `1px solid ${panelBorder}` } }}>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 3, py: 4 }}>
            <Box sx={{ width: "100%", maxWidth: 440 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box component="img" src={logo} alt="Dali Data Portal" sx={{ height: 64, objectFit: "contain" }} />
                <Typography sx={{ mt: 1, opacity: 0.9, color: panelText, fontWeight: 600 }}>Create your account</Typography>
                <Typography sx={{ mt: 1, fontSize: 14, color: panelMuted, lineHeight: 1.7 }}>
                  Fill in your details below to register and start using DALI Data Portal.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: panelBorder, mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="First Name" name="first_name" value={form.first_name} onChange={handleChange} margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color={ACCENT} /></InputAdornment> }} sx={textFieldSx} />

                <TextField fullWidth label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color={ACCENT} /></InputAdornment> }} sx={textFieldSx} />

                <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color={ACCENT} /></InputAdornment> }} sx={textFieldSx} />

                <TextField fullWidth select label="Country" name="country" value={form.country} onChange={handleChange} margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Globe size={18} color={ACCENT} /></InputAdornment> }}
                  SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: menuBg, color: menuText } } } }}
                  sx={textFieldSx}>
                  <MenuItem value="" sx={{ color: menuText }}>Select country</MenuItem>
                  {COUNTRIES.map(c => <MenuItem key={c.code} value={c.name} sx={{ color: menuText }}>{c.name}</MenuItem>)}
                </TextField>

                <TextField fullWidth label="Phone Number" name="phone" value={form.phone} onChange={handleChange} margin="normal" placeholder="Enter phone number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: panelText, fontWeight: 700, pr: 1, borderRight: `1px solid ${inputBorder}` }}>
                          <Phone size={18} color={ACCENT} />
                          <Box component="span">{form.country_code || "+---"}</Box>
                        </Box>
                      </InputAdornment>
                    ),
                  }} sx={textFieldSx} />

                <TextField fullWidth select label="Business Type" name="business_type_id" value={form.business_type_id} onChange={handleChange} margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Briefcase size={18} color={ACCENT} /></InputAdornment> }}
                  SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: menuBg, color: menuText } } } }}
                  sx={textFieldSx}>
                  <MenuItem value="" sx={{ color: menuText }}>{businessTypesLoading ? "Loading..." : "Select business type"}</MenuItem>
                  {businessTypes.map(item => <MenuItem key={item.id} value={item.id} sx={{ color: menuText }}>{item.name || item.title || `Type ${item.id}`}</MenuItem>)}
                </TextField>

                <TextField fullWidth label="Password" name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} margin="normal"
                  helperText="Password must be 6 to 72 characters"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={18} color={ACCENT} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(p => !p)} edge="end" sx={{ color: panelMuted }}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</IconButton></InputAdornment>,
                  }} sx={textFieldSx} />

                <TextField fullWidth label="Confirm Password" name="confirm_password" type={showConfirmPw ? "text" : "password"} value={form.confirm_password} onChange={handleChange} margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={18} color={ACCENT} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPw(p => !p)} edge="end" sx={{ color: panelMuted }}>{showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}</IconButton></InputAdornment>,
                  }} sx={textFieldSx} />

                <Button type="submit" fullWidth disabled={loading} sx={{ mt: 2.5, height: 48, borderRadius: 2, fontWeight: 900, textTransform: "none", bgcolor: ACCENT, color: "#04121D", boxShadow: "0 12px 24px rgba(94,196,195,0.15)", "&:hover": { bgcolor: "#49b2b1" }, "&.Mui-disabled": { bgcolor: "rgba(94,196,195,0.5)", color: "#04121D" } }}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <Typography sx={{ textAlign: "center", mt: 2.2, fontSize: 14, color: panelMuted }}>
                  Already have an account?{" "}
                  <Link component={RouterLink} to="/login" underline="none" sx={{ color: ACCENT, fontWeight: 800 }}>Sign in</Link>
                </Typography>

                <Typography sx={{ textAlign: "center", mt: 2, fontSize: 12, opacity: 0.72, color: panelText }}>
                  © {new Date().getFullYear()} DALI Data Portal
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
