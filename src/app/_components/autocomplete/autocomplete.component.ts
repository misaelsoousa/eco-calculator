import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AutocompleteOption {
  id: number;
  cidade: string;
  value: string;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full">
      <input
        type="text"
        [placeholder]="placeholder"
        [(ngModel)]="searchText"
        (input)="onInputChange()"
        (focus)="onFocus()"
        (blur)="onBlur()"
        class="w-full border-2 border-black/5 p-4 rounded-lg font-medium focus:outline-none focus:border-main-yellow custom-select"
        [class.border-main-yellow]="isOpen"
        [disabled]="disabled"
      />

      <div
        *ngIf="isOpen && filteredOptions.length > 0"
        class="absolute z-50 w-full mt-1 bg-white border-2 border-black/5 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          *ngFor="let option of filteredOptions"
          (click)="selectOption(option)"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          {{ option.cidade }}
        </div>
      </div>

      <div
        *ngIf="isOpen && searchText && filteredOptions.length === 0"
        class="absolute z-50 w-full mt-1 bg-white border-2 border-black/5 rounded-lg shadow-lg p-4 text-gray-500"
      >
        Nenhum município encontrado
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() options: AutocompleteOption[] = [];
  @Input() placeholder: string = 'Digite para buscar...';
  @Input() disabled: boolean = false;

  @Output() optionSelected = new EventEmitter<AutocompleteOption>();

  searchText: string = '';
  isOpen: boolean = false;
  selectedOption: AutocompleteOption | null = null;
  filteredOptions: AutocompleteOption[] = [];

  private onChange = (value: AutocompleteOption | null) => { };
  private onTouched = () => { };

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  onInputChange() {
    this.filterOptions();
    this.isOpen = true;
  }

  onFocus() {
    if (!this.disabled) {
      this.isOpen = true;
      this.filterOptions();
    }
  }

  onBlur() {
    setTimeout(() => {
      this.isOpen = false;
    }, 200);
  }

  filterOptions() {
    if (!this.searchText.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredOptions = this.options.filter(option =>
        option.cidade.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower)
      );
    }
  }

  selectOption(option: AutocompleteOption) {
    this.selectedOption = option;
    this.searchText = option.cidade;
    this.isOpen = false;
    this.onChange(option);
    this.onTouched();
    this.optionSelected.emit(option);
  }

  writeValue(value: AutocompleteOption | null): void {
    this.selectedOption = value;
    if (value) {
      this.searchText = value.cidade;
    } else {
      this.searchText = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
