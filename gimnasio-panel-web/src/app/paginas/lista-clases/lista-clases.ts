import { Component, inject } from '@angular/core';
import { Catalogo } from '../../../servicios/catalogo';
import { TarjetaClase } from '../../../componentes/tarjeta-clase/tarjeta-clase';
import { FiltroCategoria } from '../../componentes/filtro-categoria/filtro-categoria';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../config';
import { ClasesApi } from '../../servicios/clases-api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [TarjetaClase, FiltroCategoria, RouterLink, ReactiveFormsModule],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);
  protected readonly apiURL = API_URL;
  private readonly api = inject(ClasesApi);

  protected readonly busqueda = new FormControl(this.catalogo.texto(), {
    nonNullable: true,
  });

  constructor() {
    this.busqueda.valueChanges
      .pipe(
        debounceTime(300),
        map((t) => t.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((texto) => this.catalogo.buscar(texto));
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar la clase?')) return;

    this.api.eliminar(id).subscribe({
      next: () => {
        this.catalogo.recargar();
      },
      error: (e) => {
        console.error('Error al eliminar la clase:', e);
      },
    });
  }
}