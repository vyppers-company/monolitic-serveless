import { Role } from './role.interface';

export class JWTDto {
  jwt_access: string;
}

export interface DataDecodeJwt {
  _id: string;
  name: string;
  email: string;
  role: Role;
}
export interface DecodedJwt {
  data: DataDecodeJwt;
  iat: number;
}
