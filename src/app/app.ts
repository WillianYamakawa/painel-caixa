import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ConfirmPopupModule, Toast],
    providers: [ConfirmationService, MessageService],
    templateUrl: './app.html',
    styleUrls: ['./app.css']
})
export class App {

}