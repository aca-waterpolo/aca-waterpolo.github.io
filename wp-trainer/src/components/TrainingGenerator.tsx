import { useEffect, useState } from 'react';
import { GenerateTraining } from '../TrainingGenerator'
import { categories, IExercise } from "../../types";
import './TrainingGenerator.css'
import Training from './Training';
import Exercise from './Exercise';

export default function TrainingGenerator() {
    const [training, setTraining] = useState<IExercise[]>([]);
    const [filter, setFilter] = useState<string[]>([]);
    const [exercisePool, setExercisePool] = useState<IExercise[]>([]);
    const [filteredExercisePool, setFilteredExercisePool] = useState<IExercise[]>([]);

    const GetTraining = async () => {
        const newTraining = await GenerateTraining(filter, true);
        setTraining(newTraining);
    }

    const loadExercisePool = async () => {
        const poolData = await fetch("/exercisepool.json");
        const pool: IExercise[] = await poolData.json();
        setExercisePool(pool);
        setFilteredExercisePool(pool.filter((e) => !training.some((val) => val.id === e.id)));
    }

    useEffect(() => {
        const load = () => {
            loadExercisePool();
            GetTraining();
        }
        load();
    }, []);

    useEffect(() => {
        const newPool = [...exercisePool]
            .filter((e) => !training.some((val) => val.id === e.id))
            .sort((a, b) => {
                const numA = a.categories.filter(c => filter.includes(c)).length;
                const numB = b.categories.filter(c => filter.includes(c)).length;
                return numB - numA == 0 ? a.id - b.id : numB - numA;
            });
        setFilteredExercisePool(newPool);
    }, [training])

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilter = [...filter];
        if (!e.target.checked && newFilter.includes(e.target.value)) {
            const rmId = newFilter.indexOf(e.target.value);
            newFilter.splice(rmId, 1);
        }

        if (e.target.checked && !newFilter.includes(e.target.value)) {
            newFilter.push(e.target.value);
        }

        setFilter(newFilter);
        GetTraining();
    }

    const handleRefresh = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        GetTraining();
    }

    const handleSave = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        GetTraining();
    }

    return (
        <div className='generator'>
            <form>
                <ul className='filter'>
                    {
                        categories.map((cat, i) =>
                            <li key={`cat-${i}`}>
                                <input type="checkbox" name="categories" id={cat} value={cat} onChange={handleCheckbox} />
                                <label htmlFor={cat}>{cat}</label>
                            </li>)
                    }
                </ul>
                <div className='actions'>
                    <button onClick={handleRefresh}>refresh</button>
                    <button onClick={handleSave}>save</button>
                </div>
            </form>
            <Training training={training} />
            <div className='pool'>
                {filteredExercisePool
                    .map((ex, i) => <Exercise exercise={ex} key={i} />)}
            </div>
        </div>
    )
}