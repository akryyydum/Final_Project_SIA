About This Project
This project is a full-stack microservices-based e-commerce platform built with Node.js, Express, MongoDB, Docker, and React. It demonstrates a modular architecture where each core feature is implemented as an independent service, making the system scalable and maintainable.

Key Features
User Service: Handles user registration, authentication (JWT), and role-based access (admin/customer).
Product Service: Manages product CRUD operations. Only admins can add, update, or delete products.
Cart Service: Allows customers to add products to their cart and update quantities.
Order Service: Enables customers to place orders and allows admins to view all orders.
RabbitMQ Integration: Implements asynchronous communication between services (e.g., updating product stock after an order).
React Dashboard: A modern frontend for customers and admins, featuring product browsing, cart management, and order placement.
Dockerized: All services and databases run in isolated containers for easy development and deployment.
Tech Stack
Backend: Node.js, Express, MongoDB, Mongoose, JWT, RabbitMQ
Frontend: React, Material UI
DevOps: Docker, Docker Compose
How It Works
Customers can register, log in, browse products, add to cart, and place orders.
Admins can manage products and view all customer orders.
Microservices communicate via REST APIs and RabbitMQ events.
