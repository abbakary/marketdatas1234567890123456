import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// ---- Assets ----
import logo from "../assets/logo1.png";
import banner1 from "../assets/banner1.png";

// ---- Icons ----
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

// ---- MUI ----
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";

// ---- Backend ----
const API_BASE = import.meta.env?.VITE_API_BASE || "http://127.0.0.1:8000";
const RESET_PASSWORD_API = `${API_BASE}/auth/reset-password`;

// ---- Theme ----
const DALI_BG = "#04121D";
const DALI_PANEL = "#071A29";
const DALI_ACCENT = "#5EC4C3";

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

export default function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supports URLs like: /new-password?token=xxxx
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast("error", "Reset token is missing");
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      toast("error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      toast("error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast("error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(RESET_PASSWORD_API, {
        token,
        password,
        confirm_password: confirmPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password updated",
        text: "Your password has been reset successfully.",
        confirmButtonColor: DALI_ACCENT,
        background: "#0A1F2E",
        color: "#fff",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      toast(
        "error",
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to reset password",
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
              Set New Password
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 15, md: 20 },
                color: "rgba(255,255,255,0.90)",
                lineHeight: 1.8,
                fontWeight: 400,
                maxWidth: "700px",
              }}
            >
              Create a strong new password to restore secure access to your Dali
              Data Portal account and continue using your geospatial tools, data
              services, and research resources.
            </Typography>
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
                  Reset your password
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.7,
                  }}
                >
                  Enter your new password below and confirm it to complete your
                  account recovery.
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="New Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx}
                />

                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color={DALI_ACCENT} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
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
                  {loading ? "Updating..." : "Update Password"}
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
