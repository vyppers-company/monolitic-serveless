export class JWTDto {
  jwt_access: string;
}

export interface DataDecodeJwt {
  _id: string;
  name: string;
  email: string;
}
export interface DecodedJwt {
  data: DataDecodeJwt;
  iat: number;
}
