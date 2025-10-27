import { UserRole } from '../enums';
export interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    stripeCustomerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserProfile extends User {
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    profileImage?: string;
}
//# sourceMappingURL=user.d.ts.map