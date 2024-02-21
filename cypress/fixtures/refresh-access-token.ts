import { UserRole } from "../helpers/types";
import { testUser } from "./user-data";

export const refreshAccessTokenResponse = (role: UserRole) =>{
    const newUser = {
        ...testUser,
        userRole: role
    }
    
    return  { "refreshAccessToken": {
    "user": newUser,
    "accessToken": "fake-access-token-2"
} }}