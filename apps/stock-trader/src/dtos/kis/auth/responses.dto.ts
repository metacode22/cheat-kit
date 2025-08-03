export class PostAccessTokenResponseDto {
  access_token: string;
  access_token_token_expired: string;
  token_type: string;
  expires_in: string;
}

export class PostWebSocketApprovalKeyResponseDto {
  approval_key: string;
}
