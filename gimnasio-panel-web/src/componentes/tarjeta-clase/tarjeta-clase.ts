import { Component, input, output} from '@angular/core';
import { Clase } from '../../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-clase.html',
  styleUrl: './tarjeta-clase.css'
})
export class TarjetaClase {
  readonly clase = input.required<Clase>();

  readonly activa = input(false);

  readonly seleccion = output<Clase>();
}