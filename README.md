# 🛒 Microservices E-Commerce Platform

A **full-stack, microservices-based e-commerce platform** built with **Node.js, Express, MongoDB, Docker, and React**. Designed for scalability, modularity, and ease of maintenance.

---

## 📦 About This Project

This platform demonstrates a modular architecture, where each core feature is implemented as an independent service.

### ✨ Key Features

- **🧑‍💼 User Service**  
  Handles user registration, authentication (JWT), and role-based access (admin/customer).

- **📦 Product Service**  
  Admins can add, update, delete products. All users can view products.

- **🛒 Cart Service**  
  Customers can add products to their cart and update quantities.

- **📑 Order Service**  
  Customers place orders; admins can view all orders.

- **📬 RabbitMQ Integration**  
  Enables asynchronous communication (e.g., reduce stock after order).

- **🖥️ React Dashboard**  
  Modern frontend using Material UI for customers and admins.

- **🐳 Dockerized**  
  All services and databases run in isolated containers using Docker Compose.

---

## 🧰 Tech Stack

| Layer      | Technology                               |
|------------|-------------------------------------------|
| Backend    | Node.js, Express, MongoDB, Mongoose       |
| Auth       | JWT                                       |
| Frontend   | React, Material UI                        |
| Messaging  | RabbitMQ                                  |
| DevOps     | Docker, Docker Compose                    |

---

## ⚙️ How It Works

- **Customers** can register, log in, browse products, manage carts, and place orders.  
- **Admins** can manage product listings and view all customer orders.  
- **Services** communicate via REST APIs and RabbitMQ events.

---

## 🚀 Getting Started

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

## 2️⃣ Set Up Environment Variables
Each service contains its own .env file.

Example for user-service/.env:

env
Copy
Edit
MONGO_URI=mongodb://mongo-user:27017/userdb
PORT=5000
JWT_SECRET=your_super_secret
Ensure all services have correct:

MONGO_URI

PORT

JWT_SECRET

 ##3️⃣ Build and Start with Docker Compose
bash
Copy
Edit
docker-compose up --build
This launches all services, MongoDB instances, and RabbitMQ in isolated containers.

##🌐 Service Endpoints
Service	URL
User Service	http://localhost:5000
Product Service	http://localhost:4000
Cart Service	http://localhost:5003
Order Service	http://localhost:5002
RabbitMQ Manager	http://localhost:15672

##🧪 RabbitMQ Login: guest st

## 🔐 Default Admin Credentials
Email	Password
Admin@admin.com	Admin

## 🧪 API Testing
Use Postman or similar tools to:

Register or log in users

Add/view products (admin only)

Manage cart & place orders (customer)

View all orders (admin)

## 🛑 Stopping All Services
bash
Copy
Edit
docker-compose down
## 📄 License
This project is licensed under the MIT License.

## 🙌 Contributions
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
