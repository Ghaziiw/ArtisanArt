import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { CraftsmanService } from '../../core/services/craftsman.service';
import { RouterLink } from '@angular/router';
import { Category, Craftsman, CreateAdminDto, User } from '../../core/models';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { set } from 'better-auth';
import { Footer } from '../../shared/components/footer/footer';
import { CategoryService } from '../../core/services/category.service';

interface CombinedUser extends User {
  craftsmanInfo?: Craftsman;
}

@Component({
  selector: 'app-admin-ctrl-page',
  imports: [Header, CommonModule, RouterLink, FormsModule, Footer],
  templateUrl: './admin-ctrl-page.html',
  styleUrl: './admin-ctrl-page.css',
})
export class AdminCtrlPage implements OnInit {
  currentTab: 'all' | 'clients' | 'artisans' | 'admin' | 'category' = 'all';
  users: CombinedUser[] = [];
  filteredUsers: CombinedUser[] = [];
  currentUserId: string | null = null;

  totalUsers = 0;
  totalArtisans = 0;
  totalClients = 0;
  totalAdmins = 0;
  totalCategories = 0;
  needRenewal = 0;

  addCategory = false;
  categories: Category[] = [];
  isLoadingCategories = false;
  categoryError = '';
  isSubmittingCategory = false;
  newCategoryName = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private craftsmanService: CraftsmanService,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id;
      }
    });

    this.loadUsers();
    this.loadCategories();
  }

  // ============ CATEGORY MANAGEMENT ============

  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryError = '';

    this.categoryService.getCategories(1, 100).subscribe({
      next: (response) => {
        this.categories = response.items;
        this.totalCategories = response.meta.totalItems;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categoryError = 'Failed to load categories';
        this.isLoadingCategories = false;
      },
    });
  }

  handleAddCategory() {
    if (!this.newCategoryName.trim()) {
      this.categoryError = 'Please enter a category name';
      setTimeout(() => (this.categoryError = ''), 3000);
      return;
    }

    this.isSubmittingCategory = true;
    this.categoryError = '';

    // Use the CategoryService to create category
    this.categoryService.createCategory(this.newCategoryName.trim()).subscribe({
      next: (response) => {
        console.log('Category created successfully:', response);
        this.newCategoryName = '';
        this.addCategory = false;
        this.isSubmittingCategory = false;
        this.loadCategories(); // Reload the list
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.categoryError = error.error?.message || 'Error creating category. Please try again.';
        this.isSubmittingCategory = false;
        setTimeout(() => (this.categoryError = ''), 5000);
      },
    });
  }

  handleDeleteCategory(categoryId: string, categoryName: string) {
    if (
      !confirm(
        `Are you sure you want to delete the category "${categoryName}"?\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    // Use the CategoryService to delete category
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        console.log('Category deleted successfully');
        this.loadCategories(); // Reload the list
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.categoryError = error.error?.message || 'Error deleting category. Please try again.';
        setTimeout(() => (this.categoryError = ''), 5000);
      },
    });
  }

  cancelAddCategory() {
    this.addCategory = false;
    this.newCategoryName = '';
    this.categoryError = '';
  }

  loadCurrentUser() {
    // Retrieve the current user from localStorage or your authentication service
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUserId = JSON.parse(currentUser).id;
    }
  }

  async loadUsers() {
    try {
      // Load all users via the service
      this.userService.getAllUsers(undefined, 1, 100).subscribe({
        next: async (usersResponse) => {
          // Load all craftsmen
          const craftsmenResponse: any = await this.http
            .get('http://localhost:3000/craftsmen?page=1&limit=100')
            .toPromise();

          // Create a map of craftsmen by userId
          const craftsmenMap = new Map<string, Craftsman>();
          craftsmenResponse.items.forEach((craftsman: Craftsman) => {
            craftsmenMap.set(craftsman.userId, craftsman);
          });

          // Combine the data
          this.users = usersResponse.items.map((user: User) => {
            const combinedUser: CombinedUser = { ...user };
            if (user.role === 'artisan' && craftsmenMap.has(user.id)) {
              combinedUser.craftsmanInfo = craftsmenMap.get(user.id);
            }
            return combinedUser;
          });

          // Exclude the current admin user from the list
          this.users = this.users.filter((user) => user.id !== this.currentUserId);

          this.calculateStats();
          this.filterUsers();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
        },
      });
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  calculateStats() {
    this.totalUsers = this.users.length;
    this.totalArtisans = this.users.filter((u) => u.role === 'artisan').length;
    this.totalClients = this.users.filter((u) => u.role === 'client').length;
    this.totalAdmins = this.users.filter(
      (u) => u.role === 'admin' && u.id !== this.currentUserId
    ).length;

    const now = new Date();
    this.needRenewal = this.users.filter((u) => {
      if (u.role === 'artisan' && u.craftsmanInfo?.expirationDate) {
        const expirationDate = new Date(u.craftsmanInfo.expirationDate);
        return expirationDate < now;
      }
      return false;
    }).length;
  }

  filterUsers() {
    switch (this.currentTab) {
      case 'artisans':
        this.filteredUsers = this.users.filter((u) => u.role === 'artisan');
        break;
      case 'clients':
        this.filteredUsers = this.users.filter((u) => u.role === 'client');
        break;
      case 'admin':
        this.filteredUsers = this.users.filter((u) => u.role === 'admin');
        break;
      default:
        this.filteredUsers = [...this.users];
    }
  }

  changeTab(tab: 'all' | 'clients' | 'artisans' | 'admin' | 'category') {
    this.currentTab = tab;
    this.filterUsers();
  }

  isExpired(expirationDate: string | null): boolean {
    if (!expirationDate) return true;
    return new Date(expirationDate) < new Date();
  }

  getExpirationStatus(expirationDate: string | null): 'expired' | 'active' | null {
    if (!expirationDate) return null;
    return this.isExpired(expirationDate) ? 'expired' : 'active';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  onSuspendUser(user: CombinedUser) {
    if (!confirm(`Suspend ${user.name}?`)) return;

    this.craftsmanService.updateExpirationDate(user.id, null).subscribe({
      next: () => {
        // Update locally (expirationDate = null)
        user.craftsmanInfo!.expirationDate = null;
        this.calculateStats();
      },
      error: (err: any) => {
        console.error('Error suspending user:', err);
      },
    });
  }

  onDeleteUser(user: CombinedUser) {
    if (!confirm(`Delete user "${user.name}" ?`)) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        // Remove from local list
        this.users = this.users.filter((u) => u.id !== user.id);

        // Recompute stats
        this.calculateStats();

        // Re-apply tab filter
        this.filterUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
      },
    });
  }

  // MMethod for search
  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    if (!searchTerm) {
      // If the search is empty, display all users filtered by tab
      this.filterUsers();
      return;
    }

    // Filter locally on name, email, businessName and specialty
    this.filteredUsers = this.users.filter((user) => {
      const matchesTab =
        this.currentTab === 'all' ||
        (this.currentTab === 'artisans' && user.role === 'artisan') ||
        (this.currentTab === 'clients' && user.role === 'client');

      if (!matchesTab) return false;

      const nameMatch = user.name.toLowerCase().includes(searchTerm);
      const emailMatch = user.email.toLowerCase().includes(searchTerm);
      const businessNameMatch = user.craftsmanInfo?.businessName
        ?.toLowerCase()
        .includes(searchTerm);
      const specialtyMatch = user.craftsmanInfo?.specialty?.toLowerCase().includes(searchTerm);

      return nameMatch || emailMatch || businessNameMatch || specialtyMatch;
    });
  }

  openDatePicker(dateInput: HTMLInputElement, user: CombinedUser) {
    dateInput.showPicker();
  }

  onDateSelected(event: any, user: CombinedUser) {
    const newExpDate = event.target.value;

    this.craftsmanService.updateExpirationDate(user.id, newExpDate).subscribe({
      next: () => {
        if (user.craftsmanInfo) {
          user.craftsmanInfo.expirationDate = newExpDate;
          this.calculateStats();
        }
      },
      error: (err) => console.error(err),
    });
  }

  //----------- Add Admin User Form -----------
  showAddAdminForm = false;
  isSubmitting = false;
  adminFormError = '';

  adminForm: CreateAdminDto = {
    name: '',
    email: '',
    password: '',
    location: '',
  };

  toggleAddAdminForm() {
    this.showAddAdminForm = !this.showAddAdminForm;
    if (!this.showAddAdminForm) {
      this.resetAdminForm();
    }
  }

  resetAdminForm() {
    this.adminForm = {
      name: '',
      email: '',
      password: '',
      location: '',
    };
    this.adminFormError = '';
    this.isSubmitting = false;
  }

  handleSubmitAdmin(event: Event) {
    event.preventDefault();

    // Validation
    if (!this.adminForm.name || !this.adminForm.email || !this.adminForm.password) {
      this.adminFormError = 'Please fill in all required fields';
      setTimeout(() => {
        this.adminFormError = '';
      }, 5000);
      return;
    }

    if (this.adminForm.password.length < 8) {
      this.adminFormError = 'Password must be at least 8 characters';
      setTimeout(() => {
        this.adminFormError = '';
      }, 5000);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.adminForm.email)) {
      this.adminFormError = 'Please enter a valid email address';
      setTimeout(() => {
        this.adminFormError = '';
      }, 5000);
      return;
    }

    this.isSubmitting = true;
    this.adminFormError = '';

    const adminData = {
      name: this.adminForm.name,
      email: this.adminForm.email,
      password: this.adminForm.password,
      location: this.adminForm.location || undefined,
    };

    this.userService.addAdminUser(adminData).subscribe({
      next: () => {
        console.log('Admin created successfully');
        this.loadUsers();
        this.toggleAddAdminForm();
        alert('Admin user created successfully!');
      },
      error: (error) => {
        this.adminFormError =
          error.error?.message || 'Error creating admin user. Please try again.';
        this.isSubmitting = false;

        setTimeout(() => {
          this.adminFormError = '';
        }, 5000);
      },
    });
  }
}
