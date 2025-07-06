-- Add test invitation code "000000" for testing purposes
INSERT INTO "invitation_codes" ("id", "code", "is_active", "max_uses", "current_uses", "created_by", "created_at") VALUES
('inv-test-000000', '000000', 1, 100, 0, 'admin', now()); 