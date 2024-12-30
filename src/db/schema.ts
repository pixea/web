import { Locales } from "@/i18n/locales";
import { InferSelectModel, sql } from "drizzle-orm";
import {
  uuid,
  pgTable,
  varchar,
  jsonb,
  timestamp,
  text,
  integer,
  primaryKey,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { AdapterAccountType } from "next-auth/adapters";
import { Address } from "./address";
import { ProductPayload } from "./validation";

const timestamps = () => ({
  created: timestamp({ mode: "string" })
    .default(sql`(now())`)
    .notNull(),
  updated: timestamp({ mode: "string" })
    .default(sql`(now())`)
    .notNull()
    .$onUpdate(() => sql`(now())`),
});

const translatedColumn = () =>
  jsonb()
    .notNull()
    .default({ en: "", sk: "" })
    .$type<Record<Locales, string>>();

export const roleEnum = pgEnum("role", ["customer", "admin"]);

export const productStatus = pgEnum("product_status", ["active", "draft"]);

export const users = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar(),
  email: varchar().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  phone: varchar(),
  address: jsonb().$type<Partial<Address>>(),
  image: text(),
  role: roleEnum().notNull().default("customer"),
  ...timestamps(),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar().$type<AdapterAccountType>().notNull(),
    provider: varchar().notNull(),
    providerAccountId: varchar().notNull(),
    refresh_token: varchar(),
    access_token: varchar(),
    expires_at: integer(),
    token_type: varchar(),
    scope: varchar(),
    id_token: varchar(),
    session_state: varchar(),
    ...timestamps(),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  ...timestamps(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar().notNull(),
    token: text().notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text().notNull().unique(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: varchar().notNull(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: varchar().notNull(),
    credentialBackedUp: boolean().notNull(),
    transports: varchar(),
    ...timestamps(),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const products = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  name: translatedColumn().notNull(),
  description: translatedColumn().notNull(),
  status: productStatus().notNull().default("draft"),
  image: varchar(),

  files: jsonb().notNull().default({}).$type<ProductPayload["files"]>(),

  size: jsonb().notNull().default({}).$type<ProductPayload["size"]>(),

  configuration: jsonb()
    .notNull()
    .default([])
    .$type<ProductPayload["configuration"]>(),

  ...timestamps(),
});

export type User = InferSelectModel<typeof users>;

export type Product = InferSelectModel<typeof products>;
