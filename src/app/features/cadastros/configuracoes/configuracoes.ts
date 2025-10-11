import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { AppStorageService } from '../../../core/services/app-storage';

@Component({
  selector: 'app-configuracoes',
  imports: [Card, Button, InputTextModule, FormsModule, IftaLabelModule],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css'
})
export class Configuracoes implements OnInit {
  apiUrl: string = '';

  storage = inject(AppStorageService)

  salvarApi(){
    this.apiUrl = this.apiUrl.replace(/\/+$/, "");;
    this.storage.ApiUrl = this.apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl = this.storage.ApiUrl ?? '';
  }
}
