import { signal, computed, Service } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import { Categoria, Clase } from '../modelos/clase';

@Service()
export class Catalogo {
    private readonly clases = signal<Clase[]>(CLASES_LOCALES);

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
}