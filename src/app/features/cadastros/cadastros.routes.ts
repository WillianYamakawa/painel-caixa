import { Routes } from '@angular/router';
import { Cadastros } from './cadastros';
import { ConfirmationService } from 'primeng/api';

export const CADASTROS_ROUTES: Routes = [
    {
        path: '',
        component: Cadastros,
        children: [
            {
                path: 'opcoes',
                loadComponent: () => import('./opcoes/opcoes').then((m) => m.Opcoes),
                providers: [ConfirmationService],
            },
            {
                path: 'configuracoes',
                loadComponent: () => import('./configuracoes/configuracoes').then((m) => m.Configuracoes),
            },
        ],
    },
];
