import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IProfile } from '../entity/user.entity';
import { AuthService } from './auth.service';
import { AuthGoogleDto } from 'src/presentation/dtos/auth-google';

@Injectable()
export class GoogleAuthStrategy {
  constructor(private readonly authService: AuthService) {}
  async validate(dto: AuthGoogleDto): Promise<any> {
    const dataGoogle = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${dto.accessToken}`,
    );

    const user: IProfile = {
      email: dataGoogle.data.email,
      name: `${dataGoogle.data.given_name} ${dataGoogle.data.family_name}`,
      profileImage: dataGoogle.data.picture,
      oauth2Partner: 'google',
      termsAndConditions: true,
      caracteristics: {
        ethnicity: null,
        biotype: null,
        eyes: null,
        gender: null,
        hair: null,
      },
    };

    /* const { data } = await axios.get(
      'https://people.googleapis.com/v1/people/me?personFields=genders,birthdays',
      {
        headers: {
          Authorization: `Bearer ${dto.accessToken}`,
        },
      },
    );

    const formattedBirthday =
      data?.birthdays.length === 2
        ? `${data.birthdays[1].date.year}-${
            data.birthdays[1].date.month < 10
              ? `0${data.birthdays[1].date.month}`
              : data.birthdays[1].date.month
          }-${
            data.birthdays[1].date.day < 10
              ? `0${data.birthdays[1].date.day}`
              : data.birthdays[1].date.day
          }T03:01:00Z`
        : null;
 */
    const response = await this.authService.loginOauth20({
      ...user,
      birthday: /* formattedBirthday */ null,
      caracteristics: {
        ...user.caracteristics,
        gender: /* data?.genders ? data.genders[0].value : */ null,
      },
    });

    return response;
  }
}
