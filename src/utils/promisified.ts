import { sign, Secret, SignOptions } from 'jsonwebtoken';

export function jwtSign(
  payload: string | Object | Buffer,
  secretOrPrivateKey: Secret,
  options?: SignOptions,
): Promise<string> {
  return new Promise((rs, rj) => {
    sign(payload, secretOrPrivateKey, options, (err, encoded) => {
      if (err) rj(err);
      else if (encoded) rs(encoded);
    });
  });
}
