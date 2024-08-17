import { HandPalm, Play } from 'phosphor-react'
import { createContext, useEffect, useState } from 'react'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles'

interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CyclesContextType {
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	function markCurrentCycleAsFinished() {
		setCycles((state) =>
			state.map((cycle) => {
				return cycle.id === activeCycleId
					? { ...cycle, finishedDate: new Date() }
					: cycle
			}),
		)
	}

	// function handleCreateNewCycle(data: NewCycleFormData) {
	// 	const id = String(new Date().getTime())

	// 	const newCycle: Cycle = {
	// 		id,
	// 		task: data.task,
	// 		minutesAmount: data.minutesAmount,
	// 		startDate: new Date(),
	// 	}

	// 	setCycles((state) => [...state, newCycle])
	// 	setActiveCycleId(id)
	// 	setAmountSecondsPassed(0)
	// 	reset()
	// }

	function handleInterruptCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				return cycle.id === activeCycleId
					? { ...cycle, interruptedDate: new Date() }
					: cycle
			}),
		)

		setActiveCycleId(null)
	}

	// const task = watch('task')
	// const isSubmitDisable = !task

	return (
		<HomeContainer>
			<form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
				<CyclesContext.Provider
					value={{
						activeCycle,
						activeCycleId,
						markCurrentCycleAsFinished,
					}}
				>
					{/* <NewCycleForm /> */}
					<Countdown />
				</CyclesContext.Provider>

				{activeCycle ? (
					<StopCountdownButton onClick={handleInterruptCycle} type="button">
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton /*disabled={isSubmitDisable}*/ type="submit">
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	)
}
