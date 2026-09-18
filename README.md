# FLEX Student Companion

A React Native / Expo student portal companion made for SMD Assignment 1.

## Problem
Traditional student portals can make common student tasks feel scattered. This app brings the most frequently checked information into a simple mobile-first interface: attendance, course details, marks, deadlines, announcements and a small study planner.

## Main Features
- Home dashboard with CGPA, SGPA, attendance, credits and fee status
- Quick-action buttons for courses, marks, attendance alerts and planner
- Course search and low-attendance filter
- Course cards with teacher, schedule, room, credits, attendance, marks and next task
- Attendance progress bars
- Academic performance view with course selection
- Bar chart for attendance and pie chart for marks using `react-native-chart-kit`
- Study-hours input with validation and feedback
- Interactive task list using state
- Empty search state and attendance warning state

## Concepts Used
The code intentionally stays close to early React + JavaScript concepts:
- JavaScript arrays and objects
- `map()`, `filter()`, `find()`, `reduce()` and `includes()`
- functions and conditions
- React components and props
- `useState`
- events with `onPress` and `onChangeText`
- conditional rendering
- reusable components
- `StyleSheet`

No React Navigation, context, reducers, custom hooks, API backend or complex state library is used. Views are switched using a simple `activeView` state because the assignment asks us not to add side/bottom navigation that has not been covered in class.

## Files
- `App.js` - application state, event functions, view rendering and styles
- `components/StudentComponents.js` - reusable UI components
- `data/studentData.js` - static objects and arrays used to generate the UI

## Run
1. Create/open an Expo project.
2. Copy these project files into it.
3. Install the required chart packages:
   ```bash
   npm install react-native-chart-kit react-native-svg
   ```
4. Start Expo:
   ```bash
   npx expo start
   ```
5. Open with Expo Go or an emulator.

## Easy Viva Changes
The app is intentionally easy to modify live. Examples:
- Change attendance warning threshold from 80 to another value.
- Add a new course object to the courses array.
- Change one course's attendance or marks.
- Add an announcement.
- Change the study-hour validation range.
- Add/remove one planner task.
- Change which fields appear on a course card.

## Updated Planner Behavior
The Planner now lets the student add a task using a description, subject and due date (`YYYY-MM-DD`). Tasks are stored in React state during the current app session. A task automatically appears as **Missed** when its due date has passed and it has not been completed. Before the deadline, the student can press **Turn in**; the task then becomes **Done**, and **Undo** changes it back to its date-based status. The task list can be filtered by All, Pending, Done and Missed.