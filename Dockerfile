# Usar una imagen base de Node.js
FROM node

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install
RUN npm install -g nodemon

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que la aplicación va a correr
EXPOSE 8080

# Comando para correr la aplicación
CMD ["npm", "start"]
