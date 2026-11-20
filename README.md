# Práctica 19 - El Panel del Gimnasio: El Tablero en Angular

## Respuestas del Ejercicio 1

* **`main.tsx` → `src/main.ts`**: Es el punto de entrada de la aplicación que arranca (`bootstrapApplication`) el componente principal (`App`).
* **`App.tsx` → `src/app/app.ts`**: Es el componente raíz/contenedor de la interfaz de usuario.
* **`vite.config.ts` → `angular.json`**: Es la configuración del bundler y herramientas del CLI (rutas de assets, compilación, estilos globales, etc.).

## Respuestas del Ejercicio 2

* **¿Por qué `clase()` lleva paréntesis?**
  Porque en las versiones recientes de Angular, `input()` declara una **Signal** (Input Signal). Para leer su valor primitivo u objeto dentro de TypeScript o el template HTML, se debe invocar la Signal ejecuntando sus paréntesis `()`.
* **¿Para qué sirve `track`?**
  Aporta un identificador único (como `clase.id`) a cada iteración del bloque `@for`, equivalente a la prop `key` en React. Permite al motor de renderizado de Angular saber exactamente qué elementos cambian o se eliminan para actualizar solo las partes necesarias del DOM de forma óptima.


# Práctica 22 - El panel del gimnasio: crear y editar clases

## Respuestas a las preguntas de la práctica

### Ejercicio 1: Guardar con POST

#### 1. Si el formulario ya valida, ¿por qué también valida el servidor?
Porque la validación del lado del cliente (en Angular) es únicamente una mejora de experiencia de usuario (UX) para dar retroalimentación inmediata, pero puede ser eludida fácilmente. Cualquier persona puede modificar el código JavaScript en el navegador, deshabilitar los validadores o enviar peticiones HTTP directamente al backend usando herramientas como Postman, cURL o scripts. Por seguridad e integridad de la base de datos, el servidor nunca debe confiar en los datos que vienen del cliente y siempre debe validar las reglas de negocio y tipos de datos antes de persistir la información.

#### 2. ¿Por qué `httpResource` para leer y `HttpClient` para crear, editar y eliminar?
* **`httpResource` (Lectura / GET):** Está diseñado de forma declarativa y reactiva con *Signals*. Se ejecuta automáticamente cuando cambian los parámetros reactivos de los que depende, gestiona por sí solo los estados de carga (`isLoading`), errores y datos (`value`), y está optimizado para consultar y mantener sincronizada la vista con datos del servidor.
* **`HttpClient` (Escritura / POST, PATCH, DELETE):** Las mutaciones de datos son acciones imperativas disparadas por eventos concretos del usuario (como hacer clic en "Guardar" o "Eliminar"), no reacciones automáticas a un cambio de estado. `HttpClient` devuelve un `Observable` que permite controlar exactamente cuándo se envía la petición, ejecutar lógica secuencial al completarse (como recargar el catálogo o redirigir de ruta) y manejar errores específicos del envío.

#### 3. ¿Qué pasa si se olvida el `subscribe()`?
La petición HTTP nunca se envía al servidor. En Angular, los `Observable` que devuelve `HttpClient` son "fríos" (*cold observables*), lo que significa que solo definen la configuración de la petición pero no la ejecutan hasta que alguien se suscribe a ellos mediante `.subscribe()` (o convirtiéndolos a promesa con `firstValueFrom`/`lastValueFrom`).

---

### Ejercicio 2: El login, los interceptores y el guardia

#### 1. ¿A qué pieza de React corresponden las rutas hijas (`children`), el interceptor y el guardia?[cite: 2]
* **Rutas hijas (`children`):** Corresponden a las rutas anidadas en React Router (`<Route path="/panel" element={<Panel />}>` con sub-rutas internas) donde el componente padre renderiza un `<Outlet />` (equivalente a `<router-outlet />` en Angular) para mostrar cada vista hija manteniendo el marco o barra de navegación fija.
* **Interceptor HTTP:** Corresponde a los interceptores de **Axios** (`axios.interceptors.request.use` / `response.use`) o a una función *wrapper* personalizada sobre `fetch` que inyecta encabezados globales (como el token `Authorization`) y captura respuestas de error (como `401`) de forma centralizada.
* **Guardia de ruta (`CanActivate`):** Corresponde a un componente envoltorio de rutas protegidas en React Router (por ejemplo, `<ProtectedRoute>` o `<PrivateRoute>`), el cual evalúa si el usuario tiene sesión y permisos válidos antes de renderizar la ruta solicitada o redirigirlo con `<Navigate to="/login" />`.

