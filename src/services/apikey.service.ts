import { User } from '@/interfaces/user.interface';
import { generateApiKey } from 'generate-api-key';
import ApiKeyModel from '@models/apikey.model';
import { CurrentStatusEnum } from '@/enums/StatusEnum';
import { ApiKeyException } from '@/exceptions/ApiKeyException';
import UserModel from '@/models/user.model';
import { UserException } from '@/exceptions/UserException';
class ApiKeyService {
  public newApikey = async (user: User): Promise<string> => {
    if (!user?.security?.isEnable2Fa) {
      UserException.enabled2FA();
    }
    let newApikey: string = await this.generateCodeAPI();

    const instance = await ApiKeyModel.create({
      apikey: newApikey,
      owner: user._id,
    });

    await UserModel.updateOne({ _id: user._id }, { $push: { apikeys: instance._id } });

    return newApikey;
  };

  public removeApikey = async (user: User, apiKey: string): Promise<boolean> => {
    let foundApiKey = await ApiKeyModel.findOne({
      apikey: apiKey,
    });

    if (foundApiKey == null) {
      ApiKeyException.doesNoteExist();
    }

    if (foundApiKey.owner.toString() != user._id.toString()) {
      ApiKeyException.invalidOwner();
    }

    await ApiKeyModel.updateOne(
      {
        apikey: apiKey,
      },
      {
        status: CurrentStatusEnum.INACTIVE,
      },
    );

    await UserModel.updateOne({ _id: user._id }, { $pull: { apikeys: foundApiKey._id } });

    return true;
  };

  public checkApiKeyActive = async (apiKey: string): Promise<boolean> => {
    let foundApiKey = await ApiKeyModel.findOne({
      apikey: apiKey,
    });

    if (foundApiKey == null) {
      ApiKeyException.doesNoteExist();
    }

    if (foundApiKey.status == CurrentStatusEnum.ACTIVE) {
      return true;
    } else {
      return false;
    }
  };

  private async generateCodeAPI(): Promise<string> {
    let newCode: string;
    let flag = true;
    while (flag) {
      newCode = generateApiKey({
        method: 'string',
        length: 20,
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~+',
      }).toString();
      let foundApiKey = await ApiKeyModel.findOne({
        apikey: newCode,
      });

      if (foundApiKey == null) {
        flag = false;
      }
    }

    return newCode;
  }
}
export default ApiKeyService;
