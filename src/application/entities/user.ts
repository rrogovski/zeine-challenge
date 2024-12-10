import { randomUUID } from 'crypto';
import {roles_enum, status_enum} from "@prisma/client";

export class User {
  constructor({});
  constructor({ id, name, email, password, created_at, updated_at, confirmed_at, status, roles }: User) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.confirmed_at = confirmed_at;
    this.status = status;
    this.roles = roles;
  }

  public get id(): string {
    return this.id;
  }

  public set id(uuid: string) {
    this.id = uuid;
  }

  public get name(): string {
    return this.name;
  }

  public set name(name: string) {
    this.name = name;
  }

  public get email(): string {
    return this.email;
  }

  public set email(email: string) {
    this.email = email;
  }

  public get password(): string {
    return this.password;
  }

  public set password(password: string) {
    this.password = password;
  }

  public get created_at(): Date {
    return this.created_at;
  }

  public set created_at(created_at: Date) {
    this.created_at = created_at;
  }

  public get updated_at(): Date {
    return this.updated_at;
  }

  public set updated_at(updated_at: Date) {
    this.updated_at = updated_at;
  }

  public get confirmed_at(): Date | null {
    return this.confirmed_at;
  }

  public set confirmed_at(confirmed_at: Date | null) {
    this.confirmed_at = confirmed_at;
  }

  public get status(): status_enum {
    return this.status;
  }

  public set status(status: status_enum) {
    this.status = status;
  }

  public get roles(): roles_enum[] {
    return this.roles;
  }

  public set roles(roles: roles_enum[]) {
    this.roles = roles;
  }
}
