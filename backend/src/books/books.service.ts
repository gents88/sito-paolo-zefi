import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.book.create({ data } as any);
  }

  findAll(query: any) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    return this.prisma.book.findMany({ take: limit, skip, orderBy: { createdAt: 'desc' } } as any);
  }

  findOne(id: string) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.book.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
