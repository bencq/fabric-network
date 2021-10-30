. ./common.sh

export PATH=${PWD}/bin:${PWD}:$PATH
export PRIVATE_DATA_CONFIG=${PWD}/private-data/collections_config.json




CHANNEL_NAME="mychannel"
CC_NAME="putstate"


setGlobalsForPeer0Org1

peer chaincode invoke -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses peer0.org3.example.com:11051 --tlsRootCertFiles $PEER0_ORG3_CA \
    --peerAddresses peer0.org4.example.com:13051 --tlsRootCertFiles $PEER0_ORG4_CA \
    -c '{"function": "create","Args":["aa"]}'
