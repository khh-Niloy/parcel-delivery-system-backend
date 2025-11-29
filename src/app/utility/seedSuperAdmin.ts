import { hashedPasswordFunc } from "./hashedPassword";
import { envVars } from "../config/env.config";
import { IauthProvider, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      return;
    }

    const hashedPassword = await hashedPasswordFunc.generateHashedPassword(
      envVars.SUPER_ADMIN_PASSWORD
    );

    const authProvider: IauthProvider = {
      provider: "credential",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    await User.create({
      name: "niloy Super",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      phone: "01999919991",
      address: {
        latitude: 23.7808875,
        longitude: 90.2792371,
        address: "Mirpur 10, Dhaka",
      },
      role: Role.ADMIN,
      auths: [authProvider],
    });

    // console.log("✅ super admin created")
  } catch (error) {
    console.log(error);
  }
};
