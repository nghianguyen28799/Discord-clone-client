export interface UserType {
  id: string;
  name: string;
  photo: string;
  email: string;
  verified: string;
  verificationCode: string;

  createdAt: Date;
  updatedAt: Date;
  provider: string;
  passwordResetToken: string;
}
