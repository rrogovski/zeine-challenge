import { randomUUID } from 'crypto';
import { Replace } from './../helpers/replace';
import { User } from './user';

export interface RefreshTokenProps {
  token: string | null;
  isUsed: boolean;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
}

export class RefreshToken {
  private _id: string;
  private props: RefreshTokenProps;

  constructor(
    props: Replace<
      RefreshTokenProps,
      { createdAt?: Date; id?: string; updatedAt?: Date }
    >,
  ) {
    this._id = props.id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get token(): string | null {
    return this.props.token;
  }

  public set token(token: string | null) {
    this.props.token = token;
  }

  public get isUsed(): boolean {
    return this.props.isUsed;
  }

  public set isUsed(isUsed: boolean) {
    this.props.isUsed = isUsed;
  }

  public get isRevoked(): boolean {
    return this.props.isRevoked;
  }

  public set isRevoked(isRevoked: boolean) {
    this.props.isRevoked = isRevoked;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get user(): User {
    return this.props.user;
  }

  public set user(user: User) {
    this.props.user = user;
  }

  public get userId(): string {
    return this.props.user.email;
  }
}
