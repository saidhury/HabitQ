import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHabits } from '../store/slices/habitSlice';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Custom Components
import HabitListComponent from '../components/Habits/HabitListComponent';
import AddEditHabitForm from '../components/Habits/AddEditHabitForm';

// Style for Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.default',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

function DashboardPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { habits, isLoading, isError, message } = useSelector((state) => state.habits);

    const [openModal, setOpenModal] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState(null);
    
    // Mock stats for demonstration
    const stats = {
      streakCount: 0,
      completionRate: 0,
      totalCompleted: 0,
      weeklyProgress: 0, // out of 7 days
    };

    useEffect(() => {
        dispatch(fetchHabits());
    }, [dispatch]);

    const handleOpenModal = (habit = null) => {
        setHabitToEdit(habit);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setHabitToEdit(null);
    };

    const handleCompleteHabit = (habitId) => {
        console.log(`Attempting to complete habit ID: ${habitId}`);
        // TODO: Implement habit completion logic
    };

    if (isLoading && habits.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress size={50} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading your habits...</Typography>
            </Box>
        );
    }

    if (isError && habits.length === 0) {
        return (
             <Alert severity="error" sx={{ mt: 3 }}>
                Error loading habits: {message}
            </Alert>
        );
    }

    if (!user) {
        return <Typography>Loading user data...</Typography>;
    }

    // Calculate active vs completed habits
    const activeHabits = habits.filter(habit => !habit.isCompleted).length;
    const completedHabits = habits.filter(habit => habit.isCompleted).length;

    return (
      <Box sx={{ pb: 8 }}>
        {/* Header Area */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm="auto">
              <Avatar 
                src={user.avatar || "/static/default-avatar.png"} 
                alt={user.username}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  border: '3px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
            </Grid>
            <Grid item xs={12} sm>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Welcome, {user.username}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    icon={<EmojiEventsIcon />} 
                    label={`Level ${user.level}`} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white', 
                      fontWeight: 'bold' 
                    }} 
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 1, 
                    px: 1, 
                    py: 0.5
                  }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(user.xp % 100) || 0} 
                      sx={{ 
                        width: 100, 
                        height: 8, 
                        borderRadius: 5, 
                        mr: 1,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'white',
                        },
                      }} 
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {user.xp} XP
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  0
                  {/* {stats.streakCount} */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day Streak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'success.light' }}>
                    <CheckCircleIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.completionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'secondary.light' }}>
                    <CalendarTodayIcon />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="secondary.main">
                    {stats.weeklyProgress}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    / 7
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Weekly Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <EmojiEventsIcon />
                  </Avatar>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {stats.totalCompleted}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Completions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Habits Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2, 
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography variant="h5" fontWeight="medium">
              Your Habits
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {!isMobile && (
                <>
                  <Chip 
                    label={`${activeHabits} Active`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                  <Chip 
                    label={`${completedHabits} Completed`} 
                    color="success" 
                    variant="outlined"
                    size="small"
                  />
                </>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenModal()}
                size={isMobile ? "small" : "medium"}
              >
                {isMobile ? "Add" : "Add Habit"}
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {isLoading && habits.length > 0 && (
            <LinearProgress sx={{ mb: 2 }} />
          )}
          
          {habits.length > 0 ? (
            <HabitListComponent
              habits={habits}
              onEditHabit={handleOpenModal}
              onCompleteHabit={handleCompleteHabit}
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              py: 5, 
              textAlign: 'center'
            }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                You don't have any habits yet. Create your first habit to start tracking!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenModal()}
              >
                Create First Habit
              </Button>
            </Box>
          )}
        </Paper>

        {/* Floating Action Button for mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{ 
              position: 'fixed', 
              bottom: 16, 
              right: 16,
              display: { sm: 'none' }  
            }}
            onClick={() => handleOpenModal()}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Add/Edit Habit Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="habit-modal-title"
          aria-describedby="habit-modal-description"
        >
          <Box sx={modalStyle}>
            <AddEditHabitForm
              habitToEdit={habitToEdit}
              onClose={handleCloseModal}
            />
          </Box>
        </Modal>
      </Box>
    );
}

export default DashboardPage;