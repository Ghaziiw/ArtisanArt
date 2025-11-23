import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  image: string;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  deliveryPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

@Component({
  selector: 'app-my-store',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './my-store.html',
  styleUrls: ['./my-store.css'],
})
export class MyStore implements OnInit {
  activeTab: 'products' | 'orders' = 'products';
  showAddProduct = false;
  editingProduct: Product | null = null;

  // Product form
  productForm = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    category: '',
    image: '',
  };

  // Mock data - Products
  products: Product[] = [
    {
      id: '1',
      name: 'Vase en Céramique Artisanal',
      description:
        'Magnifique vase fait main en céramique traditionnelle tunisienne avec motifs berbères',
      price: 45.99,
      originalPrice: 59.99,
      stock: 12,
      category: 'Pottery',
      image: 'http://localhost:3000/uploads/products/image1-1763571717048-363481342.jpg',
    },
    {
      id: '2',
      name: 'Plat Décoratif',
      description: 'Plat décoratif en céramique avec des motifs traditionnels',
      price: 35.0,
      stock: 8,
      category: 'Pottery',
      image: 'http://localhost:3000/uploads/products/image1-1763571717048-363481342.jpg',
    },
    {
      id: '3',
      name: 'Théière Artisanale',
      description: 'Théière en céramique peinte à la main, capacité 1L',
      price: 52.5,
      originalPrice: 65.0,
      stock: 5,
      category: 'Pottery',
      image: 'http://localhost:3000/uploads/products/image1-1763571717048-363481342.jpg',
    },
  ];

  // Mock data - Orders
  orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: {
        name: 'Ahmed Ben Ali',
        email: 'ahmed@example.com',
      },
      items: [
        { productName: 'Vase en Céramique Artisanal', quantity: 2, price: 45.99 },
        { productName: 'Plat Décoratif', quantity: 1, price: 35.0 },
      ],
      total: 132.48,
      deliveryPrice: 5.5,
      status: 'pending',
      date: '2024-11-23T10:30:00',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: {
        name: 'Fatima Mansour',
        email: 'fatima@example.com',
      },
      items: [{ productName: 'Théière Artisanale', quantity: 1, price: 52.5 }],
      total: 58.0,
      deliveryPrice: 5.5,
      status: 'confirmed',
      date: '2024-11-22T14:20:00',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: {
        name: 'Karim Trabelsi',
        email: 'karim@example.com',
      },
      items: [{ productName: 'Vase en Céramique Artisanal', quantity: 1, price: 45.99 }],
      total: 51.49,
      deliveryPrice: 5.5,
      status: 'shipped',
      date: '2024-11-21T09:15:00',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  // Statistics
  get stats() {
    const totalRevenue = this.orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = this.orders.filter((o) => o.status === 'pending').length;

    return {
      totalRevenue,
      totalOrders: this.orders.length,
      pendingOrders,
      totalProducts: this.products.length,
    };
  }

  // Tab management
  setActiveTab(tab: 'products' | 'orders') {
    this.activeTab = tab;
  }

  // Product management
  handleAddProduct() {
    this.showAddProduct = true;
    this.editingProduct = null;
    this.resetProductForm();
  }

  handleEditProduct(product: Product) {
    this.editingProduct = product;
    this.showAddProduct = true;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      stock: product.stock,
      category: product.category,
      image: product.image,
    };
  }

  handleSubmitProduct(event: Event) {
    event.preventDefault();

    if (this.editingProduct) {
      // Update existing product
      const index = this.products.findIndex((p) => p.id === this.editingProduct!.id);
      if (index !== -1) {
        this.products[index] = {
          ...this.editingProduct,
          ...this.productForm,
        };
      }
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...this.productForm,
      };
      this.products.unshift(newProduct);
    }

    this.handleCancelEdit();
  }

  handleCancelEdit() {
    this.showAddProduct = false;
    this.editingProduct = null;
    this.resetProductForm();
  }

  handleDeleteProduct(productId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.products = this.products.filter((p) => p.id !== productId);
    }
  }

  resetProductForm() {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      category: '',
      image: '',
    };
  }

  // Order management
  updateOrderStatus(orderId: string, newStatus: Order['status']) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
    }
  }

  getOrderStatusBadge(status: Order['status']): { text: string; class: string } {
    const statusMap = {
      pending: { text: 'En attente', class: 'status-pending' },
      confirmed: { text: 'Confirmée', class: 'status-confirmed' },
      shipped: { text: 'Expédiée', class: 'status-shipped' },
      delivered: { text: 'Livrée', class: 'status-delivered' },
      cancelled: { text: 'Annulée', class: 'status-cancelled' },
    };
    return statusMap[status];
  }

  // Navigation
  goBack() {
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
