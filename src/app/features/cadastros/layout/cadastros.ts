import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-cadastro',
  imports: [RouterModule, Menu, Divider],
  templateUrl: './cadastros.html',
  styleUrl: './cadastros.css'
})
export class Cadastros {
  items: MenuItem[] = [
    {
      label: 'Produtos',
      icon: 'pi pi-fw pi-box',
      routerLink: ['produtos']
    },
    {
      label: 'Opções',
      icon: 'pi pi-fw pi-tag',
      routerLink: ['opcoes']
    },
    {
      label: 'Configuracao',
      icon: 'pi pi-fw pi-cog',
      routerLink: ['configuracoes']
    }
  ];
}