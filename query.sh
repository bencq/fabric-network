. ./common.sh

export PATH=${PWD}/bin:${PWD}:$PATH
export PRIVATE_DATA_CONFIG=${PWD}/private-data/collections_config.json


CHANNEL_NAME="mychannel"
CC_NAME="fabcar"

chaincodeQuery() {
    setGlobalsForPeer0Org2
    peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} \
    -c '{"function": "queryCar","Args":["CAR1"]}'
}

chaincodeQuery