export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface IProfileResponse {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  photo: string;
  provider: string;
  updatedAt: string;
}

export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}
