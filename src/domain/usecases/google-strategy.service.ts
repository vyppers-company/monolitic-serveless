import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { environment } from 'src/main/config/environment';
import axios from 'axios';
import { IProfile } from '../entity/user.entity';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: environment.oauth.google.clientID,
      clientSecret: environment.oauth.google.clientSecret,
      callbackURL: environment.oauth.google.callbackUrl,
      scope: environment.oauth.google.scope,
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const {
      _json: { email, name, picture },
    } = profile;
    const user: IProfile = {
      email,
      name,
      profileImage: picture,
      oauth2Partner: 'google',
      termsAndConditions: true,
    };

    const { data } = await axios.get(
      'https://people.googleapis.com/v1/people/me?personFields=genders,birthdays',
      {
        headers: {
          Authorization: `Bearer ${_accessToken}`,
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

    done(null, {
      ...user,
      birthday: formattedBirthday,
      gender: data?.genders ? data.genders[0].value : null,
    });
  }
}
