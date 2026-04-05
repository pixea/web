CREATE TABLE "order-settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adminNotificationEmails" text[] DEFAULT '{}'::text[] NOT NULL,
	"created" timestamp DEFAULT (now()) NOT NULL,
	"updated" timestamp DEFAULT (now()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'new'::text;--> statement-breakpoint
DROP TYPE "public"."order_status";--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('new', 'confirmed', 'printed', 'packed', 'shipped', 'received', 'archived');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "orderNotificationEmails" text;