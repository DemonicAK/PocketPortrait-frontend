# 💻 Frontend – Pocket Portrait

The frontend of Pocket Portrait is built with:

* **Framework:** Next.js (v15.3.4)
* **Styling:** Tailwind CSS v4
* **Language:** TypeScript
* **Charts:** Chart.js + react-chartjs-2
* **HTTP Requests:** Axios
* **Linting:** ESLint

---

### 🔒 Features

### 🔒 Features

- ✅ **Secure Authentication** – manages user sessions and protects routes.
- ✅ **Budget Tracking** – set monthly budgets and visualize spending.
- ✅ **Alerts** – warns users if >80% of a budget is used.
- ✅ **Reports & Analysis** – provides insights into Transactions, trends, and budget utilization through interactive charts and summaries.
- ✅ **Responsive UI** – mobile-friendly layouts with Tailwind CSS.
- ✅ **Data Visualization** – charts built using Chart.js for insights.

---

### 🌳 Project Structure (Frontend)

```
/pocketpotrait-frontend
  ├── /app
  ├── /components
  ├── /pages
  ├── /styles
  ├── /public
  ├── /hooks
  ├── /utils
  ├── next.config.js
  ├── tailwind.config.js
  ├── tsconfig.json
  └── .env
```

*(Adjust paths if your structure differs!)*

---

### ⚙️ Environment Variables

Create a `.env` file at the frontend root:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

> **Note:** This must point to your backend server’s base URL.

---

### 🚀 Setup & Run Frontend

#### Install dependencies

```bash
npm install
```

#### Run in development mode

```bash
npm run dev
```

#### Build production version

```bash
npm run build
npm start
```

Frontend runs by default on **[http://localhost:3000](http://localhost:3000)**

