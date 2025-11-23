import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { MyStoreService, OrdersResponse } from '../../core/services/store.service';
import { CraftsmanService, Craftsman } from '../../core/services/craftsman.service';
import { ProductService, Product } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderStatusRequest } from '../../core/services/store.service';
import { Category, CategoryService } from '../../core/services/category.service';

interface DisplayOrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface DisplayOrder {
  id: string;
  userId: string;
  status: OrderStatusRequest;
  createdAt: string;
  cin: string;
  location: string;
  state: string;
  phone: string;
  deliveryPrice: number;
  user: {
    email: string;
    name: string;
  };
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  items: DisplayOrderItem[];
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
}

@Component({
  selector: 'app-my-store',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './my-store.html',
  styleUrls: ['./my-store.css'],
})
export class MyStore implements OnInit {
  public OrderStatusRequest = OrderStatusRequest;

  // UI State
  activeTab: 'products' | 'orders' = 'products';
  showAddProduct = false;
  editingProduct: Product | null = null;
  isLoading = false;

  // Craftsman data
  craftsmanId: string = 'yroUPsWElwUoGx7KvzXePkLhAJhSegBE';
  craftsman: Craftsman | null = null;

  // Data
  products: Product[] = [];
  orders: DisplayOrder[] = [];

  stats: Stats = {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
  };

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

  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private myStoreService: MyStoreService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    // Get current user's ID
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.craftsmanId = user.id;
        this.loadCraftsmanProducts();
        this.loadCraftsmanOrders();
        this.loadCategories();
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.items;
      },
      error: (err) => console.error('Failed to load categories:', err),
    });
  }

  loadCraftsmanProducts() {
    this.isLoading = true;

    this.productService.getProducts(1, 100, { craftsmanId: this.craftsmanId }).subscribe({
      next: (response) => {
        this.products = response.items;
        this.stats.totalProducts = response.items.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading = false;
      },
    });
  }

  loadCraftsmanOrders() {
    this.isLoading = true;
    this.myStoreService.getCraftsmanOrders(1, 100).subscribe({
      next: (response: OrdersResponse) => {
        console.log('Orders loaded:', response.items);
        this.orders = response.items.map((order) => this.transformOrder(order));
        this.updateStats();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load orders:', err);
        this.showAlert('Erreur lors du chargement des commandes', 'error');
        this.isLoading = false;
      },
    });
  }

  // ==================== ORDER TRANSFORMATION ====================

  transformOrder(order: any): DisplayOrder {
    // Calculate total amount
    const itemsTotal = order.items.reduce((sum: number, item: any) => {
      return sum + parseFloat(item.priceAtOrder) * item.quantity;
    }, 0);

    const totalAmount = itemsTotal + parseFloat(order.deliveryPrice);

    // Generate order number from ID (last 8 characters)
    const orderNumber = order.id.toUpperCase();

    // Transform items
    const items: DisplayOrderItem[] = order.items.map((item: any) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: parseFloat(item.priceAtOrder),
    }));

    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      createdAt: order.createdAt,
      cin: order.cin,
      location: order.location,
      state: order.state,
      phone: order.phone,
      deliveryPrice: parseFloat(order.deliveryPrice),
      user: order.user,
      orderNumber,
      totalAmount,
      shippingAddress: order.location,
      items,
    };
  }

  // ==================== STATS CALCULATION ====================

  updateStats(): void {
    this.stats.totalProducts = this.products.length;
    this.stats.totalOrders = this.orders.length;
    this.stats.pendingOrders = this.orders.filter((o) => o.status === 'PENDING').length;
    this.stats.totalRevenue = this.orders
      .filter((o) => o.status === OrderStatusRequest.DELIVERED)
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  // ==================== TAB MANAGEMENT ====================

  setActiveTab(tab: 'products' | 'orders'): void {
    this.activeTab = tab;
  }

  // ==================== PRODUCT MANAGEMENT ====================

  handleAddProduct(): void {
    this.showAddProduct = true;
    this.editingProduct = null;
    this.resetProductForm();
  }

  handleEditProduct(product: Product): void {
    this.editingProduct = product;
    this.showAddProduct = true;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: 0,
      stock: product.stock,
      category: product.category?.name || '',
      image: product.images?.[0] || '',
    };
  }

  handleCancelEdit(): void {
    this.showAddProduct = false;
    this.editingProduct = null;
    this.resetProductForm();
  }

  handleSubmitProduct(event: Event): void {
    event.preventDefault();

    if (!this.validateProductForm()) {
      this.showAlert('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    // For now, just show a message - API endpoints may not be available
    this.showAlert('Fonctionnalité de modification à venir', 'error');
    this.handleCancelEdit();
  }

  validateProductForm(): boolean {
    return !!(
      this.productForm.name &&
      this.productForm.description &&
      this.productForm.price > 0 &&
      this.productForm.stock >= 0
    );
  }

  handleDeleteProduct(productId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Supprimer du tableau local pour mise à jour de l'affichage
          this.products = this.products.filter((p) => p.id !== productId);
          alert('Produit supprimé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit :', err);
          alert('Impossible de supprimer le produit.');
        },
      });
    }
  }

  resetProductForm(): void {
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

  // ==================== ORDER MANAGEMENT ====================

  getOrderStatusBadge(status: string): { text: string; class: string } {
    const statusMap: Record<string, { text: string; class: string }> = {
      PENDING: { text: 'En attente', class: 'status-pending' },
      CONFIRMED: { text: 'Confirmée', class: 'status-confirmed' },
      SHIPPED: { text: 'Expédiée', class: 'status-shipped' },
      DELIVERED: { text: 'Livrée', class: 'status-delivered' },
      CANCELLED: { text: 'Annulée', class: 'status-cancelled' },
    };
    return statusMap[status] || { text: status, class: '' };
  }

  // ==================== UTILITY ====================

  showAlert(message: string, type: 'success' | 'error'): void {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  updateOrderStatus(
    orderId: string,
    newStatus: OrderStatusRequest
  ) {
    if (!orderId) return;

    this.isLoading = true;

    this.myStoreService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        // Mettre à jour le statut local de la commande
        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus;
        }

        // Mettre à jour les statistiques
        this.updateStats();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut :', err);
        this.isLoading = false;
      },
    });
  }
}
