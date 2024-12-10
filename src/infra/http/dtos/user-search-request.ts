import {roles_enum, status_enum, user} from '@prisma/client';

import { SearchRequest } from './search-request';

export class UserSearchRequest
  extends SearchRequest
  implements Omit<user, 'password' | 'created_at' | 'updated_at' | 'confirmed_at'>
{
  id: string;
  name: string;
  email: string;
  status: status_enum;
  roles: roles_enum[];
}
