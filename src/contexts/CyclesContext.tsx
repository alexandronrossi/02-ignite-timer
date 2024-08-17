import { createContext, ReactNode, useState } from 'react'

interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CreateCycleFormData {
	task: string
	minutesAmount: number
}

interface CyclesContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsFinished: () => void
	setSecondsAmountPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleFormData) => void
	interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
	children: ReactNode
}

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

	function setSecondsAmountPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function markCurrentCycleAsFinished() {
		setCycles((state) =>
			state.map((cycle) => {
				return cycle.id === activeCycleId
					? { ...cycle, finishedDate: new Date() }
					: cycle
			}),
		)
	}

	function createNewCycle(data: CreateCycleFormData) {
		const id = String(new Date().getTime())

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}

		setCycles((state) => [...state, newCycle])
		setActiveCycleId(id)
		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				return cycle.id === activeCycleId
					? { ...cycle, interruptedDate: new Date() }
					: cycle
			}),
		)

		setActiveCycleId(null)
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				markCurrentCycleAsFinished,
				amountSecondsPassed,
				setSecondsAmountPassed,
				createNewCycle,
				interruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	)
}
