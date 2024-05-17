import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { 
  Subject, 
  debounceTime, 
  distinctUntilChanged, 
  merge, 
  startWith, 
  switchMap, 
  takeUntil, 
  tap 
} from 'rxjs';

import { Hero } from '../../interfaces/hero';
import { ModalService } from '../../shared/modal.service';
import { HeroesService } from '../../services/heroes.service';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [ModalService]
})
export class HeroesListComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  public totalHeroes = 0;
  public heroesResult: Hero[] = [];
  public filterNameControl = new FormControl();
  private componetDestroyed$ = new Subject<void>();
  
  public modalService = inject(ModalService);
  private heroesService = inject(HeroesService);
  private cd = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('inputName') inputName!: ElementRef;
  
  getObservableFilterName() {
    return this.filterNameControl.valueChanges
      .pipe( 
        debounceTime(500), 
        distinctUntilChanged(),
        tap( () => this.paginator.pageIndex = 0 )
      );
  }    

  getObersrvableFilters() {
    return merge(this.getObservableFilterName(), this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      tap( () => this.modalService.showLoading() ),
      switchMap( () => {
        return this.heroesService.getHeroes(
          {
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            sortField: this.sort.active,
            sortDirection: this.sort.direction,
            name: this.inputName.nativeElement.value,
          })
      } ),
      tap( () => this.modalService.closeLoading() ),
      takeUntil(this.componetDestroyed$)
    )  
  }

  ngAfterViewInit(): void {
    const { pageIndex, pageSize, name, sortDirection, sortField } = this.heroesService.lastFilter;
    this.paginator.pageIndex = pageIndex;
    this.paginator.pageSize = pageSize;
    this.inputName.nativeElement.value = name;
    this.sort.active = sortField;
    this.sort.direction = sortDirection;
    this.cd.detectChanges();

    this.sort.sortChange.subscribe( () => this.paginator.pageIndex = 0 );

    this.getObersrvableFilters().subscribe({
      next: ({ heroes, total }) => {
        this.heroesResult = heroes;
        this.totalHeroes = total;
      },
      error: ( err ) => {
        this.modalService.openSnackBar(err, 'error');
        this.modalService.closeLoading();
      },
    })
  }

  deleteHero(hero: Hero) {
    this.modalService.confirmDialog('Delete Hero', `Are you sure to delete ${hero.name}?`).afterClosed().subscribe(
        deleteOK => deleteOK && 
          this.heroesService.deleteHero(hero.id).subscribe({
            next: ( deleted ) =>
                deleted && this.modalService.openSnackBar(`${hero.name} deleted!`, 'info').afterOpened().subscribe( () => {
                  this.paginator.page.next(this.paginator)
            }),
            error: ( err ) => this.modalService.openSnackBar(err, 'error')
        })
      );
  }

  ngOnDestroy() {
    this.componetDestroyed$.next();
    this.componetDestroyed$.complete();
  }

}


