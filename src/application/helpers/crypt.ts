import { UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';
import * as crypto from 'crypto';

export class Crypt {
  #hashConfig = {
    type: argon.argon2id,
    version: 19,
    parallelism: 1,
    memoryCost: 64000,
    timeCost: 3,
  };

  #mountHash = (hash: string): string => {
    return `$argon2id$v=19$m=64000,t=3,p=1${hash}`;
  };

  async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const hash = await argon.hash(password, {
      type: this.#hashConfig.type,
      version: this.#hashConfig.version,
      parallelism: this.#hashConfig.parallelism,
      memoryCost: this.#hashConfig.memoryCost,
      timeCost: this.#hashConfig.timeCost,
      salt,
    });

    return hash.split('p=1')[1];
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await argon.verify(
        this.#mountHash(password),
        hash,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
