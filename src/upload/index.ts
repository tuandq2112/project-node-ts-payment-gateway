import { ABSOLUTE_PATH } from '@/config';
import { Request } from 'express';
import fs from 'fs';
import moment from 'moment';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const storage = multer.diskStorage({
  destination: function (request: Request, file: Express.Multer.File, callback: DestinationCallback): void {
    callback(null, ABSOLUTE_PATH);
  },
  filename: function (req: Request, file: Express.Multer.File, callback: FileNameCallback): void {
    try {
      const now: string = moment().format('DD-MM-YYYY');
      const id: string = uuid();
      const folderPath = ABSOLUTE_PATH + now + '/' + id;

      fs.mkdirSync(folderPath, { recursive: true });

      const absolutePath = now + '/' + id + '/' + file.originalname;
      callback(null, absolutePath);
    } catch (err) {
      console.log(err);
    }
  },
});

export default multer({ storage: storage });
