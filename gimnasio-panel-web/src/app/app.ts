import { Component, signal, computed } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import { Clase } from '../modelos/clase';
import { TarjetaClase } from '../componentes/tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TarjetaClase],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  clases = signal<Clase[]>(CLASES_LOCALES);

  totalClases = computed(() => this.clases().length);
  minutosTotales = computed(() => 
    this.clases().reduce((acc, c) => acc + c.duracionMin, 0)
  );
  clasesLargas = computed(() => 
    this.clases().filter(c => c.duracionMin >= 60).length
  );

  vaciarCatalogo() {
    this.clases.set([]);
  }

  restaurarCatalogo() {
    this.clases.set(CLASES_LOCALES);
  }
}