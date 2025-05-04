# 🚀 HabitQuest: Ultimate Digital Habit Builder

_Transform your personal development into an engaging quest._

---

## 📌 Problem Statement

**Problem Statement 9 – Build the Ultimate Digital Habit Builder**

---

## 🎯 Objective

HabitQuest tackles the common struggle of building and maintaining positive habits. Many users find traditional methods tedious and lack the motivation to stay consistent.

Our project solves this by transforming habit tracking into a fun, rewarding game. It serves anyone looking to improve themselves by making daily progress **visible**, **engaging**, and **socially accountable**. We provide value by increasing user motivation, improving habit adherence through gamification, and fostering a sense of accomplishment and tangible progress.

---

## 🧠 Team & Approach

**Team Name:**
Habiters

**Team Members:**
*   **Saidul Hussain Choudhury** - *Backend lead*
*   **Santosh Singh** - *Frontend lead*

**Our Approach:**
We chose Problem Statement 9 because habit formation is a universal challenge with significant potential for an engaging tech solution incorporating gamification.
Key challenges addressed included:
*   Seamlessly integrating the React frontend state (Redux) with the Node.js backend API.
*   Setting up the PostgreSQL database and running Sequelize migrations within the Render deployment environment (especially handling migrations on the free tier).
*   Designing an intuitive UI with Material UI while aiming for a gamified aesthetic.
*   Managing environment variables securely for both development and production.
A key moment was adapting our deployment migration strategy to work within Render's free tier build process instead of relying on shell access.

---

## 🛠️ Tech Stack

**Core Technologies Used:**
*   **Frontend:** React (Vite), Material UI (MUI), Redux Toolkit, Axios
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL, Sequelize ORM
*   **APIs:** Custom REST API built with Express, JWT for Authentication, Web Push API (via `web-push`)
*   **Hosting:** Render (Backend: Web Service, Frontend: Static Site, Database: PostgreSQL)

---

## ✨ Key Features

*   ✅ **User Authentication:** Secure Registration and Login using JWT.
*   ✅ **Habit Dashboard:** Clean interface to view and manage daily habits.
*   ✅ **Habit CRUD:** Add, view details, update, and delete habits via a modal form.
*   ✅ **Basic Gamification:** Earn Experience Points (XP) for completions and Level Up.
*   ✅ **Streak System:** Visual tracking of consecutive completion days per habit.
*   ✅ **Customizable Reminders:** Set push notification reminders for habits.
*   ✅ **Basic Social Connections:** Backend models ready for friend additions (UI minimal in Phase 1).
*   ✅ **Simple Statistics:** Backend prepared for basic completion metrics (UI minimal in Phase 1).
*   ✅ **Visual Feedback:** MUI components, theme, and plans for minor celebrations on completion.

![image](https://github.com/user-attachments/assets/cb54cada-ebba-4089-8ad3-c307ccedbe9a)
![image](https://github.com/user-attachments/assets/b233c728-f59a-4054-b3d6-3652fb3cc0a1)

---

## 📽️ Demo

*   **Demo Video Link:** https://youtu.be/2ab2xnBurq8

---

## ✅ Tasks & Bonus Checklist

*(Please mark these accurately based on your team's completion)*
*   [✅] All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form 
*   [✅] All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form
*   [✅] All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form

---

## 🧪 How to Run the Project

**Requirements:**
*   Node.js (v18 or later recommended)
*   npm (or pnpm/yarn)
*   Git
*   Access to a PostgreSQL database instance (local or cloud)

**Environment Setup:**

1.  **Backend (`backend/`)**:
    *   Create a `.env` file in the `backend/` directory.
    *   Populate it based on `backend/config/config.js` (development section).
    *   Key variables: `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT` (e.g., 5432 for local Postgres), `JWT_SECRET` (choose a strong secret), `FRONTEND_URL` (set to `http://localhost:5173`), `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` (generate using `npx web-push generate-vapid-keys`).
2.  **Frontend (`frontend/`)**:
    *   Create a `.env` file in the `frontend/` directory.
    *   Add the variable: `VITE_API_URL=http://localhost:5000/api` (ensure port `5000` matches backend).

**Local Setup Steps:**

```bash
# 1. Clone the repository
git clone https://github.com/saidhury/HabitQ
cd HabitQ

# 2. Setup & Run Backend
cd backend
npm install

# Ensure your local PostgreSQL server is running and accessible
# Ensure your backend/.env file is created and correctly configured

# Apply database migrations
npx sequelize-cli db:migrate

# Start backend development server (uses nodemon)
# Keep this terminal running
npm run dev

# 3. Setup & Run Frontend
# Open a *new* terminal window/tab
cd ../frontend
npm install

# Ensure your frontend/.env file is created and correctly configured

# Start frontend development server (Vite)
npm run dev
```
*   Access the frontend application at `http://localhost:5173` (or the port specified by Vite).
*   The backend API will be available at `http://localhost:5000` (or the port specified in `backend/.env`).

---

## 🧬 Future Scope

*   **Enhanced Gamification:** Implement Skill Trees tied to habit categories, Guilds for team accountability, narrative Quests, and a more advanced Avatar customization system.
*   **Advanced Analytics & Insights:** Develop a comprehensive dashboard visualizing habit patterns, identify optimal completion times/conditions, track mood correlations, and offer personalized recommendations.
*   **Expanded Social Features:** Introduce Mentor/Apprentice relationships, platform-wide Community Challenges with leaderboards, and allow users to create/share habit templates.
*   **Advanced Reward Systems:** Integrate a digital currency ("Quest Coins") for cosmetic unlocks, introduce variable/surprise rewards, explore partnerships for real-world discounts, and allow reward conversion to charitable donations.
*   **Mobile Application:** Leverage the React codebase to build native mobile apps using React Native for iOS and Android.
*   **Progressive Web App (PWA):** Add service workers for offline access to basic tracking and cached data.
*   **Real-time Features:** Utilize WebSockets for instant notifications on friend activity, challenge progress, and reminders.
*   **AI Integration:** Use LLMs (like Groq) for analyzing reflection text, providing personalized feedback, or generating motivational messages.

---

## 📎 Resources / Credits

*   **Core Stack:** React, Node.js, Express, Sequelize, PostgreSQL, Material UI, Redux Toolkit, Vite
*   **Deployment Platform:** Render.com
*   **Inspiration:** `zackha/habit` repository (for UI/UX ideas)

---

## 🏁 Final Words

Building HabitQuest during this hackathon was an intense but rewarding journey. Integrating a full-stack application, especially bridging the React frontend with our Node.js backend, presented interesting challenges like CORS and deployment intricacies. Debugging database migrations on Render's free tier pushed us to adapt our deployment strategy. We focused on building a solid foundation for Phase 1, delivering core CRUD functionality with a touch of gamification and a clean MUI interface. We're excited about the project's potential to genuinely help users build better habits in a fun way and look forward to exploring the features outlined in our Future Scope. Big thanks to the hackathon organizers, mentors, and sponsors!
