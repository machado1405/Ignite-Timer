import { HandPalm, Play } from "phosphor-react";
import {  HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/CountDown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,
    amountSecondsPassed: number,
    markCurrentCycleAsFinished: () => void,
    setSecondsPassed: (seconds: number) => void,
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
    .number()
    .min(5, 'O ciclo mínimo deve ser de 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    
    const newCycleForm = useForm({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        setCycles(state => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
            } else {
                return cycle;
            }
        }));
    }

    function handleCreateNewCycle(data: any) {
        const newCycle:Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        // ideal setar como funcao, quando depende do valor anterior
        setCycles(state => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
        reset();
    }

    function handleInterruptCycle() {
        setCycles(state => state.map(cycle => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
            } else {
                return cycle;
            }
        }));

        setActiveCycleId(null);
    }
    
    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

                <CyclesContext.Provider 
                    value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <CountDown />
                </CyclesContext.Provider>

                { activeCycle ? (
                    <StopCountDownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                ) : (
                    <StartCountDownButton /*disabled={isSubmitDisabled}*/ type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountDownButton>
                ) }
            </form>
        </HomeContainer>
    )
}