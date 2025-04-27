// backend/controllers/habit.controller.js
const db = require('../models');
const Habit = db.Habit; // Use the Habit model
const User = db.User;   // May need User model later for completions/XP
const { Op } = require("sequelize"); // Import Operators if needed for complex queries

// Get all habits for the logged-in user
exports.getAllHabits = async (req, res) => {
    try {
        const habits = await Habit.findAll({
            where: { userId: req.userId }, // Filter by the logged-in user
            order: [['createdAt', 'ASC']] // Optional: order by creation date
        });
        res.status(200).send(habits);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error retrieving habits." });
    }
};

// Create a new habit for the logged-in user
exports.createHabit = async (req, res) => {
    try {
        const { name, description, frequency, reminderTime } = req.body;

        // Basic validation
        if (!name || !frequency) {
            return res.status(400).send({ message: "Habit name and frequency are required." });
        }
        // Add more validation as needed (e.g., validate reminderTime format)

        const habit = await Habit.create({
            userId: req.userId, // Associate with the logged-in user
            name,
            description,
            frequency,
            reminderTime: reminderTime || null, // Handle optional reminder
            // Streaks and lastCompletedAt will use default values
        });
        res.status(201).send(habit);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error creating habit." });
    }
};

// Get a single habit by ID (ensure it belongs to the user)
exports.getHabitById = async (req, res) => {
    try {
        const habitId = req.params.id;
        const habit = await Habit.findOne({
            where: {
                id: habitId,
                userId: req.userId // Ensure the habit belongs to the logged-in user
            }
        });

        if (!habit) {
            return res.status(404).send({ message: "Habit not found or you don't have permission." });
        }
        res.status(200).send(habit);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error retrieving habit." });
    }
};

// Update a habit by ID (ensure it belongs to the user)
exports.updateHabit = async (req, res) => {
    try {
        const habitId = req.params.id;
        const { name, description, frequency, reminderTime } = req.body;

        // Find the habit first to ensure it belongs to the user
        const habit = await Habit.findOne({
            where: {
                id: habitId,
                userId: req.userId
            }
        });

        if (!habit) {
            return res.status(404).send({ message: "Habit not found or you don't have permission to update." });
        }

        // Update the habit fields
        habit.name = name ?? habit.name; // Use ?? to keep old value if new one isn't provided
        habit.description = description ?? habit.description;
        habit.frequency = frequency ?? habit.frequency;
        habit.reminderTime = reminderTime ?? habit.reminderTime; // Allows setting reminderTime to null

        await habit.save(); // Save the changes

        res.status(200).send(habit);
    } catch (error) {
        res.status(500).send({ message: error.message || "Error updating habit." });
    }
};

// Delete a habit by ID (ensure it belongs to the user)
exports.deleteHabit = async (req, res) => {
    try {
        const habitId = req.params.id;

        const result = await Habit.destroy({
            where: {
                id: habitId,
                userId: req.userId // Crucial check: only delete if it belongs to the user
            }
        });

        if (result === 0) { // destroy returns the number of rows deleted
            return res.status(404).send({ message: "Habit not found or you don't have permission to delete." });
        }

        res.status(200).send({ message: "Habit deleted successfully." }); // Or status 204 (No Content)
    } catch (error) {
        // Handle potential foreign key constraint errors if completions aren't set to cascade delete correctly
        res.status(500).send({ message: error.message || "Error deleting habit." });
    }
};

// --- Placeholder for Completion Logic (Implement in next step) ---
// exports.completeHabit = async (req, res) => {
//     // 1. Find Habit, verify ownership (userId === req.userId)
//     // 2. Check if already completed today (based on frequency & lastCompletedAt) - PREVENT DOUBLE COMPLETION
//     // 3. Create HabitCompletion entry (with reflectionText from req.body if provided)
//     // 4. Update Habit: lastCompletedAt, currentStreak, longestStreak
//     // 5. Award XP to User: User.increment('xp', { by: 10, where: { id: req.userId }})
//     // 6. Check for Level Up: Fetch user, calculate if level up needed, update user level
//     // 7. Check for Badge unlocks (implement Badge logic later)
//     // 8. Check Daily Quests (implement Quest logic later)
//     // 9. Return success response (maybe updated habit or user stats)
//     res.status(501).send({ message: 'Complete Habit - Not Implemented Yet' });
// };

// --- Placeholder for Stats Logic (Implement later) ---
// exports.getHabitStats = async (req, res) => {
//     // Logic to calculate completion rates, streaks etc. for req.userId
//     res.status(501).send({ message: 'Get Habit Stats - Not Implemented Yet' });
// };

// --- NEW/Updated Logic ---

