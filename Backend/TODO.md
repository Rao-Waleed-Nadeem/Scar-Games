# DB Setup Roadmap - Implementation TODO

- [ ] Milestone 0: Project analysis report (existing SQL queries + table/PK/FK inference)
- [x] Milestone 1: Create `backend/database/schema.sql`
- [ ] Milestone 2: Verify relationships (FKs match controllers/models usage)
- [ ] Milestone 3: Plan seed data for minimum usable demo
- [x] Milestone 4: Create `backend/database/seed.sql`
- [x] Milestone 5: Create `backend/database/setup-db.js` to run schema+seed and create DB if missing
- [x] Milestone 6: Update `backend/package.json` with `db:create`, `db:seed`, `db:setup`, `db:reset`

- [ ] Milestone 7: Verify docker-compose vars/volumes expectations
- [ ] Milestone 8: Implement `db:reset` logic (drop/recreate, then run schema+seed)
- [ ] Milestone 9: Add `backend/database/README.md`
- [ ] Milestone 10: Final validation (run from clean DB/Docker volume)
