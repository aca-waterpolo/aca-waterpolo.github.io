import { IExercise } from "../../types";
import Exercise from './Exercise';
import './Training.css'

interface TrainingProps { 
    training: IExercise[]
}

export default function Training({ training } : TrainingProps) {

    return (
        <>
            <div className='training'>
                    <h2 className='sectiontitle'>Training ({ training.reduce((sum, cur) => sum += cur.duration,0) } min)</h2>
                    <section className='section'>
                    <h2 className='sectiontitle'>Warmup ({ training.filter(ex => ex.section == "warmup").reduce((sum, cur) => sum += cur.duration,0) } min)</h2>
                    {training.filter(ex => ex.section == "warmup").map((ex, i) => <Exercise exercise={ex} key={i} />)}
                </section>
                <section className='section'>
                    <h2 className='sectiontitle'>Main ({ training.filter(ex => ex.section == "main").reduce((sum, cur) => sum += cur.duration,0) } min)</h2>
                    {training.filter(ex => ex.section == "main").map((ex, i) => <Exercise exercise={ex} key={i} />)}
                </section>
            </div>
        </>
    )
}