import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, ProductFilters } from '../../../../core/models';

@Component({
  selector: 'app-search-filters-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filters-bar.html',
  styleUrl: './search-filters-bar.css',
})
export class SearchFiltersBar {
  constructor(private categoryService: CategoryService) {}

  // List of categories to display in the filter bar
  categories: Category[] = [];

  // Filter state variables
  productName: string = '';
  craftsmanName: string = '';
  selectedCategories: string[] = [];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number = 0;
  freeShipping: boolean = false;
  sortByPrice?: 'asc' | 'desc' | undefined;

  // Event emitter to notify parent component of filter changes
  @Output() filtersChange = new EventEmitter<ProductFilters>();

  // Fetch categories on component initialization
  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.items;
      },
      error: (err) => console.error(err),
    });
  }

  // Emit filter changes to the parent component
  onFilterChange() {
    const filters: ProductFilters = {
      productName: this.productName || undefined,
      craftsmanName: this.craftsmanName || undefined,
      categoryIds: this.selectedCategories.length > 0 ? this.selectedCategories : undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating != null ? Number(this.minRating) : undefined,
      freeShipping: this.freeShipping || undefined,
      sortByPrice: this.sortByPrice,
    };
    this.filtersChange.emit(filters);
  }

  // Toggle category selection
  toggleCategory(categoryId: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedCategories.includes(categoryId)) {
        this.selectedCategories.push(categoryId);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter((id) => id !== categoryId);
    }
    this.onFilterChange();
  }
}
