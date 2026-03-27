# Hints

## Step 1: Install Client Dependencies
Navigate to the `client` folder and run `npm install` to install all required packages.

## Step 2: Install Server Dependencies
Navigate to the `server` folder and run `npm install` to install all required packages.

## Step 3: Configure Environment Variables
Copy the `.env.example` file in the server folder to `.env` and fill in the required values. Look at the server README for guidance on what values are needed.

## Step 4: Run Database Migration
From the `server` directory, run `npx prisma migrate dev` to create the database tables.

## Step 5: Start Both Services
In one terminal, run `npm run dev` from the `client` folder. In another terminal, run `npm run dev` from the `server` folder.