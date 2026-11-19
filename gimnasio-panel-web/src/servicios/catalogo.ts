import { Injectable, signal, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Categoria, Clase, Sobre } from '../modelos/clase';
import { API_URL } from '../app/config';
import { mensajeDeApi } from './errores';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClasesApi } from '../app/servicios/clases-api';

@Injectable({
    providedIn: 'root',
})
export class Catalogo {

    private readonly api = inject(ClasesApi);
    private readonly recurso = httpResource<Sobre<Clase[]>>(() => `${API_URL}/clases`);

    private readonly clases = computed(() => this.recurso.value()?.data ?? []);

    readonly cargando = computed(() => this.recurso.isLoading());

    private readonly _texto =signal('');
    readonly texto = this._texto.asReadonly();


    readonly error = computed(() => {
        const e = this.recurso.error();
        return e ? mensajeDeApi(e) : null;
    });

    readonly categoria = signal<Categoria | 'todas'>('todas');

    readonly seleccion = signal<Clase | null>(null);

    // derivada
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
        // set remplaza el valor de la variable y update hace lo mismo pero tiene acceso a la variable actual
        this.seleccion.update((actual) => (actual?.id === clase.id ? null : clase));
    }


    private readonly busquedas = new BehaviorSubject<string>('');

    private readonly resultado = toSignal(
        this.busquedas.pipe(
            switchMap((q) =>
                this.api.listar(q).pipe(
                    map((clases): Resultado => ({ cargando: false, error: null, clases })),
                    catchError((e) => of<Resultado>({ cargando: false, error: mensajeDeApi(e), clases: [] })),
                    startWith<Resultado>({ cargando: true, error: null, clases: [] })
                )
            )
        ),
        { initialValue: { cargando: true, error: null, clases: [] } }
    );

    buscar(texto: string): void {
        this._texto.set(texto);
        this.seleccion.set(null);
        this.busquedas.next(texto)
    }

    recargar(): void {
        this.seleccion.set(null);
        this.busquedas.next(this.busquedas.value)
    }
}

interface Resultado {
    cargando: boolean;
    error: string | null;
    clases: Clase[];
}
