import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { OpcoesService, ProductOption } from '../../../core/services/opcoes-service';
import { AppError } from '../../../core/models/app-error';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-opcoes',
  imports: [Button, Card, TableModule, CommonModule, ConfirmPopupModule],
  templateUrl: './opcoes.html',
  styleUrl: './opcoes.css'
})
export class Opcoes implements OnInit {
  opcoes: ProductOption[] = [];
  loading: boolean = false;
  errors: string[] | null = null;

  private opcoesService = inject(OpcoesService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.carregarOpcoes();
  }

  carregarOpcoes(): void {
    this.loading = true;
    this.errors = null;

    this.opcoesService.list().subscribe({
      next: (opcoes) => {
        this.opcoes = opcoes;
        this.loading = false;
      },
      error: (err: AppError) => {
        this.loading = false;
        this.errors = err.errors;
      }
    });
  }

  confirmarExclusao(event: Event, id: number) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Tem certeza que deseja excluir essa opção?',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
              this.excluirOpcao(id);
            }
        });
    }

  excluirOpcao(id: number): void {
    this.loading = true;
    this.errors = null;

    this.opcoesService.delete(id).subscribe({
      next: () => {
        this.carregarOpcoes();
      },
      error: (err: AppError) => {
        this.loading = false;
        this.errors = err.errors;
      }
    });
  }
}