// Mark a habit as complete
exports.completeHabit = async (req, res) => {
    const habitId = req.params.id;
    const userId = req.userId;
    const { reflectionText } = req.body; // Get optional reflection

    // Use a transaction to ensure atomicity (all operations succeed or fail together)
    const transaction = await db.sequelize.transaction();

    try {
        // 1. Find Habit, verify ownership & lock for update
        const habit = await Habit.findOne({
            where: { id: habitId, userId: userId },
            lock: transaction.LOCK.UPDATE, // Lock the row within the transaction
            transaction
        });

        if (!habit) {
            await transaction.rollback();
            return res.status(404).send({ message: "Habit not found or you don't have permission." });
        }

        // 2. Check if already completed today (basic check for daily habits)
        const today = new Date();
        if (habit.lastCompletedAt && isToday(new Date(habit.lastCompletedAt))) {
             await transaction.rollback();
             return res.status(400).send({ message: "Habit already completed today." });
        }
        // TODO: Add more sophisticated checks for weekly/other frequencies later

        // 3. Create HabitCompletion entry
        await HabitCompletion.create({
            habitId: habit.id,
            userId: userId,
            reflectionText: reflectionText || null,
            completedAt: today // Ensure completedAt is set correctly
        }, { transaction });

        // 4. Update Habit Streaks
        let newStreak = 1; // Default streak if broken or first time
        if (habit.lastCompletedAt && isYesterday(new Date(habit.lastCompletedAt))) {
            newStreak = habit.currentStreak + 1; // Increment if completed yesterday
        }

        habit.currentStreak = newStreak;
        habit.lastCompletedAt = today;
        if (newStreak > habit.longestStreak) {
            habit.longestStreak = newStreak; // Update longest streak if current is greater
        }
        await habit.save({ transaction }); // Save habit changes within transaction

        // 5 & 6. Award XP and Check Level Up
        const user = await User.findOne({
            where: { id: userId },
            lock: transaction.LOCK.UPDATE, // Lock user row
            transaction
         });

        if (!user) {
            // This shouldn't happen if JWT is valid, but handle defensively
            throw new Error("User not found during completion.");
        }

        let leveledUp = false;
        const oldLevel = user.level;
        const newXP = user.xp + XP_PER_COMPLETION;
        let xpForNext = calculateLevelXP(user.level);

        user.xp = newXP; // Assign new XP

        // Check for level up (can happen multiple times if large XP gain)
        while (user.xp >= xpForNext) {
            user.level += 1;
            // Option 1: Reset XP relative to new level threshold
            // user.xp -= xpForNext;
            // Option 2: Keep cumulative XP (simpler maybe)
            // - No change needed here if keeping cumulative

            leveledUp = true;
            xpForNext = calculateLevelXP(user.level); // Recalculate for next potential level
        }

        await user.save({ transaction }); // Save user changes

        // 7 & 8. Check for Badge/Quest unlocks (Placeholders)
        // await checkBadgeUnlocks(userId, { transaction }); // Pass transaction
        // await checkQuestCompletion(userId, habitId, { transaction }); // Pass transaction

        // --- If all steps successful, commit the transaction ---
        await transaction.commit();

        // Send back relevant updated info
        res.status(200).send({
            message: "Habit completed successfully!",
            habit: habit, // Send updated habit
            user: { // Send updated user stats (exclude sensitive info)
                id: user.id,
                username: user.username,
                xp: user.xp,
                level: user.level,
                avatarState: user.avatarState
            },
            leveledUp: leveledUp, // Indicate if a level up occurred
            xpGained: XP_PER_COMPLETION
        });

    } catch (error) {
        // If any error occurred, rollback the transaction
        await transaction.rollback();
        console.error("Error completing habit:", error); // Log the detailed error
        res.status(500).send({ message: error.message || "Error completing habit." });
    }
};


// Get basic habit statistics for the user
exports.getHabitStats = async (req, res) => {
    const userId = req.userId;
    try {
        const totalHabits = await Habit.count({
            where: { userId: userId }
        });

        const activeStreaks = await Habit.count({
             where: { userId: userId, currentStreak: { [Op.gt]: 0 } }
        });

        // Find the maximum value in the longestStreak column for this user
        const longestOverallStreak = await Habit.max('longestStreak', {
             where: { userId: userId }
        }) || 0; // Default to 0 if no habits or streaks exist

        // Basic completion count (can be expanded later)
        const totalCompletions = await HabitCompletion.count({
             where: { userId: userId }
        });

        res.status(200).send({
            totalHabits: totalHabits,
            habitsWithActiveStreak: activeStreaks,
            longestStreakEver: longestOverallStreak,
            totalCompletionsAllTime: totalCompletions,
            // Add more stats like completion rate for last X days later
        });

    } catch (error) {
         console.error("Error fetching stats:", error);
        res.status(500).send({ message: error.message || "Error fetching habit statistics." });
    }
};