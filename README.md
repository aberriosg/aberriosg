# OperationsTI - Sitio Web

Este repositorio contiene el sitio web de OperationsTI, una consultora tecnológica.

## Despliegue en Azure Static Web Apps

### Prerrequisitos
- Una cuenta de Azure
- Una cuenta de GitHub
- El código del sitio web en un repositorio de GitHub

### Pasos para el Despliegue

1. **Preparación del Proyecto**
   - Asegúrate de que todos los archivos estén en el repositorio de GitHub
   - Verifica que `index.html` esté en la raíz del proyecto
   - Crea un archivo `.gitignore` para excluir archivos innecesarios

2. **Configuración en Azure**
   - Inicia sesión en el [Portal de Azure](https://portal.azure.com)
   - Busca "Static Web Apps" en la barra de búsqueda
   - Haz clic en "Crear"

3. **Configuración del Proyecto**
   - Selecciona tu suscripción de Azure
   - Crea un nuevo grupo de recursos o usa uno existente
   - Asigna un nombre a tu aplicación (ej: "OperationsTI-web")
   - Selecciona la región más cercana a tus usuarios
   - En la sección "Build Details":
     - Selecciona "Other" como framework
     - Deja el campo "App location" como "/"
     - Deja el campo "Output location" vacío

4. **Conexión con GitHub**
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio donde está tu código
   - Selecciona la rama principal (main o master)

5. **Configuración de Compilación**
   - No se requiere configuración especial para sitios estáticos
   - Azure detectará automáticamente que es un sitio estático

6. **Despliegue**
   - Azure creará automáticamente un flujo de trabajo de GitHub Actions
   - El sitio se desplegará automáticamente al hacer push a la rama principal

7. **Dominio Personalizado (Opcional)**
   - Ve a la sección "Custom domains" en tu Static Web App
   - Sigue las instrucciones para agregar tu dominio

### Consideraciones Importantes

- Asegúrate de que todas las rutas de recursos (imágenes, scripts, etc.) sean relativas
- Verifica que el archivo `data.json` esté incluido en tu repositorio
- Considera agregar un archivo `web.config` si necesitas reglas de reescritura de URL

### Monitoreo

- Revisa los logs y el rendimiento en la sección "Monitoring" del portal de Azure
- Configura alertas si es necesario

### Soporte

Si encuentras algún problema durante el despliegue, consulta la [documentación oficial de Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/).
