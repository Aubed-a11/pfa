# =============================================
# Stage 1 - Build avec Maven
# =============================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copier pom.xml d'abord pour profiter du cache Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et builder
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================
# Stage 2 - Image finale légère
# =============================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un user non-root pour la sécurité
RUN addgroup -S spring && adduser -S spring -G spring

# Copier le JAR depuis le stage build
COPY --from=build /app/target/*.jar app.jar

# Changer le propriétaire
RUN chown spring:spring app.jar

USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
