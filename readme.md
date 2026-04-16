<div align="center">

# ⚡ NextHire AI

### *The Future of Hiring is Here*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-next--hire--frontend.onrender.com-6c63ff?style=for-the-badge)](https://next-hire-frontend.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

**An AI-powered full-stack job portal with smart candidate matching, real-time application tracking, interview scheduling, and a complete admin control panel.**

</div>

---

## 🌐 Live Demo

🎨 Frontend → [next-hire-frontend.onrender.com](https://next-hire-frontend.onrender.com/)

---

## ✨ Features

- **Candidates** — Browse jobs, upload resume, apply, track applications, schedule interviews, message recruiters
- **Recruiters** — Post jobs, manage applicant pipeline, schedule interviews, view analytics
- **Admin** — Approve recruiters, manage all users, oversee jobs and applications, view platform logs

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, Vanilla JS, Chart.js |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer (PDF in MongoDB) |
| Hosting | Render + MongoDB Atlas |

---

## 📁 Project Structure

```
NextHire/
├── backend/
│   ├── middleware/auth.js        # JWT auth + role guards
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── index.js              # Job, Application, Interview, Message schemas
│   ├── routes/
│   │   ├── auth.js               # Register, Login
│   │   ├── jobs.js               # Job CRUD
│   │   ├── applications.js       # Apply & track
│   │   ├── interviews.js         # Schedule interviews
│   │   ├── messages.js           # Messaging
│   │   ├── candidate.js          # Candidate profile & resume
│   │   ├── recruiter.js          # Recruiter dashboard & pipeline
│   │   └── admin.js              # Admin control panel
│   └── server.js
│
└── frontend/
    ├── css/main.css
    ├── js/
    │   ├── app.js                # Core config, HTTP client, routing
    │   ├── auth.js               # Login / Register
    │   ├── candidate.js          # Candidate pages
    │   ├── recruiter.js          # Recruiter pages
    │   └── admin.js              # Admin pages
    └── index.html
```

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/nexthire.git
cd nexthire/NextHire
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nexthire
JWT_SECRET=your_secret_key
PORT=5002
```

```bash
npm run dev    # development
npm start      # production
```

### 3. Frontend Setup
No build step needed. Open `frontend/index.html` in a browser or serve it:
```bash
npx serve frontend/
```

> Update `API` and `BASE_URL` in `frontend/js/app.js` if running locally.

### 4. Create Admin Account
Register via UI, then update the role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (recruiter goes pending) |
| POST | `/api/auth/login` | Login |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List active jobs |
| POST | `/api/jobs` | Create job (recruiter) |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/jobs/:id/save` | Save / unsave job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Apply to job |
| PUT | `/api/applications/:id/status` | Update status |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interviews` | List interviews |
| POST | `/api/interviews` | Schedule interview |
| DELETE | `/api/interviews/:id` | Cancel interview |

### Candidate
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/candidate/profile` | View / update profile |
| POST | `/api/candidate/resume` | Upload PDF resume |
| GET | `/api/candidate/applications` | My applications |
| GET | `/api/candidate/saved` | Saved jobs |

### Recruiter
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recruiter/stats` | Dashboard stats |
| GET | `/api/recruiter/jobs` | My jobs |
| GET | `/api/recruiter/applications` | Applications for my jobs |
| PATCH | `/api/recruiter/applications/:id/status` | Update application status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/:id/approve-recruiter` | Approve recruiter |
| PATCH | `/api/admin/users/:id/reject-recruiter` | Reject recruiter |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/pipeline` | Application pipeline |
| GET | `/api/admin/logs` | Activity logs |

---

## 👥 Team

| Branch | Contributor |
|--------|-------------|
| `gitesh` | Gitesh |
| `ayushman` | Ayushman |
| `devendra` | Devendra |
| `ekta` | Ekta |
| `erica` | Erica |

---

## 📄 License

ISC License

---

<div align="center">Built with ❤️ by the NextHire Team</div>
