import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import * as zod from 'zod'

import {
	CountDownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	Separator,
	StartCountdownButton,
	TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Informe a tarefa'),
	minutesAmount: zod
		.number()
		.min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
		.max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
	id: string
	task: string
	minutesAmount: number
}

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
	const [amountSecondPassed, setAmountSecondPassed] = useState<number>(0)

	const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: '',
			minutesAmount: 0,
		},
	})

	function handleCreateNewCycle(data: NewCycleFormData) {
		const id = String(new Date().getTime())

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
		}

		setCycles((state) => [...state, newCycle])
		setActiveCycleId(id)

		reset()
	}

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
	const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
	const currentSecond = activeCycle ? totalSeconds - amountSecondPassed : 0

	const minutesAmount = Math.floor(currentSecond / 60)
	const secondsAmount = totalSeconds % 60

	const minutes = String(minutesAmount).padStart(2, '0')
	const seconds = String(secondsAmount).padStart(2, '0')

	const task = watch('task')
	const isSubmitDisabled = !task

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<FormContainer>
					<label htmlFor="task">Vou trabalhar em</label>
					<TaskInput
						type="text"
						id="task"
						list="task-sugestions"
						placeholder="Dê um nome para o seu projeto"
						{...register('task')}
					/>

					<datalist id="task-sugestions">
						<option value="Projeto 1" />
						<option value="Projeto 2" />
						<option value="Banana" />
					</datalist>

					<label htmlFor="minutesAmount">durante</label>
					<MinutesAmountInput
						type="number"
						id="minutesAmount"
						placeholder="00"
						step={5}
						// min={5}
						// max={60}
						{...register('minutesAmount', { valueAsNumber: true })}
					/>

					<span>minutos.</span>
				</FormContainer>

				<CountDownContainer>
					<span>{minutes[0]}</span>
					<span>{minutes[1]}</span>
					<Separator>:</Separator>
					<span>{seconds[0]}</span>
					<span>{seconds[1]}</span>
				</CountDownContainer>

				<StartCountdownButton type="submit" disabled={isSubmitDisabled}>
					<Play size={24} />
					Começar
				</StartCountdownButton>
			</form>
		</HomeContainer>
	)
}
