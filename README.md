
# 💸 SpendTrack - A Modern MERN Stack Finance Tracker

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb)](https://www.mongodb.com/)

</div>

A full-stack MERN application for securely logging, managing, and visualizing personal finances through a clean, modern, and fully responsive interface.

---

## ✨ Live Demo

* **Frontend:** [https://spendtrack-app-8c359.web.app](https://spendtrack-app-8c359.web.app)
* **Backend:** [https://spendtrack-api.onrender.com](https://spendtrack-api.onrender.com)

---

## 🚀 Key Features

* **🔐 Secure Authentication:** JWT-based authentication with password hashing via `bcrypt.js`.
* **💸 Full Transaction CRUD:** Create, Read, Update, and Delete transactions, with optional receipt uploads to Cloudinary.
* **📊 Interactive Dashboard:** A central hub with key financial summaries, quick actions, and a personalized greeting.
* **📈 Data Visualization:** Interactive `recharts` for expense breakdowns and transaction trends.
* **📄 Advanced Reporting:** A dedicated reports page with custom date filters for deep financial insights.
* **⚙️ User Settings:** Securely manage profile information and passwords.
* **📱 Responsive Design:** A mobile-first UI built with Tailwind CSS for a seamless experience on any device.
* **Protected Routes:** Ensures private user data is only accessible to authenticated users.

---

## 📁 Folder Structure

```text
SpendTrack/
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/    # Contains the logic for API routes
│   │   ├── 📁 db/             # MongoDB connection logic
│   │   ├── 📁 middlewares/    # Custom middleware (auth, multer)
│   │   ├── 📁 models/         # Mongoose schemas for the database
│   │   ├── 📁 routes/         # API route definitions
│   │   ├── 📁 utils/          # Helper utilities (ApiError, ApiResponse, etc.)
│   │   ├── app.js            # Express app configuration
│   │   └── index.js          # The main Express.js server entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable React components (Navbar, Charts, Forms)
│   │   ├── 📁 context/        # Global state management (AuthContext)
│   │   ├── 📁 pages/          # Page components (Dashboard, Login, etc.)
│   │   ├── App.jsx           # Main app layout and routing
│   │   └── main.jsx          # React app entry point
│   ├── .env                  # Environment variables for frontend
│   ├── firebase.json         # Firebase deployment configuration
│   └── package.json
│
├── .gitignore
└── README.md
````

## 🛠️ Tech Stack

  * **Frontend:** React, Vite, React Router, Axios, Tailwind CSS, Recharts, Lucide React
  * **Backend:** Node.js, Express.js, Mongoose
  * **Database:** MongoDB (via MongoDB Atlas)
  * **Authentication:** JWT, bcrypt.js, cookie-parser
  * **File Uploads:** Cloudinary, Multer
  * **Deployment:** Backend on **Render** & Frontend on **Firebase Hosting**.

-----

## 🏁 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

  * Node.js (v18+)
  * npm & Git
  * A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local instance).
  * A [Cloudinary](https://cloudinary.com/) account.

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone [https://github.com/gitKrishh/spendtrack.git](https://github.com/gitKrishh/spendtrack.git)
    cd spendtrack
    ```

2.  **Setup Backend:**

    ```sh
    cd backend
    npm install
    # Create and fill out .env file (see below)
    npm run dev
    ```

3.  **Setup Frontend:**

    ```sh
    cd frontend
    npm install
    # Create and fill out .env file (see below)
    npm run dev
    ```

### Environment Variables

**Backend (`backend/.env`):**

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=spendtrack
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`frontend/.env`):**

```env
VITE_API_URL=http://localhost:8000/api/v1
```

-----

## 📜 API Endpoints

\<details\>
\<summary\>Click to view API documentation\</summary\>

| HTTP Method | Endpoint                       | Description                               | Access  |
|-------------|--------------------------------|-------------------------------------------|---------|
| `POST`      | `/api/v1/users/register`       | Register a new user                       | Public  |
| `POST`      | `/api/v1/users/login`          | Log in a user                             | Public  |
| `POST`      | `/api/v1/users/logout`         | Log out a user                            | Private |
| `PATCH`     | `/api/v1/users/update-account` | Update user's name and email              | Private |
| `POST`      | `/api/v1/users/change-password`| Change user's password                    | Private |
| `GET`       | `/api/v1/transactions`         | Get all transactions for a user           | Private |
| `POST`      | `/api/v1/transactions`         | Create a new transaction (with receipt)   | Private |
| `GET`       | `/api/v1/transactions/:id`     | Get a specific transaction                | Private |
| `PATCH`     | `/api/v1/transactions/:id`     | Update a specific transaction             | Private |
| `DELETE`    | `/api/v1/transactions/:id`     | Delete a specific transaction             | Private |
| `GET`       | `/api/v1/transactions/stats`   | Get dashboard summary stats               | Private |
| `GET`       | `/api/v1/transactions/reports` | Get detailed report data for a date range | Private |

\</details\>

-----

## License

Distributed under the MIT License. See `LICENSE` for more information.

-----

## Contact

Krish - [msgkrish192@gmail.com](mailto:msgkrish192@gmail.com)

Project Link: [https://github.com/gitKrishh/spendtrack](https://www.google.com/search?q=https://github.com/gitKrishh/spendtrack)
