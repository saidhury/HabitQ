// src/theme.js
import { createTheme } from '@mui/material/styles';
import { green, grey, red } from '@mui/material/colors'; // Import desired colors

// Choose 'light' or 'dark'
const mode = 'dark'; // Or 'light' - This has the biggest impact

const theme = createTheme({
  palette: {
    mode: mode, // Set the theme mode
    primary: {
      // Use a green similar to the example
      main: green[800], // Adjust shade as needed (e.g., green[500], green[700])
      contrastText: '#fff',
    },
    secondary: {
      // Define a secondary color if needed
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      // Adjust background colors for dark/light mode
      default: mode === 'dark' ? grey[900] : grey[100], // Dark grey background / Light grey background
      paper: mode === 'dark' ? grey[1000] : green[100], // Slightly lighter paper background / White paper
    },
    text: {
      primary: mode === 'dark' ? '#fff' : grey[900],
      secondary: mode === 'dark' ? grey[500] : grey[600],
    },
    // Define neutral grey if needed explicitly, MUI often derives it
    // grey: {
    //   ...grey
    // }
  },
  shape: {
    // Increase global border radius for a softer look
    borderRadius: 20, // Adjust as desired (original example uses very large radius)
  },
  typography: {
    // Define fonts if you have specific ones, otherwise MUI defaults are decent
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif', // Example
    // Adjust font sizes or weights if needed
    // h4: { fontWeight: 600 },
    // h5: { fontWeight: 600 },
  },
  // --- Component Overrides (Optional but powerful) ---
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          // Apply subtle background, maybe slight transparency
          // Note: True backdrop-filter blur needs sx prop or styled-components
          backgroundColor: mode === 'dark' ? 'rgba(61, 77, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)', // Apply blur effect - may impact performance
          backgroundImage: 'none', // Ensure no gradient is applied by default if using paper bg
           boxShadow: '0px 4px 12px rgba(0,0,0,0.1)', // Softer shadow
           borderRadius: '16px', // Specific large radius for Cards (override theme shape)
           border: mode === 'dark' ? `1px solid ${grey[700]}` : `1px solid ${grey[300]}`, // Subtle border
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Make buttons slightly bolder/rounded
          borderRadius: '50px', // Pill shape
          textTransform: 'none', // Prevent uppercase text
          fontWeight: 600,
        },
      },
    },
     MuiFab: { // Style the Floating Action Button
      styleOverrides: {
        root: {
           boxShadow: '0px 6px 16px rgba(0,0,0,0.2)', // Enhance shadow
        },
      },
     },
    MuiDialog: {
       styleOverrides: {
          paper: {
             borderRadius: '20px', // Match card rounding
             // Apply similar background/blur if desired
             backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
             backdropFilter: 'blur(15px)',
              backgroundImage: 'none', // Reset potential gradients
          }
       }
    },
     MuiTooltip: { // Style tooltips for better contrast
      styleOverrides: {
         tooltip: {
            backgroundColor: mode === 'dark' ? grey[700] : grey[800],
            color: '#fff',
            fontSize: '0.75rem',
         },
         arrow: {
           color: mode === 'dark' ? grey[700] : grey[800],
         }
      }
     },
     MuiChip: {
       styleOverrides: {
          root: {
            //  Subtle chip styling
             backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
             border: 'none',
          }
       }
     }
    // Add overrides for TextField, etc., as needed
  },
});

export default theme;