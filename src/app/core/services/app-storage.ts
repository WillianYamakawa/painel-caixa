// app-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      
      if (item === null) {
        return null;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  }

  has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Erro ao verificar localStorage:', error);
      return false;
    }
  }

  keys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Erro ao listar chaves do localStorage:', error);
      return [];
    }
  }

  length(): number {
    try {
      return localStorage.length;
    } catch (error) {
      console.error('Erro ao obter tamanho do localStorage:', error);
      return 0;
    }
  }

  getOrDefault<T>(key: string, defaultValue: T): T {
    const value = this.get<T>(key);
    
    if (value === null) {
      this.set(key, defaultValue);
      return defaultValue;
    }
    
    return value;
  }

  set ApiUrl(value: string) {
    this.set('apiUrl', value);
  }

    get ApiUrl(): string | null {
    return this.get<string>('apiUrl');
  }
}