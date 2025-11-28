import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { Footer } from "../../shared/components/footer/footer";
import { OrderCard } from "./order-card/order-card";

@Component({
  selector: 'app-orders-page',
  imports: [Header, Footer, OrderCard],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage {

}
