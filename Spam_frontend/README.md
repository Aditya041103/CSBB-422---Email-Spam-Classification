# SpamClassifier - Email Management System

A React-based email management application with spam classification functionality, built with Vite, Tailwind CSS, and Firebase.

## Features

### Authentication

- **Sign Up / Sign In**: Secure user authentication using Firebase Firestore
- Email validation with Gmail-style regex pattern
- Session management with user state persistence

### Email Management

- **Inbox & Spam Folders**: Organize emails into two separate folders
- **Real-time Synchronization**: Automatic polling every 6 seconds to keep email lists updated
- **Email Viewer**: Click any email to view full content including:
  - Subject line
  - Sender information
  - Email body
  - Timestamp
  - Classification label (Spam/Not Spam)

### Spam Classification

- **Dynamic Actions**: Context-aware buttons based on current folder
  - In Inbox: "Mark as Spam" button
  - In Spam: "Mark as Not Spam" button
- **Email Movement**: Seamlessly move emails between inbox and spam folders
- **Firebase Integration**: Changes persist in Firestore subcollections

### Compose Email

- Compose modal for creating new emails
- Recipient email validation
- Subject and body text fields
- API integration for spam classification (configurable endpoint)

## Firebase Structure

```
users/{userId}
  ├─ email: string
  ├─ password: string
  ├─ inbox/{emailDocId}
  │   ├─ from: string
  │   ├─ to: string
  │   ├─ subject: string
  │   ├─ body: string
  │   ├─ label: "not_spam" | "spam"
  │   └─ ts: timestamp
  └─ spam/{emailDocId}
      ├─ from: string
      ├─ to: string
      ├─ subject: string
      ├─ body: string
      ├─ label: "not_spam" | "spam"
      └─ ts: timestamp
```

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Build Tool**: Vite with HMR
- **Linting**: ESLint

## Project Structure

```
src/
  ├─ components/
  │   ├─ AuthPanel.jsx      # Sign in/up interface
  │   ├─ ComposeModal.jsx   # Email composition modal
  │   ├─ EmailList.jsx      # Email list view
  │   ├─ LeftNav.jsx        # Navigation sidebar
  │   └─ Viewer.jsx         # Email content viewer
  ├─ api.js                 # Firebase operations
  ├─ Auth.js                # Authentication logic
  ├─ firebase.js            # Firebase configuration
  ├─ utils.js               # Helper functions
  ├─ App.jsx                # Main application component
  └─ main.jsx               # Application entry point
```

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Firebase**

   Create a `.env` file in the project root:

   ```env
   VITE_FIREBASE_APIKEY=your_api_key
   VITE_FIREBASE_AUTHDOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECTID=your_project_id
   ```

3. **Configure API Endpoint** (Optional)

   Update `API_BASE` in `src/api.js` to connect to your spam classification backend.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Modular Architecture

The application follows a modular design pattern with separated concerns:

- **Components**: Reusable UI components
- **API Layer**: Centralized data operations
- **Authentication**: Isolated auth logic
- **Utils**: Shared helper functions

## Security Note

⚠️ **Important**: This implementation stores passwords in plaintext in Firestore for demonstration purposes only. For production use, implement proper authentication with Firebase Auth and secure password hashing.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
