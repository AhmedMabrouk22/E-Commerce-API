# E-Commerce API

## Overview

This E-Commerce API developed using JavaScript, Node.js, Express.js, SQL, PostgreSQL, and the pg library. It provides a set of features to support the functionalities of an online shopping platform. The key functionalities of the API include:

### Authentication and Authorization:

**- User registration and login:**
Token-based authentication for secure access to protected routes.
Role-based authorization to control user privileges.

**- Reset Passwords:**
Password reset functionality by sending reset codes to the user's email.

**- Subcategories and Brands Operations:**
Creation, retrieval, update, and deletion of product subcategories.
Management of product brands with CRUD operations.

**- Products Operations:**
Full product management, including creation, retrieval, update, and deletion.
Support for image uploads and association with products.

**- Reviews Operations:**
Adding, retrieving, and managing product reviews.
User ratings and comments for products.

**- Wishlist Operations:**
Adding and removing products from the user's wishlist.
Retrieving the wishlist for a logged user.

**- Coupons and Shopping Cart:**
Creation and application of coupons for discounts.
Shopping cart functionality to add, remove, and manage items.

**- Cash and Online Orders:**
Handling of both cash-on-delivery and online payment orders.
Order creation and status tracking.

**- Online Payments:**
Integration with online payment gateways (stripe) for secure transactions.

## Tools Used

The E-Commerce API is built using the following technologies and libraries:

**JavaScript**: The primary programming language used for server-side logic.

**Node.js**: A runtime that allows the execution of JavaScript on the server.

**Express.js**: A web application framework for Node.js, simplifying the development of robust APIs.

**SQL**: The standard language for interacting with relational databases.

**PostgreSQL**: A powerful open-source relational database management system.

**pg Library**: A PostgreSQL client for Node.js, used for database connectivity.

## Development Environment

**Node.js Version**: 20

**PostgreSQL Version**:16

## Getting Started

To set up and run the E-Commerce API locally, follow these steps:

**1- Clone the Repository:**

```
git clone https://github.com/AhmedMabrouk22/E-Commerce-API.git
cd E-Commerce-API
```

**2- Install Dependencies:**

```
npm install
```

**3- Set .env file:**

```
NODE_ENV=development
PORT=3000

DATABASE_HOST=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PORT=
DATABASE_PASS=

JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
```

**4- Configure Database:**

- Create a PostgreSQL database
- Run database.sql commands in the database

**5: Start Server:**

```
npm start
```
