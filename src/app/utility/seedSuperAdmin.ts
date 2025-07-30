import { hashedPasswordFunc } from './hashedPassword';
import { envVars } from "../config/env.config"
import { Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"

export const seedSuperAdmin = async()=>{
    const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

    if(isSuperAdminExist){
        return
    }

    const hashedPassword = await hashedPasswordFunc.generateHashedPassword(envVars.SUPER_ADMIN_PASSWORD)

    await User.create({
        name: "niloy Super",
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        phone: "01999919991",
        address: "mirpur",
        role: Role.SUPER_ADMIN,
    })

    console.log("✅ super admin created")
}