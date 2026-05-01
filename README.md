# Moto-Mind (Porsche Configurator Capstone Project)

Moto-Mind is a full-stack web application that allows users to explore, configure, and customize Porsche models. The platform features an interactive configurator and a virtual garage.

## Project Structure

This is a monorepo containing both the frontend and backend of the application:

- `api/` - The backend Express.js server providing RESTful APIs.
- `web/` - The frontend React application built with Vite and Tailwind CSS.

## Tech Stack

**Frontend:**
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM

**Backend:**
- Node.js
- Express
- TypeScript
- CORS, Helmet, Morgan

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nigam1010/Moto-Mind.git
   cd Moto-Mind
   ```

2. Install dependencies for the backend:
   ```bash
   cd api
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd ../web
   npm install
   ```

### Running Locally

You can run both the frontend and backend development servers concurrently.

**Start the API:**
```bash
cd api
npm run dev
```
The API will run on the configured port.

**Start the Web Client:**
```bash
cd web
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Hosting on Vercel (Frontend)

To deploy the frontend to Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Connect your GitHub account and import the `Moto-Mind` repository.
3. In the project configuration, make the following changes:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
4. The Build and Output Settings should automatically be set to:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will build and host your web application.

## Hosting the Backend

For the Express API, you can use a service like Render, Railway, or Heroku:
1. Create a new Web Service on your chosen platform.
2. Connect the `Moto-Mind` GitHub repository.
3. Set the **Root Directory** to `api`.
4. Set the **Build Command** to `npm install && npm run build`.
5. Set the **Start Command** to `npm start`.
6. Add any required environment variables (e.g., `PORT`).
7. Deploy the service.
