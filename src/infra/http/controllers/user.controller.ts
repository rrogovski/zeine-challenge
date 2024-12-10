import {UsersService} from "../../../application/services/users-service";
import {Get, Param, Query} from "@nestjs/common";
import {user} from "@prisma/client";

export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async index(@Query() query: any){
    return this.userService.findAll(query);
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
