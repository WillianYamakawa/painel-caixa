import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStorageService } from './app-storage';
import { body } from '@primeuix/themes/aura/card';

export interface ProductOptionItem {
  id: number | null;
  label: string;
  price: number;
  maxSelectedCount: number | null;
  autoSelectedCount: number;
  isMultiple: boolean;
  isDiscount: boolean;
}

export interface ProductOption {
  id: number | null;
  label: string;
  items: ProductOptionItem[];
}

export interface ProductOptionUpdate extends ProductOption{
  hasUpdatedItems: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OpcoesService {
  apiUrl: string;

  constructor(private http: HttpClient, private appStorage: AppStorageService) {
    this.apiUrl = `${appStorage.ApiUrl}/product-option`;
  }

  list(): Observable<ProductOption[]> {
    return this.http.get<ProductOption[]>(`${this.apiUrl}/list`);
  }

  delete(id: number): Observable<void>{
    return this.http.patch<void>(`${this.apiUrl}/disable?productOptionId=${id}`, null);
  }

  save(option: ProductOptionUpdate): Observable<number>{
    return this.http.post<number>(`${this.apiUrl}`, option);
  }
}