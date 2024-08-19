# Configuración del Ambiente de Monitorización con Zabbix y GLPI

Este archivo describe cómo configurar un entorno de monitorización utilizando Zabbix y GLPI dentro de un entorno Docker.

## Notas Iniciales

**Aún no aplicado:**
Por el momento, debes agregar manualmente la IP del servidor en la configuración de Zabbix Agent con los siguientes valores:
- `Server=172.21.0.2`
- `ServerActive=172.21.0.2`
- `Hostname=glpi`

## Pasos Manuales para la Configuración Inicial del Contenedor GLPI

En caso de que el agente Zabbix no esté instalado en el contenedor GLPI, sigue estos pasos:

1. Accede al contenedor GLPI:
   ```bash
   docker exec -it glpi bash
