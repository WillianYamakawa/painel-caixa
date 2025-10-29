import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStorageService } from './app-storage';

export enum UnitType{

}

export interface ProductBasic {
    id: number | null;
    label: string;
    description: string | null;
    code: string | null;
    treeId: number;
    chargeServiceFee: boolean;
}

export interface ProductOptionBind{
    productOptionId: number;
    isRequired: boolean;
}

export interface Product extends ProductBasic{

}

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    apiUrl: string;

    constructor(private http: HttpClient, private appStorage: AppStorageService) {
        this.apiUrl = `${appStorage.ApiUrl}/product`;
    }

    list(): Observable<ProductBasic[]> {
        return this.http.get<ProductBasic[]>(`${this.apiUrl}/list`);
    }

    get(): Observable<ProductBasic[]> {
        return this.http.get<ProductBasic[]>(`${this.apiUrl}/list`);
    }

    disable(id: number): Observable<string> {
        return this.http.patch<string>(`${this.apiUrl}/disable?productId=${id}`, null);
    }
}
