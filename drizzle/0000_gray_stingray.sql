CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"providerAccountId" varchar NOT NULL,
	"refresh_token" varchar,
	"access_token" varchar,
	"expires_at" integer,
	"token_type" varchar,
	"scope" varchar,
	"id_token" varchar,
	"session_state" varchar,
	"created" timestamp DEFAULT (now()) NOT NULL,
	"updated" timestamp DEFAULT (now()) NOT NULL,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" uuid NOT NULL,
	"providerAccountId" varchar NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" varchar NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" varchar,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"name" jsonb DEFAULT '{"en":"","sk":""}'::jsonb NOT NULL,
	"description" jsonb DEFAULT '{"en":"","sk":""}'::jsonb NOT NULL,
	"image" varchar NOT NULL,
	"configuration" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created" timestamp DEFAULT (now()) NOT NULL,
	"updated" timestamp DEFAULT (now()) NOT NULL,
	CONSTRAINT "product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"email" varchar,
	"emailVerified" timestamp,
	"image" text,
	"created" timestamp DEFAULT (now()) NOT NULL,
	"updated" timestamp DEFAULT (now()) NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" varchar NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;