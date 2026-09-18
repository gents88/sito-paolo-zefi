import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { VideosModule } from './videos/videos.module';
import { CategoriesModule } from './categories/categories.module';
import { ContentModule } from './content/content.module';
import { GalleryModule } from './gallery/gallery.module';
import { PublicationsModule } from './publications/publications.module';
import { ContactModule } from './contacts/contact.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ArticlesModule,
    BooksModule,
    VideosModule,
    CategoriesModule,
    ContentModule,
    GalleryModule,
    PublicationsModule,
    ContactModule,
    StatsModule,
  ],
})
export class AppModule {}

