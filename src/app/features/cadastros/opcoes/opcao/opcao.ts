import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OpcoesService, ProductOption, ProductOptionItem, ProductOptionUpdate } from '../../../../core/services/opcoes-service';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { AppError } from '../../../../core/models/app-error';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-opcao',
    imports: [
        Button,
        Card,
        TableModule,
        CommonModule,
        ConfirmPopupModule,
        DrawerModule,
        InputTextModule,
        FormsModule,
        ToggleButtonModule,
        SelectButtonModule,
        ToggleSwitchModule,
        InputNumberModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
    templateUrl: './opcao.html',
    styleUrl: './opcao.css',
})
export class Opcao implements OnInit {
    Math = window.Math;

    loading: boolean = false;
    hasUpdatedItems: boolean = false;

    multipleOptions: any[] = [
        { label: 'Único', value: false },
        { label: 'Múltiplo', value: true },
    ];

    autoSelectedOptions: any[] = [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
    ];

    descontoOptions: any[] = [
        { label: 'Acrécimo', value: false },
        { label: 'Desconto', value: true },
    ];

    editingItem: boolean = false;
    editingItemIndex: number | null = null;

    private opcoesService = inject(OpcoesService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    @Input() opcao: ProductOption | null = null;

    @Output() onClose = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<void>();

    model!: ProductOption;
    modelItem!: ProductOptionItem;

    ngOnInit(): void {
        this.model = this.opcao
            ? {
                  ...this.opcao,
                  items: this.opcao.items ? [...this.opcao.items] : [],
              }
            : { id: null, isMultiple: false, label: '', items: [], maxSelectedCount: null, minSelectedCount: null };
    }

    close() {
        this.onClose.emit();
    }

    save() {
        this.loading = true;

        var modelSave: ProductOptionUpdate = {
            ...this.model,
            hasUpdatedItems: this.hasUpdatedItems
        };

        this.opcoesService.save(modelSave).subscribe({
            next: (_) => {
                this.messageService.add({ severity: 'success', summary: 'Registro salvo com sucesso', detail: 'Opção salva com sucesso', life: 1000 })
                this.onSave.emit();
            },
            error: (err: AppError) => {
                this.messageService.add({ severity: 'error', summary: 'Erro ao salvar', detail: err.error, life: 2000 })
                this.loading = false;
            },
        });

    }

    confirmarExclusao(event: Event, id: number) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Tem certeza que deseja excluir esse item?',
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
                this.removeItem(id);
            },
        });
    }

    removeItem(index: number) {
        this.hasUpdatedItems = true;
        this.model.items.splice(index, 1);
    }

    openEditItem(index: number | null) {
        if (index == null) {
            this.modelItem = {
                id: 0,
                label: '',
                price: 0,
                autoSelectedCount: 0,
                isDiscount: false,
                maxSelectedCount: 0,
            };
        } else {
            this.modelItem = { ...this.model.items[index] };
            this.modelItem.maxSelectedCount = this.modelItem.maxSelectedCount ?? 0;
        }

        this.editingItem = true;
        this.editingItemIndex = index;
    }

    closeEditItem() {
        this.editingItem = false;
        this.editingItemIndex = null;
        this.modelItem = null!;
    }

    editItem() {
        this.hasUpdatedItems = true;

        let model: ProductOptionItem = {
            id: 0,
            label: this.modelItem.label,
            price: this.modelItem.price ?? 0,
            autoSelectedCount: this.modelItem.autoSelectedCount ?? 0,
            isDiscount: this.modelItem.isDiscount,
            maxSelectedCount: this.modelItem.maxSelectedCount,
        };

        if (this.editingItemIndex == null) {
            this.model.items = [...this.model.items, model];
        } else {
            this.model.items = this.model.items.map((item, index) =>
                index === this.editingItemIndex ? model : item
            );
        }

        this.editingItem = false;
        this.editingItemIndex = null;
    }
}
