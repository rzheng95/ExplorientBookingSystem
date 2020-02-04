import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vendor } from '../../../models/vendor.model';
import { Subscription } from 'rxjs';
import { VendorsService } from 'src/app/services/vendors/vendors.service';

@Component({
  selector: 'app-search-vendor',
  templateUrl: './search-vendor.component.html',
  styleUrls: ['./search-vendor.component.css']
})
export class SearchVendorComponent implements OnInit {
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
  }

  filterVendors() {}

  onClearForm() {
    this.form.reset();
  }
}
