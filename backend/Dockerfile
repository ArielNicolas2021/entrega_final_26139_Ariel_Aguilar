# Etapa 1: Compilación con Maven
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copia primero el pom.xml para cachear las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia el código fuente y genera el .jar
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución ligera (JRE)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia el .jar compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Render inyecta la variable PORT dinámicamente
EXPOSE 8080

# Limita la memoria de la JVM para encajar en los 512 MB del plan gratuito de Render
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xmx384m", "-Xms128m", "-jar", "app.jar"]