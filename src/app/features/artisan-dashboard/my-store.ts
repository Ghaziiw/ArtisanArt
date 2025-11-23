import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { MyStoreService, OrdersResponse } from '../../core/services/store.service';
import { CraftsmanService, Craftsman } from '../../core/services/craftsman.service';
import {
  ProductService,
  Product,
  CreateProductDto,
  UpdateProductDto,
} from '../../core/services/product.service';
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
  craftsmanId: string = '';
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
        this.showAlert('Error loading orders', 'error');
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

  handleSubmitProduct(event: Event): void {
    event.preventDefault();

    if (!this.validateProductForm()) {
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }

    // Verify that at least one image is present
    if (this.productImages.length === 0) {
      this.showAlert('Please add at least one image', 'error');
      return;
    }

    this.isLoading = true;

    if (this.editingProduct) {
      const updateData: UpdateProductDto = {
        name: this.productForm.name,
        description: this.productForm.description,
        price: this.productForm.price,
        stock: this.productForm.stock,
      };

      if (this.productForm.category) {
        updateData.categoryId = this.productForm.category;
      }

      this.productService.updateProduct(this.editingProduct.id, updateData).subscribe({
        next: (updatedProduct) => {
          // Update local product list
          const index = this.products.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }

          this.showAlert('Product updated successfully!', 'success');
          this.handleCancelEdit();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.showAlert('Unable to update product', 'error');
          this.isLoading = false;
        },
      });
    } else {
      // Creation mode
      const createData: CreateProductDto = {
        name: this.productForm.name,
        description: this.productForm.description,
        price: this.productForm.price,
        stock: this.productForm.stock,
        images: this.productImages,
      };

      if (this.productForm.category) {
        createData.categoryId = this.productForm.category;
      }

      this.productService.addProduct(createData).subscribe({
        next: (newProduct) => {
          // Add to local product list
          this.products.unshift(newProduct);
          this.stats.totalProducts = this.products.length;

          this.showAlert('Product added successfully!', 'success');
          this.handleCancelEdit();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.showAlert('Unable to create product', 'error');
          this.isLoading = false;
        },
      });
    }
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
      PENDING: { text: 'Pending', class: 'status-pending' },
      CONFIRMED: { text: 'Confirmed', class: 'status-confirmed' },
      SHIPPED: { text: 'Shipped', class: 'status-shipped' },
      DELIVERED: { text: 'Delivered', class: 'status-delivered' },
      CANCELLED: { text: 'Cancelled', class: 'status-cancelled' },
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

  updateOrderStatus(orderId: string, newStatus: OrderStatusRequest) {
    if (!orderId) return;

    this.isLoading = true;

    this.myStoreService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        // Update local order status
        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus;
        }

        // Update statistics
        this.updateStats();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.isLoading = false;
      },
    });
  }

  // ================== Image ==================
  productImages: File[] = [];
  productImageUrls: string[] = []; // Store blob URLs
  fileError: string = '';
  private errorTimeout?: any;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    this.clearError();

    // Verify maximum number of images (5)
    if (this.productImages.length + files.length > 5) {
      this.showError('You can upload a maximum of 5 images');
      return;
    }

    files.forEach((file) => {
      // Verify size (1MB max)
      if (file.size > 1024 * 1024) {
        this.showError('Each image must be less than 1 MB');
        return;
      }

      // Verify type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.showError('Only PNG and JPG formats are accepted');
        return;
      }

      // Add the file to the array
      this.productImages.push(file);
      // Create and store the blob URL
      this.productImageUrls.push(URL.createObjectURL(file));
    });

    // Reset the input to allow re-selecting the same file
    input.value = '';
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation(); // Prevent triggering the parent's click

    // Revoke the blob URL to free memory
    if (this.productImageUrls[index]) {
      URL.revokeObjectURL(this.productImageUrls[index]);
    }

    this.productImages.splice(index, 1);
    this.productImageUrls.splice(index, 1);
    this.clearError();
  }

  handleCancelEdit(): void {
    this.showAddProduct = false;
    this.editingProduct = null;

    // Revoke all blob URLs
    this.productImageUrls.forEach((url) => URL.revokeObjectURL(url));

    this.productImages = [];
    this.productImageUrls = [];
    this.resetProductForm();
    this.clearError();
  }

  private showError(message: string): void {
    this.clearError();
    this.fileError = message;
    this.errorTimeout = setTimeout(() => {
      this.fileError = '';
    }, 5000);
  }

  private clearError(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = undefined;
    }
    this.fileError = '';
  }

  ngOnDestroy(): void {
    this.clearError();
    // Clean up all blob URLs when the component is destroyed
    this.productImageUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }
}
