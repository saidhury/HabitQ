import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';

// MUI Components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert'; // For displaying errors

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // To get redirect location

  const { user, isLoading, isError, isAuthenticated, message } = useSelector(
    (state) => state.auth
  );

  const redirectPath = location.state?.from?.pathname || '/dashboard'; // Where to redirect after login

  useEffect(() => {
    // No need to show error here if using Alert component below
    // Redirect if logged in
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
    // Cleanup error message on unmount or when auth state changes
    // return () => {
    //   if (isError) dispatch(reset()); // Reset only if there was an error?
    // }
  }, [isAuthenticated, navigate, redirectPath, dispatch, isError]); // isError in dep array

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    // Clear error message when user starts typing again
    if (isError) {
        dispatch(reset());
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      const userData = { email, password };
      dispatch(login(userData));
      // Error/Success is handled by useEffect redirect or Alert display
    }
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {isError && ( // Display error message using Alert
            <Alert severity="error" sx={{ width: '100%', mt: 2 }} onClose={() => dispatch(reset())}>
                {message || 'Login failed. Please check your credentials.'}
            </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChange}
            error={isError} // Highlight field if error
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
            error={isError} // Highlight field if error
          />
          {/* Add Remember me checkbox if needed */}
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, position: 'relative' }}
            disabled={isLoading}
          >
            Sign In
            {isLoading && ( // Show spinner on button when loading
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
          <Grid container>
            <Grid item xs>
              {/* Link for Forgot Password? */}
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;