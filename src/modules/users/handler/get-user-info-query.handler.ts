import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../common/prisma/prisma.service'
import { GetUserInfoQuery } from '../queries/get-user-info.query'

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler
  implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
  }

  async execute(query: GetUserInfoQuery) {
    const { userId: id } = query
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User does not exist.')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}
