-- elevate permissions
update "user" set role = 'admin' where email = 'jakub@duras.me';

-- drop all tables
drop table account;
drop table authenticator;
drop table product;
drop table "session";
drop table "user";
drop table "verificationToken";
DROP TYPE "public"."role";
DROP TYPE "public"."product_status";
