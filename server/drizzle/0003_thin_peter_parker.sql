CREATE TYPE "user_role" AS ENUM ('csr', 'team_lead', 'admin');


ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'csr';