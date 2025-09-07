"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createCache from "@emotion/cache";
import type { SerializedStyles } from "@emotion/serialize";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function createEmotionCache(): EmotionCache & { flush?: () => string } {
  const cache = createCache({ key: "mui", prepend: true });
  cache.compat = true;

  const prevInsert = cache.insert;
  let inserted: string[] = [];
  cache.insert = (
    selector: string,
    serialized: SerializedStyles,
    sheet?: unknown,
    shouldCache?: boolean
  ) => {
    if (!cache.inserted[serialized.name]) {
      inserted.push(serialized.name);
    }
  return (prevInsert as unknown as (
      selector: string,
      serialized: SerializedStyles,
      sheet?: unknown,
      shouldCache?: boolean
    ) => void)(selector, serialized, sheet, shouldCache);
  };

  // Expose a flush method we can call in useServerInsertedHTML
  (cache as EmotionCache & { flush?: () => string }).flush = () => {
    const styles = inserted.map((name) => cache.inserted[name]).join("");
    inserted = [];
    return styles;
  };

  return cache as EmotionCache & { flush?: () => string };
}

export const ThemeModeContext = React.createContext<{ mode: "light" | "dark"; toggle: () => void }>({ mode: "light", toggle: () => {} });

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState<EmotionCache & { flush?: () => string }>(createEmotionCache);
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  // Initialize mode from localStorage or system preference
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("theme-mode") as "light" | "dark" | null;
      const prefers = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const next = saved ?? (prefers ? "dark" : "light");
      setMode((m) => (m === next ? m : next));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = React.useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      if (typeof window !== "undefined") localStorage.setItem("theme-mode", next);
      return next;
    });
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        cssVariables: true,
        colorSchemes: { light: true, dark: true },
        palette: {
          mode,
          primary: { main: "#2563EB" },
        },
        shape: { borderRadius: 10 },
        components: {
          MuiTextField: { defaultProps: { size: "small", variant: "outlined" } },
          MuiButton: { defaultProps: { variant: "contained" } },
          MuiCard: { defaultProps: { variant: "outlined" } },
        },
      }),
    [mode]
  );

  useServerInsertedHTML(() => {
  const flush = cache.flush;
    if (!flush) return null;
    const styles = flush();
    if (!styles) return null;
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <ThemeModeContext.Provider value={{ mode, toggle }}>
          <CssBaseline />
          {children}
        </ThemeModeContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
