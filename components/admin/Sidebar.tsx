'use client';

import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Badge from '@mui/joy/Badge';

// Icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';

// Common styles
const commonStyles = {
  listItemButton: {
    color: '#1D1D1F',
    fontWeight: 500,
    py: 1.5,
    '&:hover': {
      bgcolor: 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-selected': {
      bgcolor: 'rgba(0, 0, 0, 0.06)',
      color: '#000000',
      fontWeight: 600,
    }
  },
  nestedListItem: {
    color: '#1D1D1F',
    borderRadius: '12px',
    pl: 5,
    py: 1.5,
    fontSize: '1rem',
    '&:hover': {
      bgcolor: 'rgba(0, 0, 0, 0.04)',
    }
  },
  icon: {
    color: '#1D1D1F',
    fontSize: '1.4rem',
  }
};

// Component for the App Bar
function AppBar() {
  return (
    <Sheet
      sx={{
        position: 'fixed',
        top: 0,
        left: { xs: 0, md: 'var(--Sidebar-width)' },
        right: 0,
        height: 'var(--AppBar-height)',
        zIndex: 9995,
        p: 3,
        bgcolor: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton size="md" variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
          <Badge badgeContent={3} color="danger" size="sm">
            <NotificationsIcon sx={{ color: '#1D1D1F' }} />
          </Badge>
        </IconButton>
        <Avatar
          size="md"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Sheet>
  );
}

// Component for the mobile toggle button
function SidebarToggle() {
  return (
    <IconButton
      variant="outlined"
      color="neutral"
      size="md"
      sx={{
        position: 'fixed',
        top: 'calc(var(--AppBar-height) / 2 - 20px)',
        left: '1.5rem',
        zIndex: 9999,
        borderRadius: '50%',
        bgcolor: '#ffffff',
        display: { xs: 'flex', md: 'none' },
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        '&:hover': { bgcolor: '#F5F5F7' }
      }}
      onClick={() => document.documentElement.style.setProperty('--SideNavigation-slideIn', '1')}
    >
      <MenuIcon sx={{ fontSize: '1.4rem', color: '#1D1D1F' }} />
    </IconButton>
  );
}

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  renderToggle: (props: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.3s ease',
            '& > *': { overflow: 'hidden' },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </>
  );
}

export default function Sidebar() {
  const [activeItem, setActiveItem] = React.useState('home');
  const handleItemClick = (item: React.SetStateAction<string>) => setActiveItem(item);

  return (
    <React.Fragment>
      <AppBar />
      <SidebarToggle />
      <Sheet
        className="Sidebar"
        sx={{
          position: { xs: 'fixed', md: 'sticky' },
          bgcolor: '#F5F5F7',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
            md: 'none',
          },
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10000,
          height: '100dvh',
          width: 'var(--Sidebar-width)',
          top: 0,
          p: 3,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          pt: { xs: 3, md: 'calc(var(--AppBar-height) + 1.5rem)' },
        }}
      >
        <GlobalStyles
          styles={(theme) => ({
            ':root': {
              '--Sidebar-width': '280px',
              '--AppBar-height': '70px',
              [theme.breakpoints.up('lg')]: {
                '--Sidebar-width': '300px',
                '--AppBar-height': '80px',
              },
            },
            'body': {
              backgroundColor: '#ffffff',
              paddingTop: 'var(--AppBar-height)',
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            },
          })}
        />
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton 
            variant="plain" 
            color="neutral" 
            size="md" 
            sx={{ borderRadius: '50%' }}
            onClick={() => document.documentElement.style.setProperty('--SideNavigation-slideIn', '0')}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography 
            level="title-lg" 
            sx={{ color: '#1D1D1F', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.03em' }}
          >
            Admin
          </Typography>
        </Box>
        
        <Input 
          size="md" 
          startDecorator={<SearchRoundedIcon />} 
          placeholder="Search" 
          sx={{
            '--Input-focusedThickness': '1px',
            bgcolor: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.06)',
            color: '#1D1D1F',
            py: 1.5,
            '&:hover': {
              bgcolor: '#ffffff',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
        
        <Box
          sx={{
            minHeight: 0,
            overflow: 'hidden auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            [`& .${listItemButtonClasses.root}`]: { gap: 2 },
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              borderRadius: '6px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.25)' }
            },
          }}
        >
          <List
            size="md"
            sx={{
              gap: 1,
              '--List-nestedInsetStart': '36px',
              '--ListItem-radius': '12px',
            }}
          >
            
            <ListItem>
              <ListItemButton 
                component="a" 
                href="/dashboard/statistics"
                selected={activeItem === 'dashboard'}
                onClick={() => handleItemClick('dashboard')}
                sx={commonStyles.listItemButton}
              >
                <DashboardRoundedIcon sx={commonStyles.icon} />
                <ListItemContent>
                  <Typography level="title-md">Dashboard</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            
            {/* User Management */}
            <ListItem nested>
              <Toggler
                renderToggle={({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => (
                  <ListItemButton 
                    onClick={() => setOpen(!open)}
                    selected={activeItem === 'users'}
                    sx={commonStyles.listItemButton}
                  >
                    <GroupRoundedIcon sx={commonStyles.icon} />
                    <ListItemContent>
                      <Typography level="title-md">Users</Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        color: '#1D1D1F',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        fontSize: '1.2rem',
                      }} 
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, my: 1 }}>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="allusers"
                      sx={commonStyles.nestedListItem}
                    >
                      All Users
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="blocked"
                      sx={commonStyles.nestedListItem}
                    >
                      Blocked Users
                    </ListItemButton>
                  </ListItem>
                </List>
              </Toggler>
            </ListItem>
            
            
            {/* Clinic Management */}
            <ListItem nested>
              <Toggler
                renderToggle={({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => (
                  <ListItemButton 
                    onClick={() => setOpen(!open)}
                    selected={activeItem === 'clinics'}
                    sx={commonStyles.listItemButton}
                  >
                    <ShoppingCartRoundedIcon sx={commonStyles.icon} />
                    <ListItemContent>
                      <Typography level="title-md">Clinics</Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        color: '#1D1D1F',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        fontSize: '1.2rem',
                      }} 
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, my: 1 }}>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="allclinics"
                      sx={commonStyles.nestedListItem}
                    >
                      All Clinics
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="doctors"
                      sx={commonStyles.nestedListItem}
                    >
                      Doctors
                    </ListItemButton>
                  </ListItem>
                </List>
              </Toggler>
            </ListItem>
            
            {/* Service Management */}
            <ListItem nested>
              <Toggler
                renderToggle={({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => (
                  <ListItemButton 
                    onClick={() => setOpen(!open)}
                    selected={activeItem === 'services'}
                    sx={commonStyles.listItemButton}
                  >
                    <AssignmentRoundedIcon sx={commonStyles.icon} />
                    <ListItemContent>
                      <Typography level="title-md">Services</Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        color: '#1D1D1F',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        fontSize: '1.2rem',
                      }} 
                    />
                  </ListItemButton>
                )}
              >
                
                <List sx={{ gap: 1, my: 1 }}>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="allsevices"
                      sx={commonStyles.nestedListItem}
                    >
                      All Services
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="/dashboard/services/pricing"
                      sx={commonStyles.nestedListItem}
                    >
                      Pricing
                    </ListItemButton>
                  </ListItem>
                </List>
              </Toggler>
            </ListItem>
            
            {/* Financial Management */}
            <ListItem nested>
              <Toggler
                renderToggle={({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => (
                  <ListItemButton 
                    onClick={() => setOpen(!open)}
                    selected={activeItem === 'financial'}
                    sx={commonStyles.listItemButton}
                  >
                    <AccountBalanceWalletIcon sx={commonStyles.icon} />
                    <ListItemContent>
                      <Typography level="title-md">Financial</Typography>
                    </ListItemContent>
                    <Chip size="md" color="success" variant="soft" sx={{ borderRadius: '8px' }}>New</Chip>
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        color: '#1D1D1F',
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        fontSize: '1.2rem',
                        ml: 1
                      }} 
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 1, my: 1 }}>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="settlementtracker"
                      sx={commonStyles.nestedListItem}
                    >
                      Settlement Tracker
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="pendingamounts"
                      sx={commonStyles.nestedListItem}
                    >
                      Pending Amounts
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton 
                      component="a" 
                      href="payments"
                      sx={{
                        ...commonStyles.nestedListItem,
                        position: 'relative',
                      }}
                    >
                      Payments
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#FF3B30',
                        position: 'absolute',
                        right: 12,
                      }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Toggler>
            </ListItem>
            
            {/* Offer Management */}
            <ListItem>
              <ListItemButton 
                component="a" 
                href="offers"
                selected={activeItem === 'offers'}
                onClick={() => handleItemClick('offers')}
                sx={commonStyles.listItemButton}
              >
                <QuestionAnswerRoundedIcon sx={commonStyles.icon} />
                <ListItemContent>
                  <Typography level="title-md">Offers</Typography>
                </ListItemContent>
                <Chip size="md" color="warning" variant="soft" sx={{ borderRadius: '8px' }}>12</Chip>
              </ListItemButton>
            </ListItem>
          </List>
          
          
        </Box>              
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <IconButton 
            variant="plain" 
            color="neutral" 
            size="md" 
            sx={{ borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }}}
          >
            <SettingsRoundedIcon />
          </IconButton>
          <IconButton 
            variant="plain" 
            color="neutral" 
            size="md" 
            sx={{ borderRadius: '50%', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }}}
          >
            <LogoutRoundedIcon />
          </IconButton> 
        </Box>
      </Sheet>
    </React.Fragment>
  );  
}