-- elevate permissions
update "user" set role = 'admin' where email = 'jakub@duras.me';

-- drop all tables respecting FK dependencies (no CASCADE available)
drop table if exists account;
drop table if exists authenticator;
drop table if exists "session";
drop table if exists "order";
drop table if exists "verificationToken";
drop table if exists "guest-cart";
drop table if exists product;
drop table if exists "user";
drop table if exists __drizzle_migrations;

-- drop enums after dependent tables are gone
drop type if exists "public"."product_status";
drop type if exists "public"."order_status";
drop type if exists "public"."role";
