import { Network, PrivateKey } from './Types'
import { keyPairFromPrivateKey } from '@nodefactory/filecoin-address'

class Wallet {

 /**
  * @notice Recover key pair from private key
  * @param privateKey hex or base64 encoded private key
  * @param network mainnet or testnet
  * @returns Key pair
  */
  public keyRecover(privateKey: PrivateKey, network: Network = 'mainnet') {
    if (privateKey.slice(-1) === '=') {
      privateKey = Buffer.from(privateKey, 'base64').toString('hex')
    }

    return keyPairFromPrivateKey(privateKey, network === 'mainnet' ? 'f' : 't')
  }
}

export default Wallet