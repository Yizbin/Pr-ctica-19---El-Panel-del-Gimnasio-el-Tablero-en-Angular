import { Injectable, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Categoria, Clase, Sobre } from '../modelos/clase';
import { API_URL } from '../app/config';
import { mensajeDeApi } from './errores';

@Injectable({
    providedIn: 'root',
})
export class Catalogo {
    private readonly recurso = httpResource<Sobre<Clase[]>>(() => `${API_URL}/clases`)

    private readonly clases = computed(() => this.recurso.value()?.data ?? []);

    readonly cargando = computed(() => this.recurso.isLoading());

    readonly error = computed(() => {
        const e = this.recurso.error();
        return e ? mensajeDeApi(e) : null;
    });

    readonly categoria = signal<Categoria | 'todas'>('todas');

    readonly seleccion = signal<Clase | null>(null);

    //derivada
    readonly visibles = computed(() => {
        const cat = this.categoria();
        const todas = this.clases();
        return cat === 'todas' ? todas : todas.filter((c) => c.categoria === cat);
    });

    readonly minutosTotales = computed(() => {
        return this.visibles().reduce((suma, c) => suma + c.duracionMin, 0);
    });

    filtrar(categoria: Categoria | 'todas'): void {
        this.categoria.set(categoria);
        const elegida = this.seleccion();
        if (elegida && categoria !== 'todas' && elegida.categoria !== categoria) {
            this.seleccion.set(null);
        }
    }

    seleccionar(clase: Clase): void {
        //set remplaza el valor de la variable y update hace lo mismo pero tiene acceso a la variable actual
        this.seleccion.update((actual) => (actual?.id === clase.id ? null : clase));
    }

    recargar(): void{
        this.seleccion.set(null);
        this.recurso.reload();
    }
}