"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import Dashboard from "@/components/clinicportal/dashboard/Maingrid";
import ExpertDashboard from "@/components/expert/Dashboard/Main";


export default function ExpertPortal() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
      </Box>

      {/* Table Section */}
      <ExpertDashboard />
    </Box>
  );
}
