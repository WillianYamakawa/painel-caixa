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
        FormsModule
    ],
    templateUrl: './opcao.html',
    styleUrl: './opcao.css',
})
export class Opcao implements OnInit {
    editingItem: boolean = false;
    editingItemIndex: number | null = null;

    @Input() opcao: ProductOption | null = null;

    @Output() onClose = new EventEmitter<void>();
    @Output() onSave = new EventEmitter<ProductOption>();

    model!: ProductOption;
    modelItem!: ProductOptionItem;

    ngOnInit(): void {
        this.model = this.opcao ? { ...this.opcao } : { id: 0, label: '', items: [] };
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
        if(index == null){
            this.modelItem = { id: 0, label: '', price: 0, autoSelectedCount: 0, isDiscount: false, isMultiple: false, maxSelectedCount: 0 };
        }else{
            this.modelItem = { ...this.model.items[index] };
        }

        this.editingItem = true;
        this.editingItemIndex = index;
    }

    closeEditItem(){
        this.editingItem = false;
        this.editingItemIndex = null;
        this.modelItem = null!;
    }

    editItem() {
        if(this.editingItemIndex == null){

        }else{

        }

        this.editingItem = false;
        this.editingItemIndex = null;
    }
}
