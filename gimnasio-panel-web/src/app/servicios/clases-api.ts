import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../config';
import { Clase, ClaseNueva, Sobre } from '../../modelos/clase';

@Injectable({
    providedIn: 'root',
})
export class ClasesApi {
    private readonly http = inject(HttpClient);

    crear(datos: ClaseNueva) {
        return this.http
            .post<Sobre<Clase>>(`${API_URL}/clases`, datos)
            .pipe(map((r) => r.data));
    }
}