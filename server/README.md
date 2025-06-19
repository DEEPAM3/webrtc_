# Server

This directory contains the backend server for the RTC-1 application.

## Table of Contents

- [Server](#server)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Setup](#setup)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)

## Overview

The server is built with Node.js and Express, providing API endpoints for user authentication, room management, and real-time communication functionalities. It interacts with a MongoDB database to store application data.

## Setup

To set up and run the server, follow these steps:

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the `server` directory and add your environment variables. A typical `.env` file might look like this:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
    Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/rtc_db` or a cloud-based URI) and `your_jwt_secret` with a strong, random string.

4.  **Run the server:**
    ```bash
    npm start
    ```
    The server should now be running, typically on `http://localhost:5000` (or the port specified in your `.env` file).

## Project Structure