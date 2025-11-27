import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { CommonModule } from '@angular/common';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-admin-ctrl-page',
  imports: [Header, CommonModule, Footer],
  templateUrl: './admin-ctrl-page.html',
  styleUrl: './admin-ctrl-page.css',
})
export class AdminCtrlPage {
  currentTab: 'all' | 'clients' | 'artisans'='all';

}

