CREATE TABLE "invitation_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL UNIQUE,
	"is_active" integer NOT NULL DEFAULT 1,
	"max_uses" integer NOT NULL DEFAULT 1,
	"current_uses" integer NOT NULL DEFAULT 0,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);

-- Insert some default invitation codes for development
INSERT INTO "invitation_codes" ("id", "code", "is_active", "max_uses", "current_uses", "created_by", "created_at") VALUES
('inv-1', '123456', 1, 10, 0, 'admin', now()),
('inv-2', '666666', 1, 5, 0, 'admin', now()); 