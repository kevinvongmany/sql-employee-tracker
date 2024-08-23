-- Seed data for department table
INSERT INTO "department" ("name") VALUES
('Engineering'),
('Human Resources'),
('Marketing');

-- Seed data for role table
INSERT INTO "role" ("title", "salary", "department") VALUES
('Software Engineer', 80000, 1),
('HR Manager', 60000, 2),
('Marketing Specialist', 50000, 3),
('Senior Software Engineer', 100000, 1),
('Junior Software Engineer', 60000, 1),
('Recruiter', 45000, 2);

-- Seed data for employee table
INSERT INTO "employee" ("first_name", "last_name", "role_id", "manager_id") VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL),
('Michael', 'Brown', 1, 1),
('Sarah', 'Davis', 3, 3),
('David', 'Wilson', 4, 1),
('Laura', 'Taylor', 5, 1),
('James', 'Anderson', 6, 2),
('Linda', 'Thomas', 1, 1),
('Robert', 'Jackson', 4, 1),
('Patricia', 'White', 5, 1),
('Charles', 'Harris', 6, 2),
('Barbara', 'Martin', 3, 3),
('Daniel', 'Thompson', 1, 1),
('Jennifer', 'Garcia', 4, 1);