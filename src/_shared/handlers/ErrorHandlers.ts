import { ErrorHandlerKey } from "@/_shared/ioc/Provider";
import { AxiosError } from 'axios';
import { inject } from 'vue';

// Definindo a assinatura do método de tratamento de erro
export type ErrorHandlerWithString = (error: unknown) => string;

export const ErrorHandler: ErrorHandlerWithString = (error: unknown) => {
    // Mapeamento dos erros e retorna a mensagem padronizada
    let errorMessage = "Tipo de erro não mapeado.";
    if (error instanceof AxiosError) {
        errorMessage = `${error.message}`;
    }
    return errorMessage;
};

export function useErrorHandler(): ErrorHandlerWithString {
    const errorHandler = inject<ErrorHandlerWithString>(ErrorHandlerKey);

    if (!errorHandler) {
        throw new Error('O método de tratamento de erros não foi fornecido');
    }

    return errorHandler;
}