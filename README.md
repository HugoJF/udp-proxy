This repo is used to forward A2S packets from a white listed Source Engine server to it's target server, listen for response and send it back to requester.

Usage: node udp-proxy.js <listening_ip> <target_ip> <target_port>

Motivation: I created this to allow external services (GameTracker, Game-State, etc) to access my CS:GO Server A2S responses since my current server provider blocks any incoming/outcoming connections that are not whitelisted.
Since I can only have access to a limited amount of white-listed IPs, I added my Vultr server to this list, and with this script I pipe any request for A2S Packets with my Vultr server.