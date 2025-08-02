import bcryptjs from 'bcryptjs';
import { envVars } from '../config/env.config';

export const generateHashedPassword = async(password: string)=>{
    return await bcryptjs.hash(password, parseInt(envVars.BCRYPT_SALT_ROUND))
}

export const checkHashedPassword = async(password : string, hashedPassword: string)=>{
    return await bcryptjs.compare(password, hashedPassword)
}

export const hashedPasswordFunc = {
    generateHashedPassword,
    checkHashedPassword
}