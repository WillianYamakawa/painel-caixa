import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
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
import { Observable } from 'rxjs';

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
export class TreeSelector implements OnInit{
    Number = Number;
    categories: TreeModel[] = [];
    nodes = signal<TreeNode[]>([]);
    loading = signal(false);
    open = signal(false);

    editingText = signal('');
    editingId: number | null = null;
    editingParentId: number | null = null;

    treeType = input.required<TreeType>();
    selected = input<number | null>();
    onSelect = output<number>();

    selectedStr = computed(() => this.getCategoryPath(this.selected()!));

    messageService = inject(MessageService);
    treeService = inject(TreeService);
    confirmationService = inject(ConfirmationService);


    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories() {
        this.loading.set(true);

        this.treeService.list(TreeType.ProductCategory).subscribe({
            next: (categories) => {
                this.categories = categories;
                var nodeModel = categories.map((e) => this.categoryToNode(e, undefined));
                nodeModel.push({
                    type: 'new',
                });

                this.nodes.set(nodeModel);
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
        if (this.nodes().length > 0 && this.categories != null) {
            for (let i = 0; i < this.categories.length; i++) {
                var node = this.categories[i];

                var category = this._getCategoryPath(node, id);

                if (category != null) {
                    return category.reverse().join(' > ');
                }
            }
        }

        return '-';
    }

    _getCategoryPath(node: TreeModel, id: number): string[] | null {
        if (node.id == id) {
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

        let result: Observable<number>;

        if(this.editingId){
            result = this.treeService.update({ id: this.editingId, label: this.editingText() });
        }else{
            result = this.treeService.create({ label: this.editingText(), parentId: this.editingParentId, type: TreeType.ProductCategory });
        }

        result.subscribe({
            next: (_) => {
                this.messageService.add({ severity: 'success', summary: 'Registro salvo com sucesso', detail: 'Categoria salva com sucesso', life: 1000 });
                this.loadCategories();
            },
            error: (error: AppError) => {
                this.messageService.add({ severity: 'error', summary: 'Erro ao salvar categoria', detail: error.error, life: 2000 })
                this.loading.set(false);
            }
        });
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
