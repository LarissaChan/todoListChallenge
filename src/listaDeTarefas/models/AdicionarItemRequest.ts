export class AdicionarItemRequest {
    public id?: number;
    public nome: string;
    public estaCompleto?: boolean;

    constructor(nome: string){
        this.nome = nome;
    }
}