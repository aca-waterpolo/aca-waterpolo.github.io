import { IExercise, TCategory, TSection } from "../types";

const exercisePool: IExercise[] = [];

export async function GenerateTraining(categories: TCategory[], endTrainingWithPracticeMatch: boolean, trainingLength: number = 90) {
    const poolData = await fetch("/exercisepool.json");
    const pool : IExercise[] = await poolData.json();
    exercisePool.length = 0;
    exercisePool.push(...pool);

    const warmup = GenerateTrainingWarmup();
    const warmupLength = warmup.reduce((sum, val) => sum += val.duration, 0);
    console.log(warmupLength);
    const main = GenerateTrainingMain(trainingLength - warmupLength, categories, endTrainingWithPracticeMatch);

    const training = [...warmup, ...main];

    return training;
}

/**
 * Generates a warmup for a training.
 * Warmups are generally about 30 minutes.
 */
function GenerateTrainingWarmup(warmupLength : number = 30) { 
    const warmupPool: IExercise[] = exercisePool.filter(ex => ex.section == "warmup");

    warmupLength -= warmupLength * .15;

    const warmup: IExercise[] = [];

    while (warmup.reduce((sum, val) => sum += val.duration, 0) < warmupLength && warmupPool.length > 0) { 
        const exercise: IExercise = GetExercise("warmup");
        warmup.push(exercise);
    }

    return warmup;
}

function GenerateTrainingMain(mainLength : number, categories : TCategory[], endTrainingWithPracticeMatch: boolean) {
    const mainPool: IExercise[] = exercisePool.filter(ex => ex.section == "main");
    mainLength -= mainLength * .15;

    const main: IExercise[] = [];

    if (endTrainingWithPracticeMatch) {
        const match: IExercise = {
            id: -1,
            name: "match",
            instructions: "Team up!",
            description: "End of training match",
            section: "main",
            categories: [],
            duration: 20
        }
        main.push(match);
    }

    while (main.reduce((sum, val) => sum += val.duration, 0) < mainLength && mainPool.length > 0) { 
        const exercise: IExercise = GetExercise("main", categories);
        main.splice(-1, 0, exercise);
    }

    return main;
}

function GetExercise(section: TSection, categories: TCategory[] | undefined = undefined) { 
    let pool : IExercise[] = exercisePool.filter(ex => ex.section == section);

    let exercise: IExercise = pool[0];

    if (categories && categories.length > 0) {
        pool = pool.filter(ex => ex.categories.filter(c => categories.includes(c)).length >= 1);
        pool.sort((a, b) => {
            const numA = a.categories.filter(c => categories.includes(c)).length;
            const numB = b.categories.filter(c => categories.includes(c)).length;
            return numB - numA;
        });
        const ind = Math.floor(Math.random() * Math.min(3, pool.length));

        exercise = pool[ind];
    }
    else { 
        const ind = Math.floor(Math.random() * pool.length);
        exercise = pool[ind];
    }

    const rmId = exercisePool.indexOf(exercise);
    exercisePool.splice(rmId, 1);

    return exercise;
}