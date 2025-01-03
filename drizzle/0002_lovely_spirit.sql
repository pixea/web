CREATE TYPE "public"."order_status" AS ENUM('new', 'processed', 'prepared', 'delivery', 'delivered');--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "order_status" DEFAULT 'new' NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"itemsSummary" text,
	"userId" uuid NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"deliveryAddress" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"invoiceAddress" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"delivery" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sum" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created" timestamp DEFAULT (now()) NOT NULL,
	"updated" timestamp DEFAULT (now()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;