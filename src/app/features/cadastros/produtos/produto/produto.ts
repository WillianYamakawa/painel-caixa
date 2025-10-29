import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DrawerModule } from 'primeng/drawer';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { AppError } from '../../../../core/models/app-error';
import { MessageService, TreeNode } from 'primeng/api';
import { PopoverModule } from 'primeng/popover';
import { TreeSelector } from '../../../../shared/tree-selector/tree-selector';
import { TreeType } from '../../../../core/services/tree-service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-produto',
  imports: [
        Button,
        Card,
        TableModule,
        CommonModule,
        DrawerModule,
        InputTextModule,
        FormsModule,
        ToggleButtonModule,
        SelectButtonModule,
        ToggleSwitchModule,
        InputNumberModule,
        InputGroupModule,
        InputGroupAddonModule,
        TabsModule,
        TextareaModule,
        SelectModule,
        TreeSelector,
        MultiSelectModule
    ],
  templateUrl: './produto.html',
  styleUrl: './produto.css'
})
export class Produto implements OnInit{
    TreeType = TreeType;

    loading: boolean = false;
    idProduto: number | null = null;

    selectedCategoryId = signal<number | null>(null);

    unitTypeModel = [
        { name: "Un", code: 1 },
        { name: "Kg", code: 2 },
    ]

    router = inject(Router);
    route = inject(ActivatedRoute);
    messageService = inject(MessageService);

    ngOnInit(): void {
        this.idProduto = Number(this.route.snapshot.paramMap.get('id'));
        if(Number.isNaN(this.idProduto)) this.idProduto = null;
    }
}
