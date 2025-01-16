  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Narrowable = string | number | boolean | symbol | object | {} | void | null | undefined;
const tuple = <T extends Narrowable[]>(...args: T)=>args;

export interface IExercise {
    id: number;
    name: string;
    instructions: string;
    description: string;
    section: TSection;
    categories: TCategory[];
    duration: number;
}

export type TSection = "warmup" | "main";
export const categories: string[] = tuple('man meer', 'aanval', 'verdediging', 'passen', 'counter', 'positie', 'fout vragen');
export type TCategory = (typeof categories)[number];