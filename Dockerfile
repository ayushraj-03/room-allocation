# Stage 1: Build the Spring Boot application using Maven and OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source and build package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight JRE 17 Alpine runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy compiled jar
COPY --from=build /app/target/*.jar app.jar

# Default cloud container port (e.g., Render, Railway)
ENV PORT=10000
EXPOSE 10000

# Memory tuning for 512MB free tier containers
ENTRYPOINT ["sh", "-c", "java -Xmx380m -XX:+UseSerialGC -Dserver.port=${PORT:-10000} -jar app.jar"]
