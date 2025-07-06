CREATE TYPE "public"."blood_group" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Men', 'Women', 'Transgender');--> statement-breakpoint
CREATE TYPE "public"."id_type" AS ENUM('Birth Certificate', 'NID');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"division" varchar(100) NOT NULL,
	"district" varchar(100) NOT NULL,
	"main_point" varchar(255) NOT NULL,
	"blood_group" "blood_group" NOT NULL,
	"gender" "gender" NOT NULL,
	"date_of_birth" varchar(20) NOT NULL,
	"id_type" "id_type" NOT NULL,
	"id_number" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
