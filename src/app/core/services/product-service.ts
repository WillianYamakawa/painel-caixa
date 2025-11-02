import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStorageService } from './app-storage';

export enum UnitType{

}

export interface ProductBasic {
    id: number | null;
    label: string;
    unit: number;
    description: string | null;
    code: string | null;
    treeId: number;
    price: number;
    chargeServiceFee: boolean;
}

export interface ProductOptionBind{
    productOptionId: number;
}

export interface Product extends ProductBasic{
    optionsBind: ProductOptionBind[]
}

export interface ProductUpdate extends Product{
    hasUpdatedOptions: boolean;
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

    get(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    disable(id: number): Observable<string> {
        return this.http.patch<string>(`${this.apiUrl}/disable?productId=${id}`, null);
    }

    create(model: Product): Observable<number>{
        return this.http.post<number>(`${this.apiUrl}/create`, model);
    }

    update(model: ProductUpdate): Observable<number>{
        return this.http.post<number>(`${this.apiUrl}/update`, model);
    }
}
