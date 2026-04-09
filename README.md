# Frontend Takhion

Frontend del proyecto **Takhion**, construido con **React + TypeScript + Vite**.

Este repositorio contiene la interfaz web del sistema y está pensado para integrarse con los servicios backend del ecosistema Takhion.

El objetivo es proporcionar una base moderna, rápida y escalable para el desarrollo de aplicaciones web utilizando herramientas actuales del ecosistema JavaScript.

---

# Stack Tecnológico

Este proyecto utiliza:

- React
- TypeScript
- Vite
- TailwindCSS
- Radix UI
- React Hook Form
- ESLint
- Playwright (testing end-to-end)

---

# Requisitos

Antes de ejecutar el proyecto debes tener instalado:

- Node.js 18 o superior
- npm o yarn

Puedes verificar la instalación con:

node -v
npm -v

---

# Instalación

Clonar el repositorio:

git clone https://github.com/DTakhion/frontend-takhion.git

Entrar al proyecto:

cd frontend-takhion

Instalar dependencias:

npm install

o si utilizas yarn:

yarn install

---

# Ejecutar en desarrollo

Para iniciar el servidor de desarrollo:

npm run dev

o si utilizas yarn:

yarn dev

Luego abrir en el navegador:

http://localhost:5173

Vite realizará recarga automática al modificar el código.

---

# Build de producción

Para generar el build optimizado:

npm run build

---

# Previsualizar el build

npm run preview

---

# Testing

Este proyecto utiliza **Playwright** para testing end-to-end.

Ejecutar tests:

npx playwright test

Modo interfaz gráfica:

npx playwright test --ui

---

# Linting

Para revisar el código con ESLint:

npm run lint

---

# Expansión de configuración ESLint

Este proyecto utiliza ESLint para mantener calidad del código.

Para habilitar reglas con verificación de tipos en TypeScript se recomienda configurar:

export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})

También se pueden instalar plugins específicos para React:

npm install eslint-plugin-react-x eslint-plugin-react-dom --save-dev

Ejemplo de configuración:

import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})

---

# Flujo de trabajo recomendado

Para colaborar en el proyecto se recomienda el siguiente flujo de trabajo:

Crear una rama:

git checkout -b feature/nueva-funcionalidad

Realizar cambios y commits.

git commit -m "feat: nueva funcionalidad"

Subir cambios:

git push origin feature/nueva-funcionalidad

Luego crear un Pull Request en GitHub que requerira ser revisado por Tech Lead 
