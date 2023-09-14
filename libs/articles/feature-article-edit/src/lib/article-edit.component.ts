import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '@realworld/core/forms';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { articleActions, articleEditActions, articleQuery } from '@realworld/articles/data-access';


@UntilDestroy()
@Component({
  selector: 'cdt-article-edit',
  standalone: true,
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  imports: [DynamicFormComponent, ListErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  structure: Field[] = [
    {
      type: 'INPUT',
      name: 'title',
      placeholder: 'Article Title',
      validator: [Validators.required],
    },
    {
      type: 'INPUT',
      name: 'description',
      placeholder: "What's this article about?",
      validator: [Validators.required],
    },
    {
      type: 'TEXTAREA',
      name: 'body',
      placeholder: 'Write your article (in markdown)',
      validator: [Validators.required],
    },
    {
      type: 'INPUT',
      name: 'tagList',
      placeholder: 'Enter Tags',
      validator: [],
    },
    // Added author field to form
    {
      type: 'INPUT',
      name: 'authors',
      placeholder: 'Enter Authors (by e-mail)',
      validator: [this.emailListValidator],
    },
    // End Modification
  ];
  
  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(formsActions.setStructure({ structure: this.structure }));

    this.store
      .select(articleQuery.selectData)
      .pipe(untilDestroyed(this))
      .subscribe((article) => this.store.dispatch(formsActions.setData({ data: article })));
  }

  updateForm(changes: any) {
    // Instead of passing a string to the backend, now a string[] is passed that splits the string at ',' and then trims excess whitespace
    if (changes.tagList && typeof changes.tagList === 'string') {
      changes.tagList = changes.tagList.split(',').map((tag: string) => tag.trim());
    }
    // End Changes
    
    // Add a check for Authors
    if (changes.authors && typeof changes.authors === 'string') {
      changes.authors = changes.authors.split(',').map((author: string) => author.trim());
    }
    // End Modification

    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  // Method for validating a comma seperated list of emails
  emailListValidator(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value !== 'string') return null;

    const emails = control.value.split(',').map(email => email.trim());
    
    for (let email of emails) {
        const isValid = Validators.email(new FormControl(email));

        if (isValid) return { invalidEmailList: true };
    }

    return null;
  }
  // End Modification


  submit() {
    this.store.dispatch(articleEditActions.publishArticle());
  }

  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }
}
