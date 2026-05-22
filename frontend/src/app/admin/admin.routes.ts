import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./dashboard/main/dashboard-main.component').then(m => m.DashboardMainComponent) },
    { path: 'articles', loadComponent: () => import('./articles/articles-list.component').then(m => m.AdminArticlesListComponent) },
    { path: 'articles/new', loadComponent: () => import('./articles/article-form.component').then(m => m.AdminArticleFormComponent) },
    { path: 'articles/:id/edit', loadComponent: () => import('./articles/article-form.component').then(m => m.AdminArticleFormComponent) },
    { path: 'books', loadComponent: () => import('./books/books-list.component').then(m => m.AdminBooksListComponent) },
    { path: 'books/new', loadComponent: () => import('./books/book-form.component').then(m => m.AdminBookFormComponent) },
    { path: 'books/:id/edit', loadComponent: () => import('./books/book-form.component').then(m => m.AdminBookFormComponent) },
    { path: 'videos', loadComponent: () => import('./videos/videos-list.component').then(m => m.AdminVideosListComponent) },
    { path: 'videos/new', loadComponent: () => import('./videos/video-form.component').then(m => m.AdminVideoFormComponent) },
    { path: 'videos/:id/edit', loadComponent: () => import('./videos/video-form.component').then(m => m.AdminVideoFormComponent) },
    { path: 'categories', loadComponent: () => import('./categories/categories-list.component').then(m => m.AdminCategoriesListComponent) },
    { path: 'categories/new', loadComponent: () => import('./categories/category-form.component').then(m => m.AdminCategoryFormComponent) },
    { path: 'categories/:id/edit', loadComponent: () => import('./categories/category-form.component').then(m => m.AdminCategoryFormComponent) },
    ],
  },
];
