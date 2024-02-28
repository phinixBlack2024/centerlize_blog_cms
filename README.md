## Prism Related Instruction
 1. there is a file name as .env put the url or database for example
 `DATABASE_URL="postgresql://postgres:password@localhost:5432/center_blog_db?schema=public"`
2. run the command to migrate all the table mentioned below
`npx prisma migrate dev --name NAME_of_YOUR_COMMIT`
3. seed the user details using the below command
`npx ts-node src/data/userSeedData.ts`
