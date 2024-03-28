# Info

## Tech stack

MERN

-   MongoDB (Database)
-   Express.js (Backend)
-   React (Frontend)
-   Node.js (Backend)

## Reference

[YouTube: Build a Fullstack Blog App using MERN (mongo, express, react, node) / Coding With Dawid](https://youtu.be/xKs2IZZya7c?si=cYPqS_3tcygt4G9C)

---

# Setup

## Environmental variables

Create a `.env` file in the api directory of the project. This file should contain the following variables:

```bash
MONGODB_URI=YOUR_MONGODB_URI
SECRET=YOUR_JWT_TOKEN_SECRET
APP_ORIGIN=YOUR_FRONTEND_URL
```

## Install dependencies

-   Open a terminal in the root directory of the project and run the following commands
-   For backend: `cd api && yarn install`
-   For frontend: `cd client && yarn install`

# Development

-   Open a terminal in the root directory of the project and run the following commands
-   For backend: `cd api && yarn start:dev`
-   For frontend: `cd client && yarn start`
