import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async getAll() {
    return await this.contentService.getAll();
  }

  @Get('biography')
  async getBiography() {
    return await this.contentService.getBiography();
  }

  @Get('stories')
  async getStories() {
    return await this.contentService.getStories();
  }

  @Get('stories/:id')
  async getStoryById(@Param('id') id: string) {
    return await this.contentService.getStory(id);
  }

  @Get('timeline')
  async getTimeline() {
    return await this.contentService.getTimeline();
  }
}
