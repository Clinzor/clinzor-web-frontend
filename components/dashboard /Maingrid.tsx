import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';

const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

export default function Dashboard() {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh',
        maxWidth: '100%',
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: 'background.default'
      }}
    >
      {/* Overview Section */}
      <Typography 
        component="h2" 
        variant="h6" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        Overview
      </Typography>
      
      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3 }}
        columns={12}
        sx={{ 
          mb: { xs: 3, sm: 4, md: 5 },
          width: '100%'
        }}
      >
        {/* Stat Cards */}
        {data.map((card, index) => (
          <Grid 
            key={index} 
            size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
            sx={{ display: 'flex' }}
          >
            <Box sx={{ width: '100%', minHeight: '120px' }}>
              <StatCard {...card} />
            </Box>
          </Grid>
        ))}
        
        {/* Highlighted Card */}
        <Grid 
          size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
          sx={{ display: 'flex' }}
        >
          <Box sx={{ width: '100%', minHeight: '120px' }}>
            <HighlightedCard />
          </Box>
        </Grid>
        
        {/* Charts Row */}
        <Grid 
          size={{ xs: 12, md: 6 }}
          sx={{ display: 'flex' }}
        >
          <Box sx={{ 
            width: '100%', 
            minHeight: { xs: '300px', sm: '350px', md: '400px' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <SessionsChart />
          </Box>
        </Grid>
        
        <Grid 
          size={{ xs: 12, md: 6 }}
          sx={{ display: 'flex' }}
        >
          <Box sx={{ 
            width: '100%', 
            minHeight: { xs: '300px', sm: '350px', md: '400px' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <PageViewsBarChart />
          </Box>
        </Grid>
      </Grid>

      {/* Details Section */}
      <Typography 
        component="h2" 
        variant="h6" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        Details
      </Typography>
      
      <Grid 
        container 
        spacing={{ xs: 2, sm: 2, md: 3 }} 
        columns={12}
        sx={{ width: '100%' }}
      >
        <Grid 
          size={{ xs: 12, lg: 9 }}
          sx={{ display: 'flex' }}
        >
          <Box sx={{ 
            width: '100%',
            minHeight: { xs: '400px', sm: '500px', md: '600px' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CustomizedDataGrid />
          </Box>
        </Grid>
        
        {/* Optional: Add a sidebar for the remaining 3 columns on large screens */}
        <Grid 
          size={{ xs: 12, lg: 3 }}
          sx={{ 
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            width: '100%',
            minHeight: '600px',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            {/* Placeholder for additional content */}
            <Typography variant="body2">
              Additional content area
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}