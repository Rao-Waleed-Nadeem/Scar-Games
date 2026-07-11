# Database Setup & Migration Roadmap

Project:
DB-Project-Game-Store

Purpose:
Convert the current project from relying on a manually created SQL Server database into a fully reproducible backend.

Goal:

A new developer should be able to execute only:

docker compose up -d
npm install
npm run db:setup
npm run dev

and the project should become completely functional.

---

## Current Status

Backend
✔ Working

Docker SQL Server
✔ Working

Database Connection
✔ Working

Routes
✔ Working

Controllers
✔ Working

Models
✔ Working

Database
✘ Empty

Tables
✘ Missing

Seed Data
✘ Missing

Migration System
✘ Missing

Database Initialization
✘ Missing

Automatic Setup
✘ Missing

---

## IMPORTANT RULES FOR AI AGENT

The AI agent MUST work milestone by milestone.

Never skip milestones.

Never modify unrelated code.

Always preserve existing API behavior.

Every milestone must compile successfully before moving forward.

If any milestone fails, stop immediately.

Never continue with broken code.

---

## Progress Tracker

Milestone 0
Status:
☐ Pending

Milestone 1
Status:
☑ Done

Milestone 2
Status:
☐ Pending

Milestone 3
Status:
☐ Pending

Milestone 4
Status:
☑ Done

Milestone 5
Status:
☑ Done

Milestone 6
Status:
☑ Done

Milestone 7
Status:
☐ Pending

Milestone 8
Status:
☐ Pending

Milestone 9
Status:
☐ Pending

Milestone 10
Status:
☐ Pending

---

Milestone 0
Project Analysis

---

Goal

Understand the current project without changing anything.

Tasks

Inspect

controllers/

models/

routes/

database connection

server.js

package.json

Deliverables

Generate a report containing

Existing tables

Relationships

Foreign keys

Primary keys

Unique constraints

Nullable fields

Identity columns

Current SQL queries

Do NOT modify any files.

Definition of Done

Agent fully understands database structure.

---

Milestone 1
Database Schema Extraction

---

Goal

Generate a complete SQL schema from existing models.

Tasks

Create

backend/database/schema.sql

The schema must contain

CREATE DATABASE

USE DATABASE

CREATE TABLE

PRIMARY KEY

FOREIGN KEY

IDENTITY

CHECK constraints

Indexes

Unique constraints

Definition of Done

Running schema.sql creates every table.

---

Milestone 2
Relationship Verification

---

Goal

Verify every foreign key.

Tasks

Compare

Controllers

Models

Routes

Ensure every relationship exists.

Definition of Done

Database integrity verified.

---

Milestone 3
Sample Data Planning

---

Goal

Determine minimum required records.

Example

Admin

Users

Games

Inventory

Orders

Payments

Deliverable

Database Seed Plan

No coding yet.

---

Milestone 4
Seed SQL

---

Goal

Create

backend/database/seed.sql

Insert

Admin

Demo User

Games

Inventory

Example Orders

Example Payments

Definition of Done

Database becomes usable after executing seed.sql

---

Milestone 5
Database Setup Script

---

Goal

Automate everything.

Create

backend/database/setup-db.js

Responsibilities

Connect SQL Server

Create database if missing

Execute schema.sql

Execute seed.sql

Report progress

Definition of Done

One command recreates everything.

---

Milestone 6
Package Scripts

---

Modify package.json

Add

db:create

db:seed

db:setup

db:reset

Definition of Done

Developer never executes SQL manually.

---

Milestone 7
Docker Improvements

---

Goal

Improve Docker experience.

Tasks

Verify docker-compose

Verify volumes

Verify restart policy

Verify environment variables

Definition of Done

Fresh Docker installation works.

---

Milestone 8
Database Reset

---

Goal

Implement

npm run db:reset

Responsibilities

Drop database

Recreate database

Run migrations

Run seeds

Definition of Done

Fresh database in one command.

---

Milestone 9
Documentation

---

Create

backend/database/README.md

Contents

Project setup

Docker setup

Database setup

Reset instructions

Seed instructions

Migration instructions

Common errors

Troubleshooting

Definition of Done

A new developer can start the project without asking questions.

---

Milestone 10
Final Validation

---

Fresh machine simulation.

Delete database.

Delete Docker volume.

Clone repository.

Run

docker compose up -d

npm install

npm run db:setup

npm run dev

Verify

Database created

Tables created

Seed inserted

Backend starts

Frontend works

Definition of Done

Project is completely reproducible.

---

## Future Improvements

These are NOT part of current work.

□ Replace raw SQL with Sequelize

□ Add migration versioning

□ Add rollback support

□ Add production migrations

□ Add CI/CD database initialization

□ Add integration testing

□ Add GitHub Actions

□ Add automatic health checks

---

## Success Criteria

Project must never depend on

SQL Server Management Studio

Manual SQL execution

Manual table creation

Manual inserts

Manual database creation

Everything should be reproducible using code only.
