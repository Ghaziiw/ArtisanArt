import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { CraftsmanService } from '../../core/services/craftsman.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { CategoryService } from '../../core/services/category.service';
import { filter, switchMap } from 'rxjs';
import { Craftsman, CreateProductDto, Order, OrdersResponse, OrderStatusRequest, Product, UpdateProductDto } from '../../core/models';
import { Category } from '../../core/models';
import { Footer } from "../../shared/components/footer/footer";
import { Location } from '@angular/common';

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
  imports: [CommonModule, FormsModule, Header, Footer],
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
    private categoryService: CategoryService,
    private craftsmanService: CraftsmanService,
    private orderService: OrderService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.pipe(
      filter(user => !!user), // Ensure user is not null
      switchMap(user => {
        this.craftsmanId = user!.id;
        this.loadCraftsmanProducts();
        this.loadCraftsmanOrders();
        this.loadCategories();
        return this.craftsmanService.getMyProfile();
      })
    ).subscribe({
      next: (craftsman) => {
        this.craftsman = craftsman;
      },
      error: (err) => console.error('Failed to load craftsman profile:', err)
    });
  }

  loadCraftsman() {
    this.craftsmanService.getMyProfile().subscribe({
      next: (craftsman) => {
        this.craftsman = craftsman;
      },
      error: (err) => {
        console.error('Failed to load craftsman profile:', err);
      },
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
    this.orderService.getCraftsmanOrders(1, 100).subscribe({
      next: (response: OrdersResponse) => {
        console.log('Orders loaded:', response.items);
        this.orders = response.items.map((order: Order) => this.transformOrder(order));
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

  productFormError: string = '';

  setFormError(message: string): void {
    this.productFormError = message;

    setTimeout(() => {
      this.productFormError = '';
    }, 5000);
  }

  handleAddProduct(): void {
    this.showAddProduct = true;
    this.editingProduct = null;
    this.resetProductForm();
  }

  handleEditProduct(product: Product): void {
    this.editingProduct = product;
    this.showAddProduct = true;

    // Clean up new images
    this.productImageUrls.forEach((url) => URL.revokeObjectURL(url));
    this.productImages = [];
    this.productImageUrls = [];

    // Load existing images of the product
    this.existingImageUrls = product.images ? [...product.images] : [];

    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.offer?.percentage || 0,
      stock: product.stock,
      category: product.category?.id || '',
      image: product.images?.[0] || '',
    };
  }

  handleSubmitProduct(event: Event): void {
    event.preventDefault();

    if (!this.validateProductForm()) {
      this.setFormError('Please fill in all required fields');
      return;
    }

    this.isLoading = true;

    if (this.editingProduct) {
      // Edit mode
      const updateData: UpdateProductDto = {
        name: this.productForm.name,
        description: this.productForm.description,
        price: this.productForm.price,
        stock: this.productForm.stock,
      };

      // Handle category correctly
      if (this.productForm.category) {
        updateData.categoryId = this.productForm.category;
      } else {
        updateData.categoryId = null;
      }

      // To let the backend know which images to keep
      updateData.imagesToKeep = this.existingImageUrls;

      // Add new images if they have been selected
      if (this.productImages.length > 0) {
        updateData.images = this.productImages;
      }

      this.productService.updateProduct(this.editingProduct.id, updateData).subscribe({
        next: (updatedProduct) => {
          // Update local list
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
          console.error('Error details:', err.error);
          this.setFormError(err.error?.message || 'Unable to update product. Please try again.');
          this.isLoading = false;
        },
      });
    } else {
      // Create mode
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
          // Reload products to have complete data (populated category)
          this.loadCraftsmanProducts();

          this.showAlert('Product added successfully!', 'success');
          this.handleCancelEdit();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.setFormError(err.error?.message || 'Unable to create product. Please try again.');
          this.isLoading = false;
        },
      });
    }
  }

  validateProductForm(): boolean {
    // Check basic required fields
    const basicFieldsValid = !!(
      (
        this.productForm.name &&
        this.productForm.description &&
        this.productForm.price >= 0 &&
        this.productForm.stock >= 0 &&
        this.productForm.category
      )
    );

    // In create mode, at least one image is required
    if (!this.editingProduct) {
      return basicFieldsValid && this.productImages.length > 0;
    }

    // In edit mode, check that there is at least one image (existing or new)
    const hasImages = this.existingImageUrls.length > 0 || this.productImages.length > 0;
    return basicFieldsValid && hasImages;
  }

  handleDeleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Remove from local array
          this.products = this.products.filter((p) => p.id !== productId);
          this.stats.totalProducts = this.products.length;
          this.showAlert('Product deleted successfully!', 'success');
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.showAlert('Unable to delete product', 'error');
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

    // Clean up new images
    this.productImageUrls.forEach((url) => URL.revokeObjectURL(url));
    this.productImages = [];
    this.productImageUrls = [];
    this.existingImageUrls = [];
    this.productFormError = '';
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
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  goBack(): void {
    this.location.back();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatusRequest) {
    if (!orderId) return;

    this.isLoading = true;

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        // Update local order status
        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus;
        }

        // Update statistics
        this.updateStats();

        this.showAlert('Order status updated successfully!', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.showAlert('Unable to update order status', 'error');
        this.isLoading = false;
      },
    });
  }

  // ================== Image Management ==================
  productImages: File[] = []; // New image files selected
  productImageUrls: string[] = []; // Blob URLs of new images
  existingImageUrls: string[] = []; // URLs of existing product images
  fileError: string = '';
  private errorTimeout?: any;

  // Calculate total number of images (existing + new)
  get totalImagesCount(): number {
    return this.existingImageUrls.length + this.productImages.length;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    this.clearError();

    // Check maximum number of images (5 in total)
    if (this.totalImagesCount + files.length > 5) {
      this.showError(
        `You can upload a maximum of 5 images in total. Currently you have ${this.totalImagesCount} image(s).`
      );
      input.value = '';
      return;
    }

    let hasError = false;

    files.forEach((file) => {
      // Check size (1MB max)
      if (file.size > 1024 * 1024) {
        this.showError(`File "${file.name}" is too large. Maximum size is 1 MB.`);
        hasError = true;
        return;
      }

      // Check type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.showError(`File "${file.name}" is not a valid format. Only PNG and JPG are accepted.`);
        hasError = true;
        return;
      }

      if (!hasError) {
        // Add file to array
        this.productImages.push(file);
        // Create and store blob URL
        this.productImageUrls.push(URL.createObjectURL(file));
      }
    });

    // Reset input to allow re-selecting the same file
    input.value = '';

    // If error, clean up any images that may have been added
    if (hasError) {
      // Keep only the valid images already added
      console.log('Some files were rejected due to validation errors');
    }
  }

  removeExistingImage(index: number, event: Event): void {
    event.stopPropagation();
    this.existingImageUrls.splice(index, 1);
    this.clearError();
  }

  removeNewImage(index: number, event: Event): void {
    event.stopPropagation();

    // Revoke blob URL to free memory
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
    this.existingImageUrls = [];
    this.resetProductForm();
    this.clearError();
    this.productFormError = '';
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
