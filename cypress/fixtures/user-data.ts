import { User, UserRole } from "../helpers/types";

export const testUser: User = {
    "_id": "653972706e601e65dbc3acda",
    "googleId": "112851111131325081111",
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "userRole": UserRole.USER,
    "lastLoginAt": new Date()
}