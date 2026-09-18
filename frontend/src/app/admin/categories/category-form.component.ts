import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminApiService } from '../../core/services/admin-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-category-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.category.name' | translate }}</mat-label><input matInput formControlName="name" /></mat-form-field>
      <mat-form-field appearance="fill"><mat-label>{{ 'admin.category.slug' | translate }}</mat-label><input matInput formControlName="slug" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ 'common.save' | translate }}</button>
    </form>
  `,
})
export class AdminCategoryFormComponent implements OnInit {
  form: FormGroup;
  id?: string;

  constructor(private api: AdminApiService, private route: ActivatedRoute) {
    this.form = new FormGroup({ name: new FormControl('', Validators.required), slug: new FormControl('', Validators.required) });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      this.api.getCategory(this.id).subscribe(a => this.form.patchValue(a));
    }
  }

  save() {
    if (this.id) {
      this.api.updateCategory(this.id, this.form.value).subscribe(() => history.back());
    } else {
      this.api.createCategory(this.form.value).subscribe(() => history.back());
    }
  }
}
