import { useEffect, useState, useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// ---- Assets ----
import logo from "../assets/logo1.png";
import banner1 from "../assets/banner1.png";

// ---- Icons ----
import { Mail, ChevronRight, ArrowLeft } from "lucide-react";

// ---- MUI ----
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  Divider,
} from "@mui/material";

// ---- Backend ----
const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const FORGOT_PASSWORD_API = `${API_BASE}/auth/forgot-password`;

// ---- Theme ----
const DALI_BG = "#04121D";
const DALI_PANEL = "#071A29";
const DALI_ACCENT = "#5EC4C3";

// ---- Dummy Ads Data ----
const dummyAds = [
  {
    description:
      "Reset your account securely and regain access to the Dali Data Portal with ease.",
  },
  {
    description:
      "Enter your registered email address to receive password recovery instructions instantly.",
  },
  {
    description:
      "Protect your access to geospatial intelligence, research tools, and curated datasets.",
  },
  {
    description:
      "Stay connected to planning, monitoring, and decision support resources across sectors.",
  },
];

// ---- Toast helper ----
const toast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    timer: 3000,
    showConfirmButton: false,
  });
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [ads] = useState(dummyAds);
  const [currentAd, setCurrentAd] = useState(0);
  const [displayedAd, setDisplayedAd] = useState(dummyAds[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchAd = useCallback(
    (nextIndex) => {
      if (!ads.length) return;

      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentAd(nextIndex);
        setDisplayedAd(ads[nextIndex]);
        setIsTransitioning(false);
      }, 220);
    },
    [ads],
  );

  const handleNextAd = useCallback(() => {
    if (ads.length <= 1) return;
    const nextIndex = (currentAd + 1) % ads.length;
    switchAd(nextIndex);
  }, [ads.length, currentAd, switchAd]);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentAd + 1) % ads.length;
      switchAd(nextIndex);
    }, 4500);

    return () => clearInterval(timer);
  }, [ads.length, currentAd, switchAd]);

  const handleDotClick = (index) => {
    if (index === currentAd) return;
    switchAd(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast("error", "Email is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(FORGOT_PASSWORD_API, {
        email: email.trim(),
      });

      toast("success", "Password reset instructions sent");
      setEmail("");
    } catch (err) {
      toast(
        "error",
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to send reset instructions",
      );
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.92)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: DALI_ACCENT,
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      borderRadius: 2,
      backgroundColor: DALI_BG,
      "& input": {
        color: "#fff",
      },
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.22)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(94,196,195,0.70)",
      },
      "&.Mui-focused fieldset": {
        borderColor: DALI_ACCENT,
      },
    },
    "& .MuiFormHelperText-root": {
      color: "rgba(255,255,255,0.75)",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: DALI_BG,
        fontFamily: "'Poppins', sans-serif",
        "@keyframes fadeSlideIn": {
          "0%": {
            opacity: 0,
            transform: "translateY(16px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "@keyframes fadeSlideOut": {
          "0%": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(-12px)",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", minHeight: "100vh", flexWrap: "wrap" }}>
        {/* LEFT — INFO SECTION */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 66.66%" },
            minHeight: { xs: "55vh", lg: "100vh" },
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${banner1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.03)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,18,29,.25), rgba(4,18,29,.88))",
            }}
          />

          <Box
            sx={{
              position: "relative",
              px: 3,
              maxWidth: 860,
              width: "100%",
              color: "#fff",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: 28, md: 56 },
                lineHeight: 1.1,
                color: "#fff",
                mb: 3,
              }}
            >
              Recover Access
            </Typography>

            {displayedAd && (
              <Box
                key={currentAd}
                sx={{
                  maxWidth: "700px",
                  minHeight: { xs: 90, md: 120 },
                  animation: isTransitioning
                    ? "fadeSlideOut 220ms ease forwards"
                    : "fadeSlideIn 420ms ease forwards",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 15, md: 20 },
                    color: "rgba(255,255,255,0.90)",
                    lineHeight: 1.8,
                    fontWeight: 400,
                  }}
                >
                  {displayedAd.description}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", mt: 4, gap: 1, alignItems: "center" }}>
              {ads.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => handleDotClick(i)}
                  sx={{
                    width: currentAd === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    cursor: "pointer",
                    bgcolor:
                      currentAd === i ? DALI_ACCENT : "rgba(255,255,255,0.30)",
                    transition: "all .3s ease",
                  }}
                />
              ))}

              {ads.length > 1 && (
                <Button
                  onClick={handleNextAd}
                  sx={{
                    minWidth: 0,
                    ml: 1,
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.20)",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: "999px",
                    p: 1,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.10)",
                    },
                  }}
                >
                  <ChevronRight size={18} />
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* RIGHT — FORM PANEL */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 33.33%" },
            minHeight: { xs: "45vh", lg: "100vh" },
            display: "flex",
            flexDirection: "column",
            bgcolor: DALI_PANEL,
            position: "relative",
            borderLeft: { lg: "1px solid rgba(255,255,255,0.06)" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
              py: 4,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 420 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="Dali Data Portal"
                  sx={{ height: 64, objectFit: "contain" }}
                />

                <Typography sx={{ mt: 1, opacity: 0.9, color: "#fff" }}>
                  Forgot your password?
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.7,
                  }}
                >
                  Enter your registered email address and we&apos;ll send you
                  instructions to reset your password.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2.5,
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 900,
                    textTransform: "none",
                    bgcolor: DALI_ACCENT,
                    color: "#04121D",
                    boxShadow: "0 12px 24px rgba(94,196,195,0.15)",
                    "&:hover": {
                      bgcolor: "#49b2b1",
                    },
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <Link
                  component={RouterLink}
                  to="/login"
                  underline="none"
                  sx={{
                    mt: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    color: DALI_ACCENT,
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to sign in
                </Link>

                <Typography
                  sx={{
                    textAlign: "center",
                    mt: 3,
                    fontSize: 12,
                    opacity: 0.7,
                    color: "#fff",
                  }}
                >
                  © {new Date().getFullYear()} Dali Data Portal
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
