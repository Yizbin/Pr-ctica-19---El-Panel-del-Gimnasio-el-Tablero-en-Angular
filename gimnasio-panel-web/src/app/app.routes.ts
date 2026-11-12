import { Routes } from '@angular/router';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Horarios } from './paginas/horarios/horarios';
import { Miembros } from './paginas/miembros/miembros';
import { FormularioClase } from './paginas/formulario-clase/formulario-clase';
import { soloAdmin } from './sesion/solo-admin';
import { Login } from './paginas/login/login';
import { Panel } from './paginas/panel/panel';
export const routes: Routes = [
    { path: "login", component: Login },
    { path: "", component: Panel, canActivate: [soloAdmin], children: [
        { path: "clases", component: ListaClases, title : "Clases - Admin" },
        { path: "horarios", component: Horarios, title : "Horarios - Admin" },
        { path: "miembros", component: Miembros, title : "Miembros - Admin" },
        { path: "clases/nueva",
            loadComponent: () => import('./paginas/formulario-clase/formulario-clase')
                .then((m)=> m.FormularioClase
        ), title : "Nueva clase - Admin" },
        { path: "", redirectTo: 'clases', pathMatch: 'full'},
    ]},

    { path: "**", redirectTo: "clases" },
];