#### 2. ¿Cuándo se ejecuta el guardia y por qué `salir()` tiene que navegar al login?
* **¿Cuándo se ejecuta el guardia?** Se ejecuta antes de que el enrutador de Angular active y cargue una ruta protegida (cada vez que el usuario intenta navegar hacia `/panel` o cualquiera de sus rutas hijas, ya sea escribiendo la URL, recargando la página o haciendo clic en un enlace).
* **¿Por qué `salir()` tiene que navegar al login?** Porque limpiar el token y los datos de sesión en memoria o `localStorage` solo borra las credenciales, pero no cambia la URL actual. El guardia únicamente evalúa el acceso durante una transición de ruta; si `salir()` no redirige explícitamente al `/login`, el usuario se quedaría viendo la pantalla del panel privado en el navegador aunque ya no tenga sesión activa.

---

### Ejercicio 3: Editar, eliminar y la guarda de salida

#### 1. ¿Cómo decide un mismo formulario, con dos rutas, si manda `POST` o `PATCH`?
A través del parámetro `id` recibido desde la URL mediante el `input()` del componente:
* Si entra por la ruta de creación (`/panel/clases/nueva`), el parámetro `id` llega indefinido (`undefined`), por lo que el componente sabe que es un registro nuevo y envía una petición **`POST`**.
* Si entra por la ruta de edición (`/panel/clases/:id/editar`), el `id` sí tiene un valor válido, por lo que el componente carga los datos existentes con `patchValue` y al guardar envía una petición **`PATCH`** apuntando a ese `id`.

#### 2. ¿Por qué el estado del formulario no se puede observar con un `computed()`?
Porque los formularios reactivos de Angular (`FormGroup` / `FormControl`) están basados en programación reactiva con **RxJS** (`valueChanges`, `statusChanges`) y propiedades mutables tradicionales (`dirty`, `valid`, `invalid`), no en **Signals**. Un `computed()` solo rastrea dependencias de *Signals* leídos dentro de su función; al no detectar señales dentro del `FormGroup`, nunca se vuelve a evaluar cuando el usuario escribe o modifica el formulario.

#### 3. ¿Qué diferencia hay entre `canActivate` y `canDeactivate`, y qué casos no cubre la guarda de salida?
* **Diferencia:** `canActivate` controla la **entrada** a una ruta (verifica si el usuario tiene permiso para acceder antes de cargar el componente), mientras que `canDeactivate` controla la **salida** de una ruta (verifica si el usuario puede abandonar el componente actual, por ejemplo, pidiendo confirmación si hay cambios sin guardar).
* **Casos que no cubre `canDeactivate`:** Solo intercepta navegaciones internas gestionadas por el **Router de Angular** (cambiar de vista, hacer clic en enlaces internos o usar los botones atrás/adelante dentro de la SPA). No cubre acciones externas a Angular como cerrar la pestaña o ventana del navegador, recargar la página (`F5`) o escribir manualmente una URL externa en la barra de direcciones (para esos casos se requiere el evento nativo `beforeunload` del navegador).

* Ejercicio 1: El tubo de búsqueda

¿Qué diferencia hay entre un Signal y un Observable?

Valor síncrono vs. flujo asíncrono: Un Signal siempre guarda un valor actual que se puede leer de inmediato en cualquier momento (ej. clases()). Un Observable es un flujo de eventos a lo largo del tiempo que pueden emitirse ahora, después o nunca.

Suscripciones y limpieza: Los Signals rastrean sus dependencias y se limpian automáticamente sin riesgo de fugas de memoria. Los Observables requieren suscribirse y desuscribirse explícitamente.

Uso: Los Signals son ideales para manejar el estado de la interfaz, mientras que los Observables sirven para coordinar eventos asíncronos complejos y peticiones HTTP.

Ejercicio 2: La caja de búsqueda

¿Qué problema evita switchMap y qué pasaría con mergeMap?

Problema que evita switchMap: Evita las condiciones de carrera (race conditions) y peticiones innecesarias, ya que cancela automáticamente la petición HTTP anterior si el usuario escribe una nueva búsqueda antes de que la primera termine.

Qué pasaría con mergeMap: Ejecutaría todas las peticiones en paralelo sin cancelar ninguna. Si una búsqueda anterior tarda más en responder que la última (por el RETARDO_MS), terminaría sobrescribiendo la pantalla con resultados desactualizados.

¿Qué pasa si se quita catchError y la API se apaga?
En RxJS, un error no capturado termina y mata el flujo del Observable de forma permanente. Si se quita catchError y la API falla, el buscador dejará de funcionar por completo; aunque se vuelva a encender el servidor y se siga escribiendo en la caja de búsqueda, no se volverá a hacer ninguna petición hasta recargar toda la página.
