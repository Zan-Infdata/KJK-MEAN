import { Component, OnInit, ViewChild } from '@angular/core';
import { Item } from '../shared/classes/item';
import { KjkDataService } from '../shared/services/kjk-data.service';

import {MatTableDataSource} from '@angular/material/table';

import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  protected items: any;
  protected displayedColumns = ['code', 'name', 'desc', 'loc', 'quantity', 'btn'];


  constructor(
    private kjkDataService: KjkDataService
  ) { }

  ngOnInit(): void {
    this.getItems();
  }


  applyFilter(filterValue: any) {
    filterValue = filterValue.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.items.filter = filterValue;
  }

  private getItems = (): void => {
    this.kjkDataService.getItems().subscribe((items: Item[]) => {
      this.items = new MatTableDataSource(items);
      this.items.paginator = this.paginator;
    })
  }
}
