-- ==============================================================================
-- St. Xavier's College Room Allocation System - Initial Seed Data
-- ==============================================================================

-- 1. Seed Specialized Venues
INSERT INTO rooms (name, capacity, building) VALUES
('Seminar room', 80, 'Main Block'),
('Mmr', 90, 'Main Block'),
('Scavi', 60, 'Main Block'),
('Bonet lab', 80, 'Science Block'),
('Knowledge lab', 30, 'Library Block')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Lecture Rooms (Lrs 1 to 50)
DO $$
BEGIN
    FOR i IN 1..50 LOOP
        INSERT INTO rooms (name, capacity, building)
        VALUES ('Lrs ' || i, 70, 'Lrs Block')
        ON CONFLICT (name) DO NOTHING;
    END LOOP;
END $$;

-- 3. Seed Classrooms (Crs 1 to 40)
DO $$
BEGIN
    FOR i IN 1..40 LOOP
        INSERT INTO rooms (name, capacity, building)
        VALUES ('Crs ' || i, 50, 'Crs Block')
        ON CONFLICT (name) DO NOTHING;
    END LOOP;
END $$;

-- 4. Seed Default Accounts (BCrypt hash for 'password123')
INSERT INTO users (name, email, password, role, department) VALUES
('Campus Administrator', 'admin@test.com', '$2a$10$wE99K7oI2e4L1YwO1a0C..zZ6Qv3O8W2UuC1qQk6nZ7G2uGm0j2Oi', 'ADMIN', 'Administration'),
('Computer Science HOD', 'hod@test.com', '$2a$10$wE99K7oI2e4L1YwO1a0C..zZ6Qv3O8W2UuC1qQk6nZ7G2uGm0j2Oi', 'HOD', 'Computer Science'),
('Student Council Rep', 'student@test.com', '$2a$10$wE99K7oI2e4L1YwO1a0C..zZ6Qv3O8W2UuC1qQk6nZ7G2uGm0j2Oi', 'STUDENT', 'Computer Science')
ON CONFLICT (email) DO NOTHING;
