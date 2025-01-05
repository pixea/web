CREATE TABLE "guest-cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" jsonb NOT NULL,
	"created" timestamp DEFAULT (now()) NOT NULL,
	"updated" timestamp DEFAULT (now()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "cart" jsonb;