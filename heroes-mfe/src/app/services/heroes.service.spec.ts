import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import * as heroes from './../../assets/heroes.json'
import { Hero, HeroFilter, HeroResult } from './../interfaces/hero';
import { from } from 'rxjs';

describe('HeroesService', () => {
  const heroesList: Hero[] = [];
  from(heroes).subscribe( (hero: Hero) => {heroesList.push(hero)} );
  
  let service: HeroesService;
  let httpMock: HttpTestingController;
  const heroFilter = new HeroFilter();
  heroFilter.name = 'name';
  heroFilter.pageIndex = 1;
  heroFilter.pageSize = 10;
  heroFilter.sortDirection = 'desc';
  heroFilter.sortField = 'id';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify()
  })

  it('call getHeroes with filter and return heroes data', () => {
    const heroResult = {heroes: heroesList, total:11} as HeroResult;

    service.getHeroes(heroFilter).subscribe( (res: HeroResult) => {
      expect(res).toEqual(heroResult)
    })

    httpMock.expectOne({url: 'heroes?pageIndex=1&pageSize=10&sortField=id&sortDirection=desc&name=name'}).flush(heroResult);
  });

  it('should modify the lastfilter when calling getHeroes with filter', () => {
    const heroResult = {heroes: heroesList, total:11} as HeroResult;

    service.getHeroes(heroFilter).subscribe( () => {
      expect(service.lastFilter).toEqual(heroFilter);
    })

    httpMock.expectOne({url: 'heroes?pageIndex=1&pageSize=10&sortField=id&sortDirection=desc&name=name'}).flush(heroResult);
  });

  it('call getHero with id and return hero data', () => {
    const mockHeroResponse = { id: 1, name: 'MOCK-MAN' } as Hero;

    service.getHero(1).subscribe( (res: Hero) => {
      expect(res).toEqual(mockHeroResponse);
    })

    httpMock.expectOne({url: 'heroes/1'}).flush(mockHeroResponse);
  });

  it('call addHero and return hero data', () => {
    const newHero = {name:'MOCK-MAN'} as Hero;

    service.addHero(newHero).subscribe( (res: Hero) => {
      expect(res).toEqual({...newHero, id: 1});
    })

    const testRequest = httpMock.expectOne({url: 'heroes', method: 'POST'});
    expect(testRequest.request.body).toEqual(newHero);
    testRequest.flush({...newHero, id: 1});
  });

  it('call modifyHero and return hero data', () => {
    const modifiedHero = {id: 9, name:'MOCK-MAN'} as Hero;

    service.modifyHero(modifiedHero).subscribe( (res: Hero) => {
      expect(res).toEqual(modifiedHero);
    })

    const testRequest = httpMock.expectOne({url: 'heroes/9', method: 'PUT'});
    expect(testRequest.request.body).toEqual(modifiedHero);
    testRequest.flush(modifiedHero);
  });

  it('call deleteHero and return true', () => {

    service.deleteHero(5).subscribe( (res: boolean) => {
      expect(res).toEqual(true);
    })

    const testRequest = httpMock.expectOne({url: 'heroes/5', method: 'DELETE'});
    testRequest.flush(true);
  });

  it('should throw an exception when the call fails', () => {
    service.deleteHero(5).subscribe({
      error: (err) => expect(err).toEqual('Something bad happened; please try again later.')
    })

    httpMock.expectOne({url: 'heroes/5', method: 'DELETE'}).error(new ProgressEvent('network error'))
  });  

});
