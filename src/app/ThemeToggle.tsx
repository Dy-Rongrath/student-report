"use client";

import { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ThemeModeContext } from "./ThemeRegistry";

export default function ThemeToggle() {
  const { mode, toggle } = useContext(ThemeModeContext);
  return (
    <Tooltip title={mode === "light" ? "Switch to dark" : "Switch to light"}>
      <IconButton aria-label="toggle theme" onClick={toggle} size="small">
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
