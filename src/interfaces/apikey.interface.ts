import { CurrentStatusEnum } from "@/enums/StatusEnum";

export interface APIKEY {
    _id: string;
    apikey: string;
    owner: string;
    status: CurrentStatusEnum
  }

  
