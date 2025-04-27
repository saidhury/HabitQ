// frontend/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Ensure path to authSlice is correct based on your store structure
import { logout } from './store/slices/authSlice';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

// Common Components
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import SnackbarComponent from './components/Common/SnackbarComponent.jsx'; // Import global Snackbar

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    // No need to dispatch reset() here if the logout reducer handles it
    navigate('/login');
  };

  // Define Drawer content
  const drawer = (
    <Box
      onClick={handleDrawerToggle} // Close drawer on item click
      sx={{
        textAlign: 'center',
        width: 250,
        height: '100%',
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack items vertically
        // Consistent background with potential AppBar style
        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(28, 28, 30, 0.9)' : 'rgba(250, 250, 250, 0.9)',
        backdropFilter: 'blur(8px)',
        color: 'text.primary'
      }}
    >
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        HabitQuest
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      {/* Navigation List */}
      <List sx={{ flexGrow: 1 }}> {/* Allow list to grow */}
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {isAuthenticated && ( // Only show Dashboard link if logged in
            <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/dashboard" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            </ListItem>
        )}
        {/* Add other navigation links here */}
      </List>
      {/* Auth Buttons at the bottom */}
      <Box>
         <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
         <Box sx={{ p: 2 }}>
            {isAuthenticated ? (
                <Button variant="outlined" color="inherit" fullWidth onClick={handleLogout}>
                Logout ({user?.username})
                </Button>
            ) : (
                <>
                <Button component={RouterLink} to="/login" variant="contained" fullWidth sx={{ mb: 1 }}>
                    Login
                </Button>
                <Button component={RouterLink} to="/register" variant="outlined" color="inherit" fullWidth>
                    Register
                </Button>
                </>
            )}
         </Box>
      </Box>
    </Box>
  );

  return (
    // Use theme background color for the base Box
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.' }}>
      <AppBar
        component="nav"
        position="sticky"
        elevation={0} // Flat look
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(28, 28, 30, 0.45)' // Dark semi-transparent grey
            : 'rgba(255, 255, 255, 0.7)', // Light semi-transparent
          backdropFilter: 'blur(10px)',
          // borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Hamburger Icon for Mobile Drawer */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* App Title */}
          <Typography
            variant="h6"
            component={RouterLink}
            to={isAuthenticated ? "/dashboard" : "/"} // Link to dashboard if logged in, else home
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.5px',
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { opacity: 0.9 },
            }}
          >
            HabitQuest
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button component={RouterLink} to="/" sx={{ color: 'text.primary', fontWeight: 500, mx: 0.5, '&:hover': { bgcolor: 'action.hover' } }}>
              Home
            </Button>
            {isAuthenticated && ( // Only show Dashboard link if logged in
               <Button component={RouterLink} to="/dashboard" sx={{ color: 'text.primary', fontWeight: 500, mx: 0.5, '&:hover': { bgcolor: 'action.hover' } }}>
                 Dashboard
               </Button>
            )}

            {/* Desktop Auth Buttons */}
            {isAuthenticated ? (
              <Button onClick={handleLogout} sx={{ color: 'text.secondary', fontWeight: 500, ml: 1.5, '&:hover': { bgcolor: 'action.hover' } }}>
                Logout 
                {/* ({user?.username}) */}
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to="/login" sx={{ color: 'text.primary', fontWeight: 500, mx: 0.5, '&:hover': { bgcolor: 'action.hover' } }}>
                  Login
                </Button>
                <Button component={RouterLink} to="/register" variant="outlined" color="primary" sx={{ fontWeight: 500, ml: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Navigation */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
              borderRight: 'none',
              // Consistent styling with AppBar
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(28, 28, 30, 0.9)'
                : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          {/* Catch-all 404 Route */}
          <Route path="*" element={
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h4">404 Not Found</Typography>
                <Button component={RouterLink} to="/" variant="contained" sx={{mt: 2}}>Go Home</Button>
            </Box>
          } />
        </Routes>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', p: 3, mt: 'auto', borderTop: theme => `1px solid ${theme.palette.divider}` }} >
        <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
                HabitQuest © {new Date().getFullYear()}
            </Typography>
        </Container>
      </Box>

      {/* Global Snackbar for Notifications */}
      <SnackbarComponent />
    </Box>
  );
}

export default App;