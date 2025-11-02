import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DrawerModule } from 'primeng/drawer';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Observable, finalize } from 'rxjs';
import { AppError } from '../../../../core/models/app-error';
import { OptionsService, OptionVO } from '../../../../core/services/options-service';
import {
    ProductOptionBind,
    ProductService,
    ProductUpdate,
} from '../../../../core/services/product-service';
import { TreeType } from '../../../../core/services/tree-service';
import { TreeSelector } from '../../../../shared/tree-selector/tree-selector';

interface UnitType {
    name: string;
    code: number;
}

@Component({
    selector: 'app-produto',
    standalone: true,
    imports: [
        Button,
        Card,
        TableModule,
        CommonModule,
        DrawerModule,
        InputTextModule,
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
        MultiSelectModule,
        CheckboxModule,
        ReactiveFormsModule,
    ],
    templateUrl: './produto.html',
    styleUrl: './produto.css',
})
export class Produto implements OnInit {
    // Enums e constantes
    readonly TreeType = TreeType;
    readonly UNIT_TYPES: UnitType[] = [
        { name: 'Un', code: 1 },
        { name: 'Kg', code: 2 },
    ];

    optionsProductOption = signal<OptionVO<number>[]>([]);
    loading = signal(false);
    loadingProductOptions = signal(false);

    idProduto: number | null = null;
    form!: FormGroup;

    router = inject(Router);
    route = inject(ActivatedRoute);
    messageService = inject(MessageService);
    optionsService = inject(OptionsService);
    productService = inject(ProductService);
    fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initializeProductId();
        this.initializeForm();
        this.loadProductOption();

        if (this.idProduto !== null) {
            this.loadProduct();
        }
    }

    private initializeProductId(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.idProduto = Number.isNaN(id) ? null : id;
    }

    private initializeForm(): void {
        this.form = this.fb.group({
            label: ['', Validators.required],
            treeId: [null, Validators.required],
            code: [''],
            price: [0, Validators.required],
            unit: [1, Validators.required],
            description: [''],
            chargeServiceFee: [true],
            optionsId: [[]],
        });
    }

    private loadProductOption(): void {
        this.loadingProductOptions.set(true);

        this.optionsService
            .getProductOptions()
            .pipe(
                finalize(() => this.loadingProductOptions.set(false))
            )
            .subscribe({
                next: (options) => this.optionsProductOption.set(options),
                error: (err: AppError) => this.showError('Erro ao carregar opções', err.error),
            });
    }

    private loadProduct(): void {
        if (!this.idProduto) return;

        this.loading.set(true);

        this.productService
            .get(this.idProduto)
            .pipe(
                finalize(() => this.loading.set(false))
            )
            .subscribe({
                next: (produto) => this.populateForm(produto),
                error: (error: AppError) => this.showError('Erro ao carregar produto', error.error),
            });
    }

    private populateForm(produto: any): void {
        this.form.patchValue({
            label: produto.label,
            treeId: produto.treeId,
            code: produto.code,
            unit: produto.unit,
            price: produto.price,
            description: produto.description,
            chargeServiceFee: produto.chargeServiceFee,
            optionsId: produto.optionsBind.map((e: ProductOptionBind) => e.productOptionId),
        });
    }

    onTreeSelect(treeId: number | null): void {
        this.form.controls['treeId'].setValue(treeId);
    }

    get treeIdValue(): number | null {
        return this.form?.controls['treeId'].value ?? null;
    }

    onSave(): void {
        if (this.form.invalid) {
            this.showError('Formulário inválido', 'Preencha todos os campos obrigatórios');
            return;
        }

        this.loading.set(true);

        const model = this.buildProductModel();
        const result = this.idProduto !== null
            ? this.productService.update(model)
            : this.productService.create(model);

        result
            .pipe(
                finalize(() => this.loading.set(false))
            )
            .subscribe({
                next: (id) => this.handleSaveSuccess(id),
                error: (error: AppError) => this.showError('Erro ao salvar produto', error.error),
            });
    }

    private buildProductModel(): ProductUpdate {
        const formValue = this.form.value;

        return {
            id: this.idProduto,
            label: formValue.label,
            description: formValue.description,
            code: formValue.code ?? null,
            price: formValue.price,
            unit: formValue.unit,
            treeId: formValue.treeId,
            chargeServiceFee: formValue.chargeServiceFee,
            optionsBind: (formValue.optionsId as number[]).map<ProductOptionBind>((id) => ({
                productOptionId: id,
            })),
            hasUpdatedOptions: this.form.controls['optionsId'].dirty,
        };
    }

    private handleSaveSuccess(id: number): void {
        this.showSuccess('Registro salvo com sucesso', 'Produto salvo com sucesso');
        this.router.navigate(['/cadastros/produtos']);
    }

    private showSuccess(summary: string, detail: string): void {
        this.messageService.add({
            severity: 'success',
            summary,
            detail,
            life: 2000,
        });
    }

    private showError(summary: string, detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary,
            detail,
            life: 3000,
        });
    }

    onCancel(): void {
        this.router.navigate(['/cadastros/produtos']);
    }
}
