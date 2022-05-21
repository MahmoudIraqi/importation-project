import {Component, OnInit} from '@angular/core';
import {FormService} from '../services/form.service';
import {convertFromStringToArrayWithCommaSeparator} from '../../utils/formDataFunction';

@Component({
  selector: 'app-approved-request',
  templateUrl: './approved-request.component.html',
  styleUrls: ['./approved-request.component.scss']
})
export class ApprovedRequestComponent implements OnInit {

  approvedListRequests;
  alertErrorNotificationStatus: boolean = false;
  alertErrorNotification: any;
  isLoading: boolean = false;
  typeOfApprovedList;
  typeOfApprovedListWithComments;
  typeOfApprovedHoldList;

  constructor(private getService: FormService) {
  }

  ngOnInit(): void {
    // this.selectApprovedProductType('approvedProduct');
  }

  handleError(message) {
    this.alertErrorNotificationStatus = true;
    this.alertErrorNotification = {msg: message};
    this.isLoading = false;
  }

  onClosedErrorAlert() {
    setTimeout(() => {
      this.alertErrorNotificationStatus = false;
    }, 2000);
  }

  // selectApprovedProductType(whichType) {
  //   this.typeOfApprovedList = whichType;
  //
  //   if (whichType === 'approvedProduct') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedProductsList().subscribe((res: any) => {
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   } else if (whichType === 'approvedProductWithComment') {
  //     this.selectApprovedProductWithCommentsType('approvedProductWithRegComment');
  //   } else if (whichType === 'holdProducts') {
  //     this.selectApprovedHoldProductType('approvedHoldProductWithRegComment');
  //   }
  // }
  //
  // selectApprovedProductWithCommentsType(whichType) {
  //   this.typeOfApprovedListWithComments = whichType;
  //
  //   if (whichType === 'approvedProductWithLabsComments') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedProductsWithCommentsFromLabsList().subscribe((res: any) => {
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   } else if (whichType === 'approvedProductWithRegComment') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedProductsWithCommentsFromRegList().subscribe((res: any) => {
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   } else if (whichType === 'approvedProductWithVariationComment') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedProductsWithCommentsFromVariationList().subscribe((res: any) => {
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   }
  // }
  //
  // selectApprovedHoldProductType(whichType) {
  //   this.typeOfApprovedHoldList = whichType;
  //
  //   if (whichType === 'approvedHoldProductWithLabsComments') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedHoldProductsFromLabList().subscribe((res: any) => {
  //       res.map(item => {
  //         item.RejectionResons = convertFromStringToArrayWithCommaSeparator(item.RejectionResons);
  //       });
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   } else if (whichType === 'approvedHoldProductWithRegComment') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedHoldProductsFromRegList().subscribe((res: any) => {
  //       res.map(item => {
  //         item.RejectionResons = convertFromStringToArrayWithCommaSeparator(item.RejectionResons);
  //       });
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   } else if (whichType === 'approvedHoldProductWithVariationComments') {
  //     this.isLoading = true;
  //     this.approvedListRequests = null;
  //
  //     this.getService.getApprovedHoldProductsFromVariationList().subscribe((res: any) => {
  //       res.map(item => {
  //         item.RejectionResons = convertFromStringToArrayWithCommaSeparator(item.RejectionResons);
  //       });
  //       this.approvedListRequests = {
  //         tableHeader: ['Notification', 'Notification date', 'Type of Notification', 'Product English name', 'Need Action', 'Update Product', 'Add Batch'],
  //         tableBody: res
  //       };
  //       this.isLoading = false;
  //     }, error => this.handleError(error));
  //   }
  // }
}
