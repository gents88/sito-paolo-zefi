import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private prisma: PrismaService) {}

  async sendMessage(createContactDto: CreateContactDto) {
    await this.prisma.contact.create({ data: createContactDto });
    this.logger.log(`Nuovo messaggio da ${createContactDto.nome}: ${createContactDto.oggetto}`);
    return {
      success: true,
      message: 'Messaggio ricevuto con successo. Risponderemo presto!',
    };
  }

  findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markRead(id: string, read = true) {
    return this.prisma.contact.update({ where: { id }, data: { read } });
  }

  remove(id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }

  async removeMany(ids: string[]) {
    return this.prisma.contact.deleteMany({ where: { id: { in: ids } } });
  }
}
