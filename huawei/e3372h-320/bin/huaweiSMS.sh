set -e

phone="+111111111111"
applicationHost="http://localhost:8098"
applicationId="XXXXXXXX-YYYY-AAA-BBBB-CCCCCCCCCCC"
applicationSecret="XXXXXXXX-YYYY-AAAA-BBBB-CCCCCCCCCCC"

#Send SMS
MESSAGE=`curl -s --noproxy "*" "$applicationHost/$applicationId/$applicationSecret/message1"`

if [[ "x${MESSAGE}" == "x" ]]; then
  MESSAGE=`curl -s --noproxy "*" "$applicationHost/$applicationId/$applicationSecret/message2"`
fi


if [[ "x${MESSAGE}" == "x" ]]; then
#  echo "send message skip"
exit 0;
fi

/usr/local/bin/e3372h_320 sendSMS --phone="${phone}" --message="${MESSAGE}" --url=192.168.8.1

