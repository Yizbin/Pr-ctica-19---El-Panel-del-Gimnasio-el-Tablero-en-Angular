import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categoria, CATEGORIAS } from '../../../modelos/clase';
import { API_URL } from '../../config';
import { multiploDe } from '../../validadores/multiplo-de';
import { ClasesApi } from '../../servicios/clases-api';
import { Catalogo } from '../../../servicios/catalogo';
import { HttpErrorResponse } from '@angular/common/http';
import { mensajeDeApi, mensajesDelCuerpo } from '../../../servicios/errores';

const IMAGENES = Array.from(
  { length: 8 },
  (_, i) => `/img/clase-0${i + 1}.jpg`
);

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;
  protected readonly apiUrl = API_URL;
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);
  readonly id = input<string>();
  protected readonly guardando = signal(false);
  protected readonly erroresServidor = signal<string[]>([]);

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;
    this.api.obtener(Number(id)).subscribe({
      next: (clase) => this.form.patchValue(clase),
      error: (e) => this.erroresServidor.set([mensajeDeApi(e)])
    })
  }


  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
    categoria: ['fuerza' as Categoria, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    duracionMin: [45, [Validators.required, Validators.min(10), Validators.max(180), multiploDe(5)]],
    imagen: [IMAGENES[0], [Validators.required]],
  });

  protected get f() {
    return this.form.controls;
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this, this.guardando.set(true);
    this.erroresServidor.set([]);

    const datos = this.form.getRawValue();

    const id = this.id();

    const peticion = id ? this.api.actualizar(Number(id), datos) : this.api.crear(datos);

    peticion.subscribe({
      next: () => {
        this.catalogo.recargar();
        this.router.navigate(["/clases"]);
      },
      error: (e: HttpErrorResponse) => {
        const mensajes = e.status === 400 ? mensajesDelCuerpo(e.error) : [];
        this.erroresServidor.set(mensajes.length ? mensajes : [mensajeDeApi(e)]);
        this.guardando.set(false);
      }
    })

  }
}
