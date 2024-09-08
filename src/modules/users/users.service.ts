import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async getUser(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where: data })
  }
}
