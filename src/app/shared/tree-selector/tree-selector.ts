import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { TreeType, Tree as TreeModel, TreeService } from '../../core/services/tree-service';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AppError } from '../../core/models/app-error';
import { Tree, TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-tree-selector',
    imports: [
        TreeModule,
        ButtonModule,
        PopoverModule,
        InputTextModule,
        CommonModule,
        FormsModule,
        DialogModule,
    ],
    templateUrl: './tree-selector.html',
    styleUrl: './tree-selector.css',
})
export class TreeSelector{
    Number = Number;
    categories: TreeModel[] = [];
    nodes: TreeNode[] = [];
    loading = signal(false);
    open = signal(false);

    editingText = signal('');
    editingId: number | null = null;
    editingParentId: number | null = null;

    treeType = input.required<TreeType>();
    selected = input<number | null>();
    onSelect = output<number>();

    selectedStr: string | null = null;

    messageService = inject(MessageService);
    treeService = inject(TreeService);
    confirmationService = inject(ConfirmationService);

    constructor() {
        effect(() => {
            if (this.selected() != null && this.nodes != null)
                this.selectedStr = this.getCategoryPath(this.selected()!);
        });
    }

    loadCategories() {
        this.loading.set(true);

        this.treeService.list(TreeType.ProductCategory).subscribe({
            next: (categories) => {
                this.categories = categories;
                this.nodes = categories.map((e) => this.categoryToNode(e, undefined));
                this.nodes.push({
                    type: 'new',
                });

                if (this.selected() != null)
                    this.selectedStr = this.getCategoryPath(this.selected()!);

                this.loading.set(false);
            },
            error: (err: AppError) => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao carregar informações',
                    detail: err.error,
                    life: 2000,
                });
            },
        });
    }

    categoryToNode(model: TreeModel, parent: TreeNode | undefined): TreeNode {
        var node: TreeNode = {
            key: model.id.toString(),
            label: model.label,
            type: 'default',
            data: model.id,
            parent: parent
        };

        var children = model.children?.map((e) => this.categoryToNode(e, node)) ?? [];
        children.push({
            type: 'new',
            parent: node
        });

        node.children = children;


        return node;
    }

    getCategoryPath(id: number): string {
        if (this.nodes != null) {
            for (let i = 0; i < this.nodes.length; i++) {
                var node = this.nodes[i];

                var category = this._getCategoryPath(node, id);

                if (category != null) {
                    return category.reverse().join(' > ');
                }
            }
        }

        return '-';
    }

    _getCategoryPath(node: TreeNode, id: number): string[] | null {
        if (node.data == id) {
            return [node.label!];
        }

        if (node.children != null) {
            for (let i = 0; i < node.children.length; i++) {
                const children = node.children[i];

                var category = this._getCategoryPath(children, id);

                if (category != null) {
                    category.push(node.label!);
                    return category;
                }
            }
        }

        return null;
    }

    onSave(){
        this.loading.set(true);

        if(this.editingId){
            this.treeService.update({ id: this.editingId, label: this.editingText() }).subscribe({
                next: (_) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro salvo com sucesso', detail: 'Categoria salva com sucesso', life: 1000 });
                    this.loadCategories();
                },
                error: (error: AppError) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro ao editar categoria', detail: error.error, life: 2000 })
                    this.loading.set(false);
                }
            })
        }else{
            this.treeService.create({ label: this.editingText(), parentId: this.editingParentId, type: TreeType.ProductCategory }).subscribe({
                next: (_) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro salvo com sucesso', detail: 'Categoria salva com sucesso', life: 1000 });
                    this.loadCategories();
                },
                error: (error: AppError) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro ao adicionar categoria', detail: error.error, life: 2000 })
                    this.loading.set(false);
                }
            })
        }
    }

    confirmDelete(event: Event, id: number){
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
                this.onDelete(id);
            },
        });
    }

    onDelete(id: number){
        this.loading.set(true);

        this.treeService.delete(id).subscribe({
                next: (_) => {
                    this.messageService.add({ severity: 'success', summary: 'Registro excluido com sucesso', detail: 'Categoria excluida com sucesso', life: 1000 });
                    this.loadCategories();
                },
                error: (error: AppError) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro ao excluir categoria', detail: error.error, life: 2000 })
                    this.loading.set(false);
                }
            })
    }
}
