## scp
```
scp download.sh hyperledger-fabric-ca-linux-amd64-1.4.7.tar.gz hyperledger-fabric-linux-amd64-2.2.0.tar.gz ubuntu:${host1}:~/fabric
```


## /etc/hosts
```
172.16.16.6 peer0.org1.example.com
172.16.16.22 peer0.org2.example.com
172.16.16.37 peer0.org3.example.com
172.16.16.21 peer0.org4.example.com
```


## ~/.bashrc
```bash
export host1=172.16.16.6
export host2=172.16.16.22
export host3=172.16.16.37
export host4=172.16.16.21
```

## install
```bash
sudo apt install nodejs
sudo apt install docker-compose
sudo usermod -aG docker $USER
# sudo reboot
bash download.sh 2.2.0 1.4.7
```



## steps

init docker swarm with networkName

vim /ect/hosts to match IP and domain name

vim xxx.yaml to replace localhost:7051,8051,9051,10051 with corresponding 
domainName:PORT

global search CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE and set value networkName in docker swarm



## network topology
### pc1
1. A Certificate Authority (ca_org1)
2. 1 Peer(s) (peer0.org1.example.com)
3. Orderer (orderer0.example.com)
4. Cli

### pc2
1. A Certificate Authority (ca_org2)
2. 1 Peer(s) (peer0.org2.example.com)

### pc3
1. A Certificate Authority (ca_org3)
2. 1 Peer(s) (peer0.org3.example.com)

### pc4
1. A Certificate Authority (ca_org4)
2. 1 Peer(s) (peer0.org4.example.com)

# last
refer to [HOWTOUSE.md](./HOWTOUSE.md)