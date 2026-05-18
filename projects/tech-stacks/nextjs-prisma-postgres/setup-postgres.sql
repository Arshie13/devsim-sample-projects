-- Creates the roles and databases expected by the .env files of both projects.
-- Run as the postgres superuser, e.g.:
--   psql -U postgres -h localhost -p 5432 -f setup-postgres.sql

-- scenario-1: STUDY_PLANNER
CREATE ROLE studyuser WITH LOGIN PASSWORD 'studypassword';
CREATE DATABASE study_planner OWNER studyuser;
CREATE DATABASE study_planner_test OWNER studyuser;

-- scenario-2: EXPENSE_TRACKER
CREATE ROLE expenseuser WITH LOGIN PASSWORD 'expensepassword';
CREATE DATABASE expense_tracker OWNER expenseuser;
