// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // For linking
import { useSelector } from 'react-redux'; // To check auth status

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

function HomePage() {
    const { isAuthenticated } = useSelector((state) => state.auth); // Check if user is logged in

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to HabitQuest!
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
                Transform your personal development into an engaging quest. Build habits, gain XP, level up, and achieve your goals.
            </Typography>
            <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                    // If logged in, link to dashboard
                    <Button
                        component={RouterLink}
                        to="/dashboard"
                        variant="contained"
                        size="large"
                        sx={{ mr: 2 }}
                    >
                        Go to Your Dashboard
                    </Button>
                ) : (
                    // If logged out, link to login/register
                    <>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                            sx={{ mr: 2 }}
                        >
                            Get Started (Sign Up)
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            size="large"
                        >
                            Login
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
}

export default HomePage;