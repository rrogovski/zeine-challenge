import {roles_enum, status_enum, user} from '@prisma/client';

import { SearchPaginationRequest } from './search-pagination-request';

export class UserSearchPaginationRequest
  extends SearchPaginationRequest
  implements Omit<user, 'password' | 'created_at' | 'updated_at' | 'confirmed_at'>
{
  id: string;
  name: string;
  email: string;
  status: status_enum;
  roles: roles_enum[];
}
