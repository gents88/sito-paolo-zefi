import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-article-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.article.title' | translate }}</mat-label><input matInput formControlName="title" /></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.article.subtitle' | translate }}</mat-label><input matInput formControlName="subtitle" /></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.article.content' | translate }}</mat-label><textarea matInput formControlName="content" rows="10"></textarea></mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ 'common.save' | translate }}</button>
    </form>
  `,
})
export class AdminArticleFormComponent implements OnInit {
  form: FormGroup;
  id?: string;

  constructor(private api: AdminApiService, private route: ActivatedRoute) {
    this.form = new FormGroup({ title: new FormControl('', Validators.required), subtitle: new FormControl(''), content: new FormControl('', Validators.required) });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.api.getArticle(this.id).subscribe(a => this.form.patchValue(a));
    }
  }

  save() {
    if (this.id) {
      this.api.updateArticle(this.id, this.form.value).subscribe(() => history.back());
    } else {
      this.api.createArticle(this.form.value).subscribe(() => history.back());
    }
  }
}
