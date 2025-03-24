// components/LandingPage.tsx
'use client'

import { Box, Typography, Container, Grid, Button } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Oleo_Script } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const oleo = Oleo_Script({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

const LandingPage = () => {
  // Refs for the bubbles
  let bubble1Ref = useRef<HTMLDivElement>(null);
  let bubble2Ref = useRef<HTMLDivElement>(null);
  let bubble3Ref = useRef<HTMLDivElement>(null);

  // Add this new state
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to move bubbles to random positions
  useEffect(() => {
    const moveBubble = (bubbleRef: React.RefObject<HTMLDivElement | null>) => {
      if (!bubbleRef.current) return;
      
      const parentWidth = bubbleRef.current.parentElement?.clientWidth || 500;
      const parentHeight = bubbleRef.current.parentElement?.clientHeight || 500;
      
      // Get bubble size
      const bubbleWidth = bubbleRef.current.clientWidth;
      const bubbleHeight = bubbleRef.current.clientHeight;
      
      // Calculate new random position (keeping bubble within parent bounds)
      const newX = Math.random() * (parentWidth - bubbleWidth);
      const newY = Math.random() * (parentHeight - bubbleHeight);
      
      // Apply smooth transition
      bubbleRef.current.style.transition = 'all 10s ease-in-out';
      bubbleRef.current.style.left = `${newX}px`;
      bubbleRef.current.style.top = `${newY}px`;
    };

    // Move bubbles at different intervals
    const interval1 = setInterval(() => moveBubble(bubble1Ref), 7000);
    const interval2 = setInterval(() => moveBubble(bubble2Ref), 10000);
    const interval3 = setInterval(() => moveBubble(bubble3Ref), 8000);
    
    // Initial movement - remove the optional chaining (?) operator
    moveBubble(bubble1Ref);
    moveBubble(bubble2Ref);
    moveBubble(bubble3Ref);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Gradient Background */}
      <div
        style={{
          width: '50%',
          background: 'linear-gradient(135deg, #0b7dda 0%, #00bcd4 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Grid Pattern Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            zIndex: 1,
          }}
        />
        
        {/* Circular Decorations */}
        <div
          ref={bubble1Ref}
          style={{
            position: 'absolute',
            top: '10%',
            left: '30%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />
        <div
          ref={bubble2Ref}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '20%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />

        <div
          ref={bubble3Ref}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0,
          }}
        />
        
        {/* Content */}
        <div style={{ zIndex: 2, textAlign: 'center', color: 'white' }}>
            <div>
              <h1 className={`${oleo.className}`} style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '16px' }}>
                <span style={{ color: '#064579' }}>Med</span>
                <span style={{ color: '#50C878' }}>AI</span>
              </h1>
            </div>
          <Typography variant="h4" style={{ marginBottom: '48px' }}>
            Your AI Health Assistant
          </Typography>
          
          {/* Feature List */}
          <div style={{ textAlign: 'left', width: '100%', maxWidth: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                padding: '8px', 
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldIcon />
              </div>
              <Typography variant="h6">
                HIPAA-compliant AI assistance
              </Typography>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                padding: '8px', 
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <VerifiedUserIcon />
              </div>
              <Typography variant="h6">
                Clinician-verified responses
              </Typography>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                padding: '8px', 
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AccessTimeIcon />
              </div>
              <Typography variant="h6">
                24/7 personalized health advice
              </Typography>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          background: '#f9f9f9',
        }}
      >
        <div style={{ 
          maxWidth: 400, 
          width: '100%', 
          textAlign: 'center',
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          
        }}>
          <Typography variant="h4" component="h2" style={{ marginBottom: '24px', color: '#1976d2' }}>
            <span className={`${oleo.className} text-black text-5xl`}>Welcome</span>
          </Typography>
      
          <div style={{ position: 'relative', marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ 
              position: 'absolute',
              left: '12px',
              top: '8px',
              fontSize: '14px',
              color: '#1976d2',
              pointerEvents: 'none',
              transition: 'all 0.2s ease-out'
            }}>
              Email
            </label>
            <input 
              type="email" 
              style={{ 
                width: '100%',
                padding: '30px 12px 10px 12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border 0.3s ease',
                outline: 'none',
                color: 'black'
                
              }}
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ 
              position: 'absolute',
              left: '12px',
              top: '8px',
              fontSize: '14px',
              color: '#1976d2',
              pointerEvents: 'none',
              transition: 'all 0.2s ease-out',
              
            }}>
              Password
            </label>
            <input 
              type={showPassword ? "text" : "password"} 
              style={{ 
                width: '100%',
                padding: '30px 12px 10px 12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border 0.3s ease, box-shadow 0.3s ease',
                outline: 'none',
                color: 'black',
                paddingRight: '40px' // Add space for the toggle button
              }}
              className='focus:border-blue-500'
            />
            
            {/* Enhanced animated password visibility toggle */}
            <div 
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showPassword ? '#1976d2' : '#757575',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: showPassword ? 'rgba(25, 118, 210, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)';
                e.currentTarget.style.background = showPassword 
                  ? 'rgba(25, 118, 210, 0.15)' 
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.background = showPassword 
                  ? 'rgba(25, 118, 210, 0.1)' 
                  : 'transparent';
              }}
            >
              {showPassword ? (
                <VisibilityOffIcon 
                  style={{ 
                    fontSize: '20px',
                    transition: 'all 0.3s ease',
                    transform: 'rotate(0deg)'
                  }} 
                />
              ) : (
                <VisibilityIcon 
                  style={{ 
                    fontSize: '20px',
                    transition: 'all 0.3s ease',
                    transform: 'rotate(0deg)'
                  }} 
                />
              )}
              
              {/* Add a ripple effect on click */}
              <div 
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  background: 'rgba(25, 118, 210, 0.3)',
                  width: '30px',
                  height: '30px',
                  transform: 'scale(0)',
                  opacity: 0,
                  transition: 'all 0.5s ease-out',
                  pointerEvents: 'none'
                }}
                className="ripple"
                ref={el => {
                  if (el) {
                    el.addEventListener('animationend', () => {
                      el.style.transform = 'scale(0)';
                      el.style.opacity = '0';
                    });
                  }
                }}
                onClick={(e) => {
                  const ripple = e.currentTarget;
                  ripple.style.transform = 'scale(2.5)';
                  ripple.style.opacity = '1';
                  
                  // Reset after animation
                  setTimeout(() => {
                    ripple.style.transform = 'scale(0)';
                    ripple.style.opacity = '0';
                  }, 500);
                }}
              />
            </div>
          </div>
      
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth 
            style={{ 
              marginBottom: '16px', 
              padding: '12px 0',
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 10px rgba(33, 203, 243, .4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 3px 5px 2px rgba(33, 203, 243, .3)';
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Sign In</span>
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                opacity: 0,
                transition: 'opacity 0.5s ease',
                zIndex: 1
              }}
              className="button-background-shift"
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
              }}
            />
          </Button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
            <Typography variant="body2" style={{ margin: '0 10px', color: '#757575' }}>
              OR
            </Typography>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          </div>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            fullWidth
            style={{ 
              marginBottom: '16px', 
              padding: '12px 0',
              borderRadius: '8px',
              transition: 'background-color 0.3s ease'
            }}
            component={Link}
            href="/patient"
          >
            Create Account
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large" 
            fullWidth
            style={{ 
              padding: '12px 0',
              borderRadius: '8px', 
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '20px', height: '20px', background: 'url(/google-icon.svg) no-repeat center/contain' }} />
            Sign in with Google
          </Button>
          
          <Typography variant="caption" style={{ color: 'rgba(0, 0, 0, 0.6)', display: 'block', marginTop: '12px' }}>
            By signing in, you agree to our <a href="/terms" style={{ color: '#1976d2', textDecoration: 'none' }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#1976d2', textDecoration: 'none' }}>Privacy Policy</a>.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;