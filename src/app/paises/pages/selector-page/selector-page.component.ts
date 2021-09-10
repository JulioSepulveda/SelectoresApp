import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.iterface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    pais: [ '', Validators.required ],
    frontera: [ '', Validators.required ]

  })

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    /* Codigo para recuperar los datos
    //Cuando cambie la región
    this.miFormulario.get('region')?.valueChanges
      .subscribe ( region => {
        console.log(region)

        this.paisesService.getPaisesPorRegion( region )
          .subscribe ( paises => {
            this.paises = paises;
            console.log(paises)
          })
      }) */

      /* Código para mejorar lo comentado anteriormente */
      this.miFormulario.get('region')?.valueChanges
        .pipe(
        /* El comando ( _ ) es porque no me interesa lo que devuelve, no lo voy a usar */
          tap( ( _ ) => { 
            this.miFormulario.get('pais')?.reset('') ;
            this.cargando = true;
          } ),
          switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
        )
        .subscribe ( paises => {
          this.paises = paises;
          this.cargando = false;
        });

      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( ( _ ) => { 
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          } ),
          switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
          switchMap( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ) )
        )
        .subscribe ( paises => { 
          /* Se pone esta condicion  or ya que puede devolver null cuando un país no tenga fronteras */
          this.fronteras = paises;
          this.cargando = false;
        })

  }

  guardar() {
    console.log( this.miFormulario.value );
  }

}
