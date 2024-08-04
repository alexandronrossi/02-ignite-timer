import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'

interface ButtonContainerProps {
	variant: ButtonVariant
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
	background-color: ${(props) => props.theme['gray-500']};
	color: ${(props) => props.theme.white};
`
