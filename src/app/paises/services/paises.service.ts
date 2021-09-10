import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.iterface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = [ 'Africa', 'Americas', 'Asia', 'Europa', 'Oceania' ];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion ( region: string ): Observable<PaisSmall[]> {
    const url: string = `${ this._baseUrl }/region/${ region }?fields=alpha3Code;name`;

    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo ( codigo: string ): Observable<Pais | null> {

    /* El comando of es para devolver un tipo vac'io */
    if ( !codigo ) {
      return of(null);
    }
    const url: string = `${ this._baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais>( url )
  }

  getPaisPorCodigoSmall ( codigo: string ): Observable<PaisSmall> {

    const url: string = `${ this._baseUrl }/alpha/${ codigo }?fields=alpha3Code;name`;
    return this.http.get<PaisSmall>( url )
  }

  getPaisesPorCodigos (  borders: string[] ): Observable<PaisSmall[]> {
    if ( !borders ) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];  

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );

  }
}
