import mongoose, { ClientSession } from 'mongoose';

export async function generateCode<T>(
    model: mongoose.Model<T>,
    nameCode: string,
    padLength = 3,
    session: ClientSession | null = null,
): Promise<string> {
    const count = await model.countDocuments().session(session);
    const countString = (count + 1).toString().padStart(padLength, '0');

    return `${nameCode}${countString}`;
}
