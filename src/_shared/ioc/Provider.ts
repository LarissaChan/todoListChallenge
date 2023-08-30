
import { ListaDeTarefaApiClient } from "@/listaDeTarefas/api-client/ListaDeTarefaApiClient";
import { ErrorHandler } from "../handlers/ErrorHandlers";
import { BaseApiClient } from "../api-client/BaseApiClient";

export const ErrorHandlerKey = "ErrorHandlerkey";

export default [
    {
        key: "IListaDeTarefaApiClient",
        provider: new ListaDeTarefaApiClient(new BaseApiClient())
    },
    {
        key: ErrorHandlerKey,
        provider: ErrorHandler,
    },
];