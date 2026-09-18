import { CreateArticleDto, StatusEnum } from './create-article.dto';

export class UpdateArticleDto {
	title?: string;
	subtitle?: string;
	description?: string;
	content?: string;
	image?: string;
	tags?: string[];
	status?: StatusEnum;
	categoryId?: string;
}
