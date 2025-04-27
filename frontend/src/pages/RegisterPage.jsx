import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../store/slices/authSlice';

// MUI Components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Or PersonAddOutlinedIcon
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar'; // For success message

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const { username, email, password, password2 } = formData;
  const [passwordError, setPasswordError] = useState(''); // For password mismatch
  const [openSnackbar, setOpenSnackbar] = useState(false); // For success message


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
      // Clear error message on mount/unmount or when success happens
      return () => {
          dispatch(reset());
      }
  }, [dispatch]);


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear password mismatch error when typing
    if (e.target.name === 'password' || e.target.name === 'password2') {
        setPasswordError('');
    }
    // Clear backend error message
    if (isError) {
        dispatch(reset());
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setPasswordError(''); // Clear previous mismatch error

    if (password !== password2) {
      setPasswordError('Passwords do not match!');
      return; // Stop submission
    }

    if (!isLoading) {
      const userData = { username, email, password };
      dispatch(register(userData)).then((result) => {
          if (register.fulfilled.match(result)) {
              // Show success snackbar
              setOpenSnackbar(true);
              // Redirect after a short delay to allow user to see snackbar
              setTimeout(() => {
                  navigate('/login');
              }, 2000); // 2 second delay
          }
          // Error is handled by the Alert component via isError state
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon /> {/* Consider PersonAddOutlinedIcon */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {isError && ( // Display backend error message
            <Alert severity="error" sx={{ width: '100%', mt: 2 }} onClose={() => dispatch(reset())}>
                {message || 'Registration failed. Please try again.'}
            </Alert>
        )}

        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name" // More appropriate for username
                name="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                value={username}
                onChange={onChange}
                error={isError && message?.toLowerCase().includes('username')} // Basic check if error mentions username
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                error={isError && message?.toLowerCase().includes('email')} // Basic check
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
                error={!!passwordError || (isError && message?.toLowerCase().includes('password'))} // Show error for mismatch or backend password issues
                helperText={passwordError} // Display mismatch error here
              />
            </Grid>
             <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                autoComplete="new-password"
                value={password2}
                onChange={onChange}
                error={!!passwordError} // Only highlight this field for mismatch
              />
            </Grid>
            {/* Add agreement checkbox if needed */}
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, position: 'relative' }}
            disabled={isLoading}
          >
            Sign Up
             {isLoading && (
                <CircularProgress
                    size={24}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

       {/* Success Snackbar */}
       <Snackbar
            open={openSnackbar}
            autoHideDuration={6000} // Hide after 6 seconds
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
       >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                Registration Successful! Redirecting to login...
            </Alert>
       </Snackbar>
    </Container>
  );
}

export default RegisterPage;