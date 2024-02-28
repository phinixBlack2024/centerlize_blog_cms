import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();
async function main(){
    const password = await bcrypt.hash('Password',10)
    await prisma.user.create({
      data:{
        name:"Admin",
        password:password,
        email:"admin@gmail.com"
      }
    });
}

main().catch((e) =>{
   console.error(e);
   process.exit(1);  
}).finally(async () => {
    await prisma.$disconnect();
})
