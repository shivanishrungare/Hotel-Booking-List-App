## 🏨 Hotel Booking List App

A **full-stack hotel booking management system** built with modern web technologies and fully containerized using **Docker**.

This application enables users to manage hotel bookings with powerful **CRUD operations**, **filtering**, **sorting**, and **real-time updates**, all running seamlessly within Docker containers.

---

## 🧩 Tech Stack

- **Backend:** Node.js + Express  
- **Frontend:** Vue 3 + Vite  
- **Database:** MySQL 8.4  
- **Deployment:** Docker & Docker Compose  

---

## 🚀 Features

- 📝 **Manage Bookings:** Create, update, delete, and cancel bookings  
- 🔍 **Booking Details:** View hotel information, booking amount, and status  
- 🎯 **Filtering:** Filter bookings by status and date range  
- ↕️ **Sorting:** Sort bookings by date, amount, or hotel name  
- 🐳 **Dockerized Setup:** Launch the full stack easily with a single command  
- 📊 **Database Initialization:** Comes preloaded with schema and sample data  

---

## 🛠️ Prerequisites

Before getting started, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)  
- [Docker Compose](https://docs.docker.com/compose/)  

---

## 💻 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/shivanishrungare/Hotel-Booking-List-App.git
cd Hotel-Booking-List-App
```

### 2️⃣ Build and Run the Containers
```sh
docker compose up --build
```

## This command will:

Build Docker images for the frontend, backend, and MySQL database
Start all containers and connect them automatically.

---

### 🌐 Access the Application

| **Service**     | **URL / Port**             | **Description**          |
|------------------|----------------------------|---------------------------|
| 🖥️ **Frontend**  | [http://localhost:3000](http://localhost:3000) | Vue 3 + Vite application |
| ⚙️ **Backend API** | [http://localhost:5000](http://localhost:5000) | Express REST API |
| 🗄️ **Database**  | `localhost:3306`          | MySQL 8.4 database |

🧾 **Database credentials** can be found in the `.env` file or `docker-compose.yml`.
