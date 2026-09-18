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
  selector: 'app-admin-book-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.book.title' | translate }}</mat-label><input matInput formControlName="title" /></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.book.author' | translate }}</mat-label><input matInput formControlName="author" /></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.book.description' | translate }}</mat-label><textarea matInput formControlName="description" rows="6"></textarea></mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ 'common.save' | translate }}</button>
    </form>
  `,
})
export class AdminBookFormComponent implements OnInit {
  form: FormGroup;
  id?: string;

  constructor(private api: AdminApiService, private route: ActivatedRoute) {
    this.form = new FormGroup({ title: new FormControl('', Validators.required), author: new FormControl('', Validators.required), description: new FormControl('') });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.api.getBook(this.id).subscribe(a => this.form.patchValue(a));
    }
  }

  save() {
    if (this.id) {
      this.api.updateBook(this.id, this.form.value).subscribe(() => history.back());
    } else {
      this.api.createBook(this.form.value).subscribe(() => history.back());
    }
  }
}
