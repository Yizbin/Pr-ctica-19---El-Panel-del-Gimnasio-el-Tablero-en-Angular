import { inject, Component} from '@angular/core';
import { TarjetaClase } from '../componentes/tarjeta-clase/tarjeta-clase';
import { Catalogo } from '../servicios/catalogo';
import { FiltroCategoria } from './componentes/filtro-categoria/filtro-categoria';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TarjetaClase, FiltroCategoria],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly catalogo = inject(Catalogo);
  }
