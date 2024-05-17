import {
  HttpResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http'
import { from, of } from 'rxjs'
import { delay, map, skip, take } from 'rxjs/operators'
import { Hero, HeroResult } from './interfaces/hero'


export const fakeBackendHttpInterceptor = (heroesList: Hero[]) : HttpInterceptorFn => {

  return (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

    let totalFilteredHeroes = 0;

    const { url, method, urlWithParams } = req;

    if ( url === 'heroes' && method === 'GET' ) {
      const searchParams  = new URLSearchParams( urlWithParams.split( '?' )[1] );
      const pageSize      = parseInt( searchParams.get( 'pageSize') ?? '10' );
      const pageIndex     = parseInt( searchParams.get( 'pageIndex') ?? '0' );
      const name          = searchParams.get( 'name' ) ?? '';
      const sortField     = searchParams.get( 'sortField' ) as keyof Hero || 'name';
      const sortDirection = searchParams.get( 'sortDirection' ) ?? '';
      const heroesResult: Hero[] = [];

      const filteredDataObservable$ = of( heroesList )
        .pipe(
          map( ( data: Hero[] ) => {
            return data.filter( hero =>
              hero.name.toUpperCase().includes( name.toLocaleUpperCase() )
            )
            .sort( ( a: Hero, b: Hero ) => {
              return  (a[sortField] < b[sortField] ? 1 : -1) * (sortDirection === 'desc' ? 1 : -1)
            })
          }),
        )

      filteredDataObservable$.subscribe( ( filteredData: Hero[] ) => {
        totalFilteredHeroes = filteredData.length;
        from( filteredData ).pipe(
          skip( pageIndex * pageSize ),
          take( pageSize ))
          .subscribe( ( hero: Hero ) => {
            heroesResult.push( hero );
          });
      });

      const body = { heroes: heroesResult, total: totalFilteredHeroes } as HeroResult;
      return of( new HttpResponse({ status: 200, body }) ).pipe(delay(1000));
    }

    if ( url.startsWith( 'heroes/' ) && method === 'GET' ) {
      const idHero = parseInt( urlWithParams.split('/')[1] );
      const hero = heroesList.find( (hero: Hero) => hero.id === idHero );
      const body = hero;
      return of( new HttpResponse({ status: 200, body }) ).pipe(delay(1000));
    }

    if ( url.startsWith( 'heroes' ) && method === 'DELETE' ) {
      const idHero = parseInt( urlWithParams.split('/')[1] );
      heroesList = heroesList.filter( ( hero: Hero ) => hero.id !== idHero );
      return of( new HttpResponse({ status: 200, body: true }) ).pipe(delay(200));
    }

    if ( url.startsWith( 'heroes' ) && method === 'POST' ) {
      const { body } = req;
      (body as Hero).id = Math.max( ...heroesList.map( ( hero:Hero ) => hero.id ), 0 ) + 1;
      heroesList.push(body as Hero);
      return of( new HttpResponse({ status: 200, body }) ).pipe(delay(200));
    }

    if ( url.startsWith( 'heroes' ) && method === 'PUT' ) {
      const { body } = req;
      const idHero = parseInt(urlWithParams.split( '/' )[1]);
      heroesList = heroesList.filter( ( hero: Hero ) => hero.id !== idHero );
      heroesList.push(body as Hero);
      return of( new HttpResponse({ status: 200, body }) ).pipe(delay(200));
    }

    return next(req);
  }
}
