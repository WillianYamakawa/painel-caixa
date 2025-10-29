import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { Tree as TreeModel, TreeService, TreeType } from '../../../../core/services/tree-service';
import { AppError } from '../../../../core/models/app-error';
import { ProductBasic, ProductService } from '../../../../core/services/product-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-produtos',
    imports: [
        Button,
        Card,
        TableModule,
        CommonModule,
        DrawerModule,
        InputTextModule
    ],
    templateUrl: './produtos.html',
    styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
    loading: boolean = false;
    categories!: TreeModel[];
    products!: ProductBasic[];

    activeCategory: TreeModel | null = null;

    treeService = inject(TreeService);
    productService = inject(ProductService);
    router = inject(Router);
    confirmationService = inject(ConfirmationService);
    messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();
    }

    loadCategories(){
        this.loading = true;

        this.treeService.list(TreeType.ProductCategory).subscribe({
            next: (categories) => {
                this.categories = categories;
                this.loading = false;
            },
            error: (err: AppError) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Erro ao carregar categorias', detail: err.error, life: 2000 })
            },
        })
    }

    loadProducts(){
        this.loading = true;

        this.productService.list().subscribe({
            next: (products) => {
                this.products = products;
                this.loading = false;
            },
            error: (err: AppError) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Erro ao carregar produtos', detail: err.error, life: 2000 })
            },
        })
    }

    confirmarExclusao(event: Event, id: number) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Tem certeza que deseja excluir esse produto?',
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
                this.excluirProduto(id);
            },
        });
    }

    excluirProduto(id: number): void {
        this.loading = true;

        this.productService.disable(id).subscribe({
            next: () => {
                this.loadCategories();
                this.loadProducts();
            },
            error: (err: AppError) => {
                this.messageService.add({ severity: 'error', summary: 'Erro ao excluir produto', detail: err.error, life: 2000 })
                this.loading = false;
            },
        });
    }

    getCategoryPath(id: number): string{
        if(this.categories != null){
            for(let i = 0; i < this.categories.length; i++){
            var node = this.categories[i];

            var category = this._getCategoryPath(node, id);

            if(category != null){
                return category.reverse().join(' > ')
            }
        }
        }

        return '-';
    }

    _getCategoryPath(node: TreeModel ,id: number): string[] | null{
        if(node.id == id){
            return [node.label]
        }

        if(node.children != null){
            for(let i = 0; i < node.children.length; i++){
            const children = node.children[i];

            var category = this._getCategoryPath(children, id);

            if(category != null){
                category.push(node.label);
                return category;
            }
        }
        }

        return null;
    }
}
