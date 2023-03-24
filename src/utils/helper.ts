import { Types } from 'mongoose';

const mId = (id: string): Types.ObjectId => new Types.ObjectId(id);

export { mId };
