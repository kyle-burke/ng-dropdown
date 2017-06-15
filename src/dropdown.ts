import {
  Directive,
  Output,
  Input,
  EventEmitter,
  ContentChild,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[dropdown-menu]',
  host: {
    '[class.dropdown-menu]': 'true',
    '[class.open]': 'open',
  }
})
export class DropdownContainer {
  @Input() open = false;

  get element() { return this._eref.nativeElement; }

  constructor(private _eref: ElementRef) {}
}

@Directive({
  selector: '[dropdown-toggle]',
  host: {
    '(click)': 'onClick.emit()'
  }
})
export class DropdownToggle {
  @Output() onClick = new EventEmitter();
}

@Directive({
  selector: '[dropdown]',
  host: {
    '[class.dropdown]': 'true',
    '(document:click)': 'onClick($event)'
  }
})
export class Dropdown {
  // When set to true, will prevent the dropdown from closing when clicking inside the menu.
  @Input() closeOnInternalClick = true;

  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();

  @ContentChild(DropdownContainer) dropdownContainer: DropdownContainer;
  @ContentChild(DropdownToggle) dropdownToggle: DropdownToggle;

  constructor(private _eref: ElementRef) {}

  ngAfterContentInit() {
    this.dropdownToggle.onClick.subscribe(() => {
      this.dropdownContainer.open = !this.dropdownContainer.open;

      if (this.dropdownContainer.open) {
        this.open.emit();
      } else {
        this.close.emit();
      }
    });
  }

  onClick($event: MouseEvent) {
    const clickOutsideOfDropdown = !this._eref.nativeElement.contains($event.target);
    const nonMultipleClickInsideOfDropdown = this.dropdownContainer.element.contains($event.target) && this.closeOnInternalClick;

    if (clickOutsideOfDropdown || nonMultipleClickInsideOfDropdown) {
      this.dropdownContainer.open = false;
    }
  }
}
