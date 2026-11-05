# Práctica 19 - El Panel del Gimnasio: El Tablero en Angular

## Respuestas del Ejercicio 1[cite: 2]

* **`main.tsx` → `src/main.ts`**: Es el punto de entrada de la aplicación que arranca (`bootstrapApplication`) el componente principal (`App`).
* **`App.tsx` → `src/app/app.ts`**: Es el componente raíz/contenedor de la interfaz de usuario.
* **`vite.config.ts` → `angular.json`**: Es la configuración del bundler y herramientas del CLI (rutas de assets, compilación, estilos globales, etc.).

## Respuestas del Ejercicio 2[cite: 2]

* **¿Por qué `clase()` lleva paréntesis?**
  Porque en las versiones recientes de Angular, `input()` declara una **Signal** (Input Signal). Para leer su valor primitivo u objeto dentro de TypeScript o el template HTML, se debe invocar la Signal ejecuntando sus paréntesis `()`.
* **¿Para qué sirve `track`?**
  Aporta un identificador único (como `clase.id`) a cada iteración del bloque `@for`, equivalente a la prop `key` en React. Permite al motor de renderizado de Angular saber exactamente qué elementos cambian o se eliminan para actualizar solo las partes necesarias del DOM de forma óptima.
