import { ApiProperty } from '@nestjs/swagger';

export class UserSignedDto {
  @ApiProperty()
  accessToken: string;
}
