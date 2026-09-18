import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArticleDto) {
    return this.prisma.article.create({ data: dto as any });
  }

  // Basic listing with pagination, search and sorting. Use `any` for where/orderBy
  async findAll(query: { page?: number; limit?: number; search?: string; sort?: string }) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.search) {
      where.OR = [{ title: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }];
    }
    const orderBy: any = query.sort ? { [query.sort.replace('-', '')]: query.sort.startsWith('-') ? 'desc' : 'asc' } : { createdAt: 'desc' };

    return this.prisma.article.findMany({ where, take: limit, skip, orderBy } as any);
  }

  findOne(id: string) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateArticleDto) {
    return this.prisma.article.update({ where: { id }, data: dto as any });
  }

  remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
