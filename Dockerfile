# Usa la imagen base oficial de Node.js
FROM node:18.17-alpine3.18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias dentro del contenedor
RUN npm install

# Luego, copia el código de la aplicación
COPY . .

# Compilar la aplicación
RUN npm run build

# Exponer el puerto (ajusta el puerto según tu aplicación)
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]