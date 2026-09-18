import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.video.create({ data } as any);
  }

  findAll(query: any) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    return this.prisma.video.findMany({ take: limit, skip, orderBy: { createdAt: 'desc' } } as any);
  }

  findOne(id: string) {
    return this.prisma.video.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.video.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.video.delete({ where: { id } });
  }
}
