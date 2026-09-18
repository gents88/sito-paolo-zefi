import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listArticles(opts: { page?: number; limit?: number; search?: string }): Observable<any> {
    let params = new HttpParams();
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    if (opts.search) params = params.set('search', opts.search);
    return this.http.get(`${this.base}/articles`, { params });
  }

  getArticle(id: string) {
    return this.http.get(`${this.base}/articles/${id}`);
  }

  createArticle(payload: any) {
    return this.http.post(`${this.base}/articles`, payload);
  }

  updateArticle(id: string, payload: any) {
    return this.http.put(`${this.base}/articles/${id}`, payload);
  }

  deleteArticle(id: string) {
    return this.http.delete(`${this.base}/articles/${id}`);
  }

  // Books
  listBooks(opts: { page?: number; limit?: number } = {} as any) {
    let params = new HttpParams();
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    return this.http.get(`${this.base}/books`, { params });
  }

  getBook(id: string) {
    return this.http.get(`${this.base}/books/${id}`);
  }

  createBook(payload: any) {
    return this.http.post(`${this.base}/books`, payload);
  }

  updateBook(id: string, payload: any) {
    return this.http.put(`${this.base}/books/${id}`, payload);
  }

  deleteBook(id: string) {
    return this.http.delete(`${this.base}/books/${id}`);
  }

  // Videos
  listVideos(opts: { page?: number; limit?: number } = {} as any) {
    let params = new HttpParams();
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    return this.http.get(`${this.base}/videos`, { params });
  }

  getVideo(id: string) {
    return this.http.get(`${this.base}/videos/${id}`);
  }

  createVideo(payload: any) {
    return this.http.post(`${this.base}/videos`, payload);
  }

  updateVideo(id: string, payload: any) {
    return this.http.put(`${this.base}/videos/${id}`, payload);
  }

  deleteVideo(id: string) {
    return this.http.delete(`${this.base}/videos/${id}`);
  }

  // Categories
  listCategories() {
    return this.http.get(`${this.base}/categories`);
  }

  getCategory(id: string) {
    return this.http.get(`${this.base}/categories/${id}`);
  }

  createCategory(payload: any) {
    return this.http.post(`${this.base}/categories`, payload);
  }

  updateCategory(id: string, payload: any) {
    return this.http.put(`${this.base}/categories/${id}`, payload);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.base}/categories/${id}`);
  }

  // Stats
  getStats(): Observable<{ articles: number; books: number; videos: number; unreadContacts: number; totalContacts: number }> {
    return this.http.get<{ articles: number; books: number; videos: number; unreadContacts: number; totalContacts: number }>(`${this.base}/stats`);
  }

  // Contacts
  listContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/contacts`);
  }

  markContactRead(id: string) {
    return this.http.patch(`${this.base}/contacts/${id}/read`, {});
  }

  deleteContact(id: string) {
    return this.http.delete(`${this.base}/contacts/${id}`);
  }

  deleteContacts(ids: string[]) {
    return this.http.delete(`${this.base}/contacts/bulk`, { body: { ids } });
  }
}
