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

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState<EmotionCache & { flush?: () => string }>(createEmotionCache);
  const theme = React.useMemo(
    () =>
      createTheme({
        cssVariables: true,
        colorSchemes: { light: true },
        shape: { borderRadius: 8 },
        components: {
          MuiTextField: { defaultProps: { size: "small", variant: "outlined" } },
          MuiButton: { defaultProps: { variant: "contained" } },
        },
      }),
    []
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
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
