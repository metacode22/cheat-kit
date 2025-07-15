import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class PostAccessTokenRequestDto {
  @IsEnum(["client_credentials"])
  grant_type: "client_credentials";

  @IsString()
  @IsNotEmpty()
  appkey: string;

  @IsString()
  @IsNotEmpty()
  appsecret: string;
}
