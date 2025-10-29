import { Routes } from '@angular/router';
import { Cadastros } from './layout/cadastros';
import { ConfirmationService } from 'primeng/api';

export const CADASTROS_ROUTES: Routes = [
    {
        path: '',
        component: Cadastros,
        children: [
            {
                path: 'produtos',
                loadComponent: () => import('./produtos/listagem/produtos').then((m) => m.Produtos),
                providers: [ConfirmationService],
            },
            {
                path: 'produtos/:id',
                loadComponent: () =>
                    import('./produtos/produto/produto').then((m) => m.Produto),
            },
            {
                path: 'produtos/new',
                loadComponent: () =>
                    import('./produtos/produto/produto').then((m) => m.Produto),
            },
            {
                path: 'opcoes',
                loadComponent: () => import('./opcoes/listagem/opcoes').then((m) => m.Opcoes),
                providers: [ConfirmationService],
            },
            {
                path: 'configuracoes',
                loadComponent: () => import('./configuracoes/configuracoes').then((m) => m.Configuracoes),
            },
        ],
    },
];
