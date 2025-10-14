import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProductOption, ProductOptionItem } from '../../../../core/services/opcoes-service';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

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

    hasItemLimit: boolean = false;

    @Input() opcao: ProductOption | null = null;

    @Output() onClose = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<ProductOption>();

    model!: ProductOption;
    modelItem!: ProductOptionItem;

    ngOnInit(): void {
        this.model = this.opcao
            ? {
                  ...this.opcao,
                  items: this.opcao.items ? [...this.opcao.items] : [],
              }
            : { id: 0, label: '', items: [] };
    }

    close() {
        this.onClose.emit();
    }

    save() {
        this.onSave.emit(this.model);
    }

    removeItem(index: number) {
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
                isMultiple: false,
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
        let model: ProductOptionItem = {
            id: 0,
            label: this.modelItem.label,
            price: this.modelItem.price ?? 0,
            autoSelectedCount: this.modelItem.autoSelectedCount,
            isDiscount: this.modelItem.isDiscount,
            isMultiple: this.modelItem.isMultiple,
            maxSelectedCount: this.hasItemLimit ? this.modelItem.maxSelectedCount : null,
        };

        if (this.editingItemIndex == null) {
            // Sempre cria novo array
            this.model.items = [...this.model.items, model];
        } else {
            // Cria novo array com item substituído
            this.model.items = this.model.items.map((item, index) =>
                index === this.editingItemIndex ? model : item
            );
        }

        this.editingItem = false;
        this.editingItemIndex = null;
    }

    onAutoSelectedInput() {
        if (
            this.hasItemLimit &&
            this.modelItem.autoSelectedCount > this.modelItem.maxSelectedCount!
        ) {
            this.modelItem.autoSelectedCount = this.modelItem.maxSelectedCount!;
        }
    }
}
