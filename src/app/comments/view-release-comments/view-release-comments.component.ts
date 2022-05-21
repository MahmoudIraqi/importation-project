import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';
import { KeyValue } from '@angular/common';
import { Inspection } from '../comments.model';

export interface ViewReleaseCommentsComponentDataDialog {
  requestId: number;
}

interface IItemComment {
  comments: KeyValue<string, string>[];
  shortName: string;
}

interface IInvoicesComment {
  comments: KeyValue<string, string>[];
  invoiceNo: string;
  items: IItemComment[];
}

@Component({
  selector: 'app-view-release-comments',
  templateUrl: './view-release-comments.component.html',
  styleUrls: ['./view-release-comments.component.scss']
})
export class ViewReleaseCommentsComponent implements OnInit {

  RequestDetailsComment: KeyValue<string, string>[] = [];
  invoicesComment: IInvoicesComment[] = [];
  emptyComment = '-------------';

  constructor(public dialogRef: MatDialogRef<ViewReleaseCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewReleaseCommentsComponentDataDialog, private formSvc: FormService) { }

  ngOnInit(): void {
    this.formSvc.getStepComments(this.data.requestId).subscribe(res => {
      this.RequestDetailsComment = Object.entries(res.jsonRequestComments.RequestDetailsCommentDto).map(([key, value]) => ({ key, value }));
      this.invoicesComment = this.mapInvoicesComment(res.jsonRequestComments.invoices);
    })
  }

  mapInvoicesComment(Invoices: Inspection.Invoice[]): IInvoicesComment[] {
    return Invoices.map(inv => ({
      comments: Object.entries(inv.InvoiceCommentDto).map(([key, value]) => ({ key, value })),
      invoiceNo: inv.invoiceNo,
      items: this.mapItemsComments(inv.itemDetails)
    }));
  }

  mapItemsComments(items: Inspection.ItemDetail[]): IItemComment[] {
    return items.map(item => ({
      comments: Object.entries(item.ItemDetailCommentDto).map(([key, value]) => ({ key, value })),
      shortName: item.shortName
    }))
  }

}
