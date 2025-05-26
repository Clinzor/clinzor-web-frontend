"use client"
import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Link from '@mui/joy/Link';
import Checkbox from '@mui/joy/Checkbox';
import { MedicalServices, Mail, Lock } from '@mui/icons-material';

// Interface for form elements
interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

// Create a refined Apple-inspired theme with subtle improvements
const clinzorTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#F2F9FF',
          100: '#E6F3FF',
          200: '#C2E0FF',
          300: '#99CCFF',
          400: '#66B2FF',
          500: '#0A84FF', // Apple blue
          600: '#007AFF', // iOS blue
          700: '#0066CC',
          800: '#0055AA',
          900: '#003D7A',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  fontFamily: {
    body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  typography: {
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    'body-lg': {
      fontWeight: 400,
      letterSpacing: '-0.01em',
    },
    'body-md': {
      fontWeight: 400,
      letterSpacing: '-0.005em',
    },
    'body-sm': {
      fontWeight: 400,
      letterSpacing: '0em',
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: '600',
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '--Icon-fontSize': '1.25rem',
          transition: 'all 0.2s ease',
          '&:focus-within': {
            boxShadow: '0 0 0 4px rgba(10, 132, 255, 0.15)',
          },
        },
      },
    },
    JoyCheckbox: {
      styleOverrides: {
        checkbox: {
          borderRadius: '6px',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: 'primary.500',
          },
        },
      },
    },
  },
});

// Glossy logo component
const LogoMark = () => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
  >
    <Box
      sx={{
        width: 54,
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: '14px 14px 0 0',
        }}
      />
      <MedicalServices
        sx={{
          color: 'primary.600',
          fontSize: 28,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
        }}
      />
    </Box>
  </motion.div>
);

export default function ClinzorLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    persistent: false,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      alert(JSON.stringify(formState, null, 2));
      setIsLoading(false);
    }, 1000);
  };

  // Ensure client-side rendering for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <CssVarsProvider theme={clinzorTheme} defaultMode="light" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Transition-duration': '0.3s',
          },
          body: {
            backgroundColor: '#FFFFFF',
          },
          '::selection': {
            backgroundColor: 'rgba(10, 132, 255, 0.2)',
          },
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        sx={{
          width: '100%',
          display: 'flex',
          minHeight: '100dvh',
        }}
      >
        {/* Left side - Background image with brand overlay */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: '50%',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/admin.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(0,122,255,0.7) 0%, rgba(0,0,0,0.5) 100%)',
                zIndex: 1,
              },
            }}
          />
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            sx={{
              position: 'relative',
              zIndex: 2,
              p: { md: 5, lg: 6 },
              textAlign: 'center',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '90%',
            }}
          >
            <Box sx={{ mb: 4 }}>
<img
  src="/assets/logo/logo.png"
  alt="Clinzor Logo"
  style={{
    filter: 'brightness(0) invert(1)',
  }}
/>

            </Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >

            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <Typography
                level="body-lg"
                sx={{
                  fontSize: { md: '1.1rem', lg: '1.25rem' },
                  fontWeight: 400,
                  opacity: 0.9,
                  maxWidth: '32ch',
                  mx: 'auto',
                  color:'white',
                  textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                Reimagining healthcare management for the modern era
              </Typography>
            </motion.div>
          </Box>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Right side - Login form */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            px: { xs: 3, sm: 4, md: 6, lg: 8 },
            py: { xs: 4, md: 0 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #0A84FF, #007AFF, #0066CC)',
              display: { xs: 'block', md: 'none' },
            },
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            sx={{
              width: '100%',
              maxWidth: '440px',
            }}
          >
            <Box sx={{ mb: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
                <LogoMark />
              </Box>
              
              <Typography
                component="h1"
                level="h2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  mb: 1.5,
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Welcome to Clinzor's Clinic Portal
              </Typography>
              <Typography
                level="body-lg"
                sx={{
                  color: 'neutral.600',
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: '1rem',
                }}
              >
                Sign in to access your healthcare workspace
              </Typography>
            </Box>

            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <Stack spacing={3.5}>
                <FormControl>
                  <Typography
                    component="label"
                    htmlFor="email"
                    level="body-sm"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: 'neutral.800',
                      display: 'block',
                    }}
                  >
                    Email
                  </Typography>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.name@clinzor.com"
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    startDecorator={<Mail sx={{ color: 'neutral.500' }} />}
                    sx={{
                      py: 1.5,
                      '&:focus-within': {
                        borderColor: 'primary.500',
                      },
                      '.MuiInput-input': {
                        transition: 'all 0.2s ease',
                        pl: 0.5,
                      },
                    }}
                  />
                </FormControl>

                <FormControl>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      component="label"
                      htmlFor="password"
                      level="body-sm"
                      sx={{
                        fontWeight: 600,
                        color: 'neutral.800',
                      }}
                    >
                      Password
                    </Typography>
                    <Link
                      href="#reset-password"
                      level="body-sm"
                      sx={{
                        color: 'primary.600',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: 'primary.500',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formState.password}
                    onChange={handleInputChange}
                    startDecorator={<Lock sx={{ color: 'neutral.500' }} />}
                    sx={{
                      py: 1.5,
                      '&:focus-within': {
                        borderColor: 'primary.500',
                      },
                      '.MuiInput-input': {
                        transition: 'all 0.2s ease',
                        pl: 0.5,
                      },
                    }}
                  />
                </FormControl>

                <Checkbox
                  label="Remember this device"
                  name="persistent"
                  checked={formState.persistent}
                  onChange={handleInputChange}
                  size="sm"
                  sx={{
                    color: 'neutral.600',
                    '& .MuiCheckbox-checkbox': {
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                    },
                    '&:hover .MuiCheckbox-checkbox': {
                      borderColor: 'primary.400',
                    },
                  }}
                />

                <Button
                  component={motion.button}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  sx={{
                    py: 1.5,
                    mt: 1,
                    background: 'linear-gradient(to right, #007AFF, #0066CC)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(to right, #0A84FF, #007AFF)',
                    },
                    boxShadow: '0 2px 10px rgba(0, 122, 255, 0.2)',
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </motion.form>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              sx={{ 
                mt: 4, 
                textAlign: 'center',
                py: 2,
                px: 3,
                borderRadius: '12px',
                background: 'rgba(245, 247, 250, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(228, 232, 240, 0.8)',
              }}
            >
              <Typography
                level="body-sm"
                sx={{
                  color: 'neutral.600',
                }}
              >
                New to Clinzor?{' '}
                <Link
                  href="#contact-admin"
                  sx={{
                    color: 'primary.600',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.500',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Contact your administrator
                </Link>
              </Typography>
            </Box>

            <Box 
              component={motion.footer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
              sx={{ 
                mt: { xs: 6, md: 8 }, 
                textAlign: 'center' 
              }}
            >
              <Typography level="body-xs" sx={{ color: 'neutral.500' }}>
                © {new Date().getFullYear()} Clinzor. All rights reserved.
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Link 
                  href="#privacy" 
                  level="body-xs" 
                  sx={{ 
                    color: 'neutral.500',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.500',
                    },
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="#terms" 
                  level="body-xs" 
                  sx={{ 
                    color: 'neutral.500',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.500',
                    },
                  }}
                >
                  Terms of Service
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}