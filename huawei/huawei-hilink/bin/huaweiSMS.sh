set -e

phone="+111111111111"
applicationHost="http://localhost:8098"
applicationId="XXXXXXXX-YYYY-AAA-BBBB-CCCCCCCCCCC"
applicationSecret="XXXXXXXX-YYYY-AAAA-BBBB-CCCCCCCCCCC"
password="Your Password"
#Send SMS
MESSAGE=`curl -s --noproxy "*" "$applicationHost/$applicationId/$applicationSecret/message1"`

if [[ "x${MESSAGE}" == "x" ]]; then
  MESSAGE=`curl -s --noproxy "*" "$applicationHost/$applicationId/$applicationSecret/message2"`
fi


if [[ "x${MESSAGE}" == "x" ]]; then
#  echo "send message skip"
exit 0;
fi


/usr/local/bin/huawei-hilink sendSMS --phone="${phone}" --message="${MESSAGE}" --url=192.168.89.1 --password="${password}"

