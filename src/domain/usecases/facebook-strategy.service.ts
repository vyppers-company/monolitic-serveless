import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IAccess } from '../entity/user.entity';
import { environment } from 'src/main/config/environment';

@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor() {
    super({
      clientID: environment.oauth.facebook.clientID,
      clientSecret: environment.oauth.facebook.clientSecret,
      callbackURL: environment.oauth.facebook.callbackUrl,
      profileFields: environment.oauth.facebook.fields,
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const {
      _json: {
        birthday,
        email,
        gender,
        name,
        picture: {
          data: { url },
        },
      },
    } = profile;

    const splitedDate = birthday ? String(birthday).split('/') : null;
    const formattedBirthday = splitedDate
      ? `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}T03:01:00Z`
      : null;

    const user: IAccess = {
      email,
      name,
      profileImage: url,
      birthday: formattedBirthday,
      gender,
      oauth2Partner: 'facebook',
      termsAndConditions: true,
    };
    done(null, user);
  }
}
