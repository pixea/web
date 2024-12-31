ALTER TABLE "authenticator" ADD COLUMN "created" timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "updated" timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "description" jsonb DEFAULT '{"en":"","sk":""}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "created" timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated" timestamp DEFAULT (now()) NOT NULL;