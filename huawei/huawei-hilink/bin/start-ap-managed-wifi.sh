#!/bin/bash
sleep 40
sudo /sbin/iw phy phy0 interface add ap0 type __ap
sleep 10
sudo /bin/ip link set ap0 address b8:27:eb:ff:ff:ff
sleep 5
sudo ifdown --force wlan0 && sudo ifdown --force ap0 && sudo ifup ap0 && sudo ifup wlan0
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -s 192.168.10.0/24 ! -d 192.168.10.0/24 -j MASQUERADE
sudo systemctl restart dnsmasq
