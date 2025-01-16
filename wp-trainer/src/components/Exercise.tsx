import { marked } from "marked";
import parse from 'html-react-parser';
import { IExercise } from "../../types";
import { useEffect, useState } from "react";
import './Exercise.css'

interface ExerciseProps {
    exercise: IExercise
}

export default function Exercise({ exercise }: ExerciseProps) {
    const [desc, setDesc] = useState<string>("");
    const [instructions, setInstructions] = useState<string>("");

    useEffect(() => {
        const ParseData = async () => {
            const newDesc = await marked.parse(exercise.description);
            setDesc(newDesc);
            const newInstructions = await marked.parse(exercise.instructions);
            setInstructions(newInstructions);
        }

        ParseData();

    }, []);

    return (
        <div className='exercise'>
            <article tabIndex={0} onClick={e => (e.target as HTMLElement).focus()}>
                <header>
                    <h1 className='exerciseTitle'>{exercise.id} {exercise.name} ({exercise.duration} min)</h1>
                    <h2>{ parse(desc)}</h2>
                </header>
                <main>
                    {exercise.categories.length > 0 && <ul className="keywords">{exercise.categories.map((kw, index) => (<li key={index}>{kw}</li>))}</ul>}
                    <section className='duration'>
                        <em><time dateTime={`${exercise.duration.toString().padStart(2, '0')}:00`}>{exercise.duration} {exercise.duration == 1 ? "minuut" : "minuten"}</time></em>
                    </section>
                    <section className='description'>{parse(instructions)}</section>
                </main>
            </article>
        </div>
    );
}