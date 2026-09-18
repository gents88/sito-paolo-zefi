import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [articles, books, videos, unreadContacts, totalContacts] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.book.count(),
      this.prisma.video.count(),
      this.prisma.contact.count({ where: { read: false } }),
      this.prisma.contact.count(),
    ]);

    return { articles, books, videos, unreadContacts, totalContacts };
  }
}
