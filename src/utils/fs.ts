import { readFileSync } from 'node:fs';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const readJsonFile = <Response>(filePath: string) => {
  try {
    const file = readFileSync(filePath, 'utf8');

    return JSON.parse(file.toString()) as Response;
  } catch (e) {
    console.error(e);

    return null;
  }
};
