import { User } from '@/interfaces/user.interface';
import { generateApiKey } from 'generate-api-key';
import ApiKeyModel from '@models/apikey.model';
import { CurrentStatusEnum } from '@/enums/StatusEnum';
import { ApiKeyException } from '@/exceptions/ApiKeyException';
import UserModel from '@/models/user.model';
class ApiKeyService {
  public newApikey = async (user: User): Promise<string> => {
    // if (!user?.security?.isSetupWallet) {
    //   UserException.walletInstaller();
    // }
    let newApikey:string;
    let flag = true;
    while(flag) {
      newApikey = generateApiKey({ method: 'string', length: 20, pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~+" }).toString();
      let foundApiKey = await ApiKeyModel.findOne({
        apikey: newApikey
      });

      if (foundApiKey == null) {
        flag = false;
      }
    }

    const instance = await ApiKeyModel.create({
      apikey: newApikey,
      owner: user._id,
    });

    await UserModel.updateOne(
      { _id: user._id }, 
      { $push: { apikeys: instance._id } }
    );
    

    return newApikey;
  };

  public removeApikey = async (user: User, apiKey: string): Promise<boolean> => {
    let foundApiKey = await ApiKeyModel.findOne({
      apikey: apiKey
    });

    if (foundApiKey == null) {
      ApiKeyException.doesNoteExist();
    }
    
    if (foundApiKey.owner.toString() != user._id.toString()) {
      ApiKeyException.invalidOwner();
    }

    await ApiKeyModel.updateOne({
      apikey: apiKey,
    }, {
      status: CurrentStatusEnum.INACTIVE
    });

    await UserModel.updateOne(
      { _id: user._id }, 
      { $pull: { apikeys: foundApiKey._id } }
    );

    return true;
  };

  public checkApiKeyActive =async (apiKey: string): Promise<boolean> => {
    let foundApiKey = await ApiKeyModel.findOne({
      apikey: apiKey
    });

    if (foundApiKey == null) {
      ApiKeyException.doesNoteExist();
    }

    if (foundApiKey.status == CurrentStatusEnum.ACTIVE) {
      return true;
    } else {
      return false;
    }
  }

}
export default ApiKeyService;
