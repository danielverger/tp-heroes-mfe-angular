import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { HeroesListComponent } from './heroes-list.component';
import { ModalService } from './../../shared/modal.service';
import { HeroesService } from '../../services/heroes.service';
import * as heroes from './../../../assets/heroes.json'
import { Hero, HeroFilter, HeroResult } from './../../interfaces/hero';

import { MatSnackBarDismiss } from '@angular/material/snack-bar';

class MockModalService {
  confirmDialog = jasmine.createSpy('confirmDialog')
    .and.returnValue({afterClosed: () => of(true)} )
  openSnackBar = jasmine.createSpy('openSnackBar')
    .and.returnValue({
      afterDismissed: () => of({dismissedByAction: true} as MatSnackBarDismiss),
      afterOpened: () => of(true),
    })

  showLoading = () => true
  closeLoading = () => true
}

describe('HeroesListComponent', () => {
  const heroesList = Array.from(heroes) as Hero[];
  const heroesResult = {heroes: heroesList, total: heroesList.length} as HeroResult;

  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroesService: HeroesService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HeroesListComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimations(),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(HeroesListComponent, {
      set: {providers: [{provide: ModalService, useClass: MockModalService }]}})
    .compileComponents();

    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    heroesService = TestBed.inject(HeroesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should display an informative message when delete a hero', () => {
    spyOn(heroesService, 'deleteHero').and.returnValue(of(true));

    component.deleteHero({id: 5, name: 'MOCKMAN'});
    expect(component.modalService.confirmDialog).toHaveBeenCalledWith('Delete Hero', 'Are you sure to delete MOCKMAN?');
    expect(component.modalService.openSnackBar).toHaveBeenCalledWith('MOCKMAN deleted!', 'info');
  });


  it('should display an error message when delete a hero and return exception', () => {
    spyOn(heroesService, 'deleteHero').and.returnValue(throwError(() => '404'));

    component.deleteHero({id: 5, name: 'MOCKMAN'});

    expect(component.modalService.openSnackBar).toHaveBeenCalledWith('404', 'error');
  });


  it('should call the hero search when filtering by name', fakeAsync(() => {
    const getHeroes = spyOn(heroesService, 'getHeroes').and.returnValue(of(heroesResult));

    component.inputName.nativeElement.value = 'MOCKMAN';
    component.getObersrvableFilters().subscribe( (heroes) => {
      expect(heroes).not.toBeNull();
    });

    expect(getHeroes).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 10,
      sortField: 'name',
      sortDirection: 'asc',
      name: 'MOCKMAN'} as HeroFilter);
  }));

  it('should call the hero search when change sort', fakeAsync(() => {
    const getHeroes = spyOn(heroesService, 'getHeroes').and.returnValue(of(heroesResult));

    component.sort.active = 'id';
    component.getObersrvableFilters().subscribe( (heroes) => {
      expect(heroes).not.toBeNull();
    });

    expect(getHeroes).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 10,
      sortField: 'id',
      sortDirection: 'asc',
      name: ''} as HeroFilter);

  }));

  it('should call the hero search when change page size', fakeAsync(() => {
    const getHeroes = spyOn(heroesService, 'getHeroes').and.returnValue(of(heroesResult));

    component.paginator.pageSize = 5;
    component.getObersrvableFilters().subscribe( (heroes) => {
      expect(heroes).not.toBeNull();
    });

    expect(getHeroes).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 5,
      sortField: 'name',
      sortDirection: 'asc',
      name: ''} as HeroFilter);

  }));

  it('should emit input value changes', fakeAsync(() => {
    let inputValue = '';
    component.getObservableFilterName().subscribe((value)=>{inputValue = value});
    component.filterNameControl.setValue('Hero');

    tick(501);
    fixture.detectChanges();

    expect(inputValue).toBe('Hero');
  }));
});
