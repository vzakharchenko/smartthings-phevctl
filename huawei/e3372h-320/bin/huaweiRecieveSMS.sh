set -e

phone="+111111111111"
applicationHost="http://localhost:8098"
applicationId="XXXXXXXX-YYYY-AAA-BBBB-CCCCCCCCCCC"
applicationSecret="XXXXXXXX-YYYY-AAAA-BBBB-CCCCCCCCCCC"

# Receive SMS
/usr/local/bin/e3372h_320 messages --url=192.168.8.1 --exportFile='/opt/modem/messages.json' --exportFormat=json --deleteAfter=true

if [ -f "/opt/modem/messages.json" ]; then
	/usr/local/bin/huawei-phevctl.sh readFileAndSendMessage --applicationId="${applicationId}" --applicationSecret="${applicationSecret}" --messagesFile='/opt/modem/messages.json'
	mkdir -p /opt/modem/logs
	cp -rf /opt/modem/messages.json /opt/modem/logs/`date +"%d-%m-%y"`_messages.json
	rm -rf /opt/modem/messages.json
fi

