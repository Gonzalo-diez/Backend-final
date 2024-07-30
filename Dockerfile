# Usar una imagen base de Node.js con una versión específica
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Recompilar módulos nativos para la plataforma de Docker
RUN npm rebuild bcrypt --build-from-source

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que la aplicación va a correr
EXPOSE 8080

# Comando para correr la aplicación
CMD ["npm", "start"]