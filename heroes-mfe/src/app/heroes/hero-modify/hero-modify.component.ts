import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ModalService } from './../../shared/modal.service';
import { Hero } from './../../interfaces/hero';
import { HeroesService } from '../../services/heroes.service';
import { UpperCaseDirective } from './../../shared/upper-case.directive';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-hero-modify',
  templateUrl: './hero-modify.component.html',
  styleUrls: ['./hero-modify.component.scss'],
  standalone: true,
  imports: [
    A11yModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterModule,
    UpperCaseDirective
  ],
  providers: [ModalService]
})
export class HeroModifyComponent implements OnInit {
  public titleCard?: string;
  public heroForm!: FormGroup;
  public isAddHero = true;
  public isSaving = false;

  readonly route = inject(ActivatedRoute,);
  readonly heroesService = inject(HeroesService);
  readonly modalService = inject(ModalService);
  readonly router = inject(Router);
  readonly formBuilder = inject(FormBuilder);
  
  @ViewChild('inputName') inputName!: ElementRef;

  ngOnInit(): void {

    this.heroForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: [{value: '', disabled: true}],
    });

    this.route.data.subscribe( ( data ) => {
      this.titleCard = data['title'];
    });

    this.route.paramMap.subscribe(paramsMap => {
      if ( paramsMap.get('id') ) {
        this.isAddHero = false;
        const idHero = Number(paramsMap.get('id'));
        this.getHero(idHero);
      }
    });
  }

  getHero( idHero: number ) {
    this.modalService.showLoading()
    this.heroesService.getHero(idHero).subscribe({
      next: ( hero: Hero ) =>
      {
        if ( !hero?.id ) {
          this.modalService.openSnackBar(`Hero with id ${idHero} not exists`, 'error')
          .afterDismissed().subscribe(
            () => this.router.navigate(['dashboard/heroes'])
          );
        } else {
          this.heroForm.patchValue(hero);
          this.inputName.nativeElement.select();
        }
      },
      complete: () => this.modalService.closeLoading(),
      error: ( err ) => {
        this.modalService.closeLoading();
        this.modalService.openSnackBar(err, 'error');
      }
    })
  }


  saveHero() {
    this.isSaving = true;
    const hero = this.heroForm.getRawValue() as Hero;
    const saveHero$ = this.isAddHero ? this.heroesService.addHero(hero) : this.heroesService.modifyHero(hero);
    saveHero$.subscribe({
      next: ( hero: Hero ) => {
        this.modalService.openSnackBar(`Hero ${hero.name} ${this.isAddHero ? 'added': 'modified'}!!`, 'info')
        .afterDismissed().subscribe(
          () => this.router.navigate(['dashboard/heroes'])
        );
      }, 
      error: ( err ) => {
        this.modalService.openSnackBar(err, 'error');
        this.isSaving = false;
      }
    })
  }
}
