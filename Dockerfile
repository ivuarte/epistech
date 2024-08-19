# aun no aplicado | por el momento agregar la ip Server 172.21.0.2 ServerActive 172.21.0.2 Hostname glpi por pirmera vez
#PASOS MANUALES EN glpi CONTAINER EN EL CASO QUE NO ESTÉ INSTALADO EL AGENTE EN GLPI por primera ver
# docker exec -it glpi bash
# apt-get update
# apt-get install -y zabbix-agent nano
# nano /etc/zabbix/zabbix_agentd.conf
# echo "service zabbix-agent start" >> ~/.bashrc
# service zabbix-agent start
# ps aux | grep zabbix_agentd

#EL AGENT DE ZABBIT EN GLPI INICIA CUANDO INICIO ELK BASH


FROM diouxx/glpi

# Instalar agente Zabbix
RUN apt-get update && \
    apt-get install -y zabbix-agent

# Configurar el agente Zabbix
COPY zabbix_agentd.conf /etc/zabbix/zabbix_agentd.conf

CMD ["zabbix_agentd", "-f"]