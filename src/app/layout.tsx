import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AppBar, Toolbar, Container, Typography, Button, Box, Stack } from "@mui/material";
import ThemeToggle from "./ThemeToggle";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mekun Student Report",
  description: "Build and print student progress reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeRegistry>
        {/* App Header (hidden on print) */}
        <AppBar position="sticky" color="default" className="no-print" sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
          <Toolbar>
            <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo_mekun_academy.png" alt="Mekun Academy" style={{ height: 28, width: 28 }} />
                <Typography variant="h6" component="div">Mekun Student Reports</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ThemeToggle />
                <Button component={Link} href="/reports/create" variant="contained" color="primary" size="small">Create report</Button>
              </Stack>
            </Container>
          </Toolbar>
        </AppBar>

  {/* Main content */}
  <Container maxWidth="lg" sx={{ py: 3 }}>{children}</Container>

        {/* Footer (hidden on print) */}
        <Box component="footer" className="no-print" sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Container maxWidth="lg" sx={{ py: 2 }}>
            <Typography variant="caption" color="text.secondary">© Mekun Academy — Student Report Builder</Typography>
          </Container>
        </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
