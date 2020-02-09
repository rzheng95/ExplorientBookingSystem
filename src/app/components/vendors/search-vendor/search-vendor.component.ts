import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vendor } from '../../../models/vendor.model';
import { Subscription } from 'rxjs';
import { VendorsService } from '../../../services/vendors/vendors.service';

@Component({
  selector: 'app-search-vendor',
  templateUrl: './search-vendor.component.html',
  styleUrls: ['./search-vendor.component.css']
})
export class SearchVendorComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;

  vendors: Vendor[];
  filteredVendors: Vendor[];
  vendorsSub: Subscription;

  constructor(private vendorsService: VendorsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      vendorName: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.vendorsSub = this.vendorsService.getVendors().subscribe(vendors => {
      this.vendors = vendors;
    });
  }

  ngOnDestroy() {
    this.vendorsSub.unsubscribe();
  }

  filterVendors() {
    this.isLoading = true;

    this.filteredVendors = this.vendors.filter(option =>
      option.vendorName
        .toLowerCase()
        .includes(this.form.value.vendorName.trim().toLowerCase())
    );

    this.isLoading = false;
  }

  onClearForm() {
    this.form.reset();
  }
}
