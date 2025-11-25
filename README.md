# Email Spam Classification System

A full-stack email spam classification application with Apache Spark MLlib machine learning backend, FastAPI REST API, and React frontend with Firebase integration.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Components](#components)
  - [Machine Learning Model](#machine-learning-model)
  - [Backend API](#backend-api)
  - [Frontend Application](#frontend-application)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Data Flow](#data-flow)
- [Known Issues & Recommendations](#known-issues--recommendations)

## Project Overview

This project implements an end-to-end email spam classification system featuring:

- **Machine Learning**: Apache Spark MLlib pipeline with TF-IDF vectorization and Logistic Regression
- **Backend API**: FastAPI service that loads the Spark model and serves predictions
- **Frontend UI**: React application with Firebase Firestore for user authentication and email storage
- **Real-time Classification**: Emails are classified as spam/not spam before delivery

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React Frontend │─────▶│  FastAPI Server  │─────▶│  Spark ML Model │
│   (Vite + TW)   │      │  (predict_api.py)│      │  (spam_model/)  │
└────────┬────────┘      └──────────────────┘      └─────────────────┘
         │
         │ Firebase
         ▼
┌─────────────────┐
│    Firestore    │
│  (Users, Emails)│
└─────────────────┘
```

## Repository Structure

```
spam/
├── cleaned_final_dataset.csv      # Training dataset
├── spam_spark_ml.py               # Model training script
├── predict_api.py                 # FastAPI prediction server
├── requirements.txt               # Python dependencies
├── spam_model/                    # Saved Spark ML pipeline
├── label_indexer/                 # Label encoding artifacts
├── new.py                         # Spark test utility
├── Spam_frontend/                 # React frontend application
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx                # Main UI component
│   │   ├── api.js                 # API & Firestore helpers
│   │   ├── Auth.js                # Authentication logic
│   │   ├── firebase.js            # Firebase initialization
│   │   ├── utils.js               # Utility functions
│   │   └── components/            # UI components
│   │       ├── LeftNav.jsx
│   │       ├── EmailList.jsx
│   │       ├── Viewer.jsx
│   │       ├── ComposeModal.jsx
│   │       ├── ClassificationModal.jsx
│   │       └── ui/                # Radix UI primitives
└── README.md
```

## Components

### Machine Learning Model

**File**: `spam_spark_ml.py`

**Pipeline Stages**:
1. **Tokenizer**: Splits email text into words
2. **StopWordsRemover**: Removes common English stop words
3. **HashingTF**: Converts words to term frequency vectors (275,103 features)
4. **IDF**: Applies Inverse Document Frequency weighting
5. **LogisticRegression**: Binary classification (spam vs not spam)

**Training Process**:
- Loads `cleaned_final_dataset.csv`
- Splits 80/20 train/test
- Trains pipeline and saves to `spam_model/`
- Evaluates: Accuracy, Precision, Recall, F1-Score

**Model Artifacts**:
- `spam_model/`: Complete Spark PipelineModel
- `label_indexer/`: StringIndexer for label encoding

### Backend API

**File**: `predict_api.py`

**Technology**: FastAPI + PySpark

**Endpoints**:
- `GET /`: Health check
- `POST /predict`: Classify email text
  - Request: `{"text": "email content"}`
  - Response: `{"prediction": "SPAM"}` or `{"prediction": "NOT SPAM"}`

**Configuration**:
- Spark driver/executor memory: 4GB each
- Single executor with worker reuse for efficiency
- CORS enabled for frontend integration
- Runs on `localhost:6754`

**Environment Variables** (set in code):
- `PYSPARK_PYTHON`: Python executable path
- `PYSPARK_DRIVER_PYTHON`: Driver Python path
- `JAVA_HOME`: JDK installation path
- `SPARK_HOME`: Spark installation directory
- `HADOOP_HOME`: Hadoop binaries path

### Frontend Application

**Directory**: `Spam_frontend/`

**Technology Stack**:
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Database**: Firebase Firestore
- **Icons**: Lucide React

**Key Files**:

1. **`App.jsx`**: Main application component
   - User authentication flow
   - Email composition and sending
   - Inbox/spam folder views
   - Classification result modal
   - Real-time mailbox polling (6s interval)

2. **`api.js`**: API integration layer
   - `fetchEmailLists(userId)`: Retrieves inbox and spam emails
   - `moveEmail(userId, email, targetFolder)`: Moves email between folders
   - `classifyEmail(emailBody)`: Calls prediction API
   - `deliverEmail(recipientUserId, emailData, classification)`: Delivers email to recipient

3. **`Auth.js`**: Authentication (demo implementation)
   - `Signup(email, password)`: Creates user in Firestore
   - `SignIn(email, password)`: Validates credentials
   - `checkEmailExists(email)`: Verifies recipient exists
   - ⚠️ **Warning**: Stores plaintext passwords (demo only)

4. **`firebase.js`**: Firebase configuration
   - Initializes Firestore with environment variables
   - Uses Vite env vars: `VITE_FIREBASE_*`

5. **`utils.js`**: Helper functions
   - Email validation (restricts to `@gmail.com` domain)
   - Text snippet formatting

**Email Sending Flow**:
1. User composes email with recipient, subject, body
2. System checks if recipient email exists in database
3. Email body is sent to classification API
4. Based on classification result, email is delivered to recipient's inbox or spam folder
5. Classification modal shows prediction result to sender

**Firestore Structure**:
```
users/
  {userId}/
    inbox/
      {emailId}/
        - from
        - to
        - subject
        - body
        - label
        - ts
    spam/
      {emailId}/
        - (same structure)
```

## Prerequisites

### Dataset
- **Email-Spam-Dataset** :https://www.kaggle.com/code/adi041103/spam-email-data 

### Backend
- **Python**: 3.8 or higher
- **Java**: JDK 8, 11, or 17 (required by Spark)
- **Apache Spark**: 3.4+ (can use PySpark pip package)
- **Windows**: Hadoop winutils binaries (for Windows users)

### Frontend
- **Node.js**: 16+ and npm/yarn
- **Firebase Project**: With Firestore enabled

## Installation & Setup

### Backend Setup

1. **Create and activate virtual environment**:
```powershell
cd 'C:\Users\adity\OneDrive\Desktop\spam'
python -m venv .venv
.venv\Scripts\Activate.ps1
```

2. **Install Python dependencies**:
```powershell
pip install -r requirements.txt
```

3. **Verify Java and set environment variables**:
```powershell
# Check Java installation
java -version

# Update paths in predict_api.py if needed:
# - PYSPARK_PYTHON
# - PYSPARK_DRIVER_PYTHON
# - JAVA_HOME
# - SPARK_HOME
# - HADOOP_HOME
```

4. **Train the model** (optional, model already included):

   **Option A: Standalone Mode (Local)**
   ```powershell
   python spam_spark_ml.py
   ```

   **Option B: Distributed Mode (Master-Slave Cluster)**
   
   First, configure firewall to allow Spark communication:
   ```powershell
   # Allow Spark ports through Windows Firewall
   # Or temporarily disable firewall for testing
   ```

   Start Spark Master on the master machine:
   ```powershell
   # Start Spark Master
   spark-class org.apache.spark.deploy.master.Master
   
   # Master will start at: spark://<<MASTER_IP>>:PORT
   # Web UI available at: <<MASTER_IP>>:PORT
   ```

   Start Spark Worker(s) on slave machine(s):
   ```powershell
   # Start Worker and connect to Master
   # Keep this terminal alive for worker to remain active
   spark-class org.apache.spark.deploy.worker.Worker spark://<<MASTER_IP>>:PORT
   
   # Worker Web UI available at: http://localhost:8081
   ```

   Submit training job to the cluster:
   ```powershell
   spark-submit `
     --master spark://<<MASTER_IP>>:PORT 
     spam_spark_ml.py
   ```

   **Important Notes**:
   - Replace <<MASTER_IP>>:PORT with your master node's IP address
   - Ensure Python virtual environment paths match your setup
   - Workers must have network access to master on port 7077
   - Keep worker terminal sessions alive during training
   
   **Training Output**:
   - Load and sample the dataset
   - Distribute training across cluster workers
   - Train the Spark ML pipeline
   - Save model to `spam_model/`
   - Print evaluation metrics (Accuracy, Precision, Recall, F1-Score)

### Frontend Setup

1. **Navigate to frontend directory**:
```powershell
cd 'C:\Users\adity\OneDrive\Desktop\spam\Spam_frontend'
```

2. **Install Node dependencies**:
```powershell
npm install
```

3. **Configure Firebase**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Get your Firebase config credentials
   - Create `.env` file in `Spam_frontend/` directory:

```env
VITE_FIREBASE_APIKEY=your_api_key_here
VITE_FIREBASE_AUTHDOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECTID=your_project_id
```

## Running the Application

### Start Backend API Server

```powershell
# From project root with venv activated
cd 'C:\Users\adity\OneDrive\Desktop\spam'
.venv\Scripts\Activate.ps1
python predict_api.py
```

Server will start at: `http://localhost:6754`

**Expected output**:
```
Spark initialized successfully!
Model loaded successfully!
INFO:     Uvicorn running on http://localhost:6754
```

### Start Frontend Development Server

```powershell
# In a new terminal
cd 'C:\Users\adity\OneDrive\Desktop\spam\Spam_frontend'
npm run dev
```

Frontend will start at: `http://localhost:5173` (or similar Vite port)

### Test the API (Optional)

```powershell
# Test prediction endpoint
Invoke-RestMethod -Method Post -Uri http://localhost:6754/predict -ContentType 'application/json' -Body '{"text":"Congratulations! You won a million dollars! Click here now!"}'

# Expected response:
# prediction
# ----------
# SPAM
```