# CashFlow

CashFlow es una aplicación web para el control de finanzas personales. Este repositorio contiene el **frontend**, desarrollado en Angular + Ionic, que consume la API de [CashFlow Backend](https://cashflow-backend-bhya.onrender.com/) para gestionar plataformas financieras, movimientos de dinero y visualizar la situación económica del usuario de forma clara y ordenada.

🔗 **Demo en producción:** https://cashflow-pi-three.vercel.app
🔗 **API / Backend:** https://cashflow-backend-bhya.onrender.com/docs


## ✨ Funcionalidades

- **Autenticación con JWT**: inicio de sesión y registro de nuevos usuarios. El token se envía en cada petición al backend para identificar al usuario y obtener sus datos.
- **Cambio de contraseña**: sección dedicada para actualizar las credenciales de la cuenta.
- **Plataformas**: alta de las plataformas financieras del usuario (billeteras, bancos, efectivo, etc.), que luego se usan como origen/destino de los movimientos.
- **Movimientos**: registro de operaciones de tipo:
  - **Ingreso**
  - **Gasto**
  - **Permutación** (transferencia entre distintas plataformas)
- **Home / Dashboard**: pantalla principal con:
  - Gráficos de torta y de barras con la distribución de ingresos y gastos.
  - Listado de plataformas del usuario.
  - Movimientos recientes del último mes.

## 🔑 Usuario de prueba

Para explorar la app sin necesidad de registrarte, podés usar la siguiente cuenta de testing:

```
Email:      test@test.com
Contraseña: 12345678
```

## 🛠️ Stack tecnológico

- [Angular](https://angular.io/)
- [Ionic Framework](https://ionicframework.com/)
- [Capacitor](https://capacitorjs.com/) (soporte multiplataforma)
- Chart.js (gráficos de torta y barras del dashboard)
- TypeScript
- Consumo de API REST autenticada con JWT

El backend de este proyecto está construido en **Python (FastAPI)** con **PostgreSQL**, y su repositorio se encuentra en un proyecto aparte.

## 🚀 Puesta en marcha local

### Requisitos previos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/bautista-escalante/cashflow_frontend.git
cd cashflow_frontend

# Instalar dependencias
npm install

# Levantar el entorno de desarrollo
ionic serve
```

La aplicación va a estar disponible en `http://localhost:8100`.

### Conexión con el backend

La app está configurada para consumir la API productiva en:

```
https://cashflow-backend-bhya.onrender.com/
```

> ⏳ Al estar alojado en el plan gratuito de Render, el backend puede "dormirse" por inactividad. Si la primera petición tarda unos segundos en responder, es normal: el servidor se está reactivando.

## 📱 Build para dispositivos móviles

El proyecto usa Capacitor, por lo que también puede compilarse como app nativa:

```bash
ionic build
npx cap sync
npx cap open android   # o npx cap open ios
```

## 📂 Estructura básica del proyecto

```
cashflow_frontend/
├── src/              # Código fuente de la aplicación (páginas, componentes, servicios)
├── capacitor.config.ts
├── ionic.config.json
├── angular.json
└── package.json
```

## 👤 Autor

Desarrollado por [Bautista Escalante](https://github.com/bautista-escalante) como proyecto insignia de portfolio, en conjunto con el backend de CashFlow.