import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { OpcoesService, ProductOption } from '../../../../core/services/opcoes-service';
import { AppError } from '../../../../core/models/app-error';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Opcao } from '../opcao/opcao';

enum Tela {
    LISTAGEM,
    EDICAO,
}

@Component({
    selector: 'app-opcoes',
    imports: [
        Button,
        Card,
        TableModule,
        CommonModule,
        DrawerModule,
        InputTextModule,
        Opcao
    ],
    templateUrl: './opcoes.html',
    styleUrl: './opcoes.css',
})
export class Opcoes implements OnInit {
    Tela = Tela;
    opcoes: ProductOption[] = [];
    loading: boolean = false;
    tela: Tela = Tela.LISTAGEM;
    opcaoSelecionada: ProductOption | null = null;

    private opcoesService = inject(OpcoesService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.carregarOpcoes();
    }

    carregarOpcoes(): void {
        this.loading = true;

        this.opcoesService.list().subscribe({
            next: (opcoes) => {
                this.opcoes = opcoes;
                this.loading = false;
            },
            error: (err: AppError) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Erro ao carregar opções', detail: err.error, life: 2000 })
            },
        });
    }

    confirmarExclusao(event: Event, id: number) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Tem certeza que deseja excluir essa opção?',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Excluir',
                severity: 'danger',
            },
            accept: () => {
                this.excluirOpcao(id);
            },
        });
    }

    excluirOpcao(id: number): void {
        this.loading = true;

        this.opcoesService.delete(id).subscribe({
            next: () => {
                this.carregarOpcoes();
            },
            error: (err: AppError) => {
                this.messageService.add({ severity: 'error', summary: 'Erro ao excluir opção', detail: err.error, life: 2000 })
                this.loading = false;
            },
        });
    }
}
