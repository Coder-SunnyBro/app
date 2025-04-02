import {Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AddEmployeeComponent } from '../add-employee//add-employee-dialog.component';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../service/employee.service';
import { AgGridAngular, AgGridModule } from "ag-grid-angular";
import { ColDef, GridApi, ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule, provideGlobalGridOptions } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy"});

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatCardModule,
            MatButtonModule,
            MatDialogModule,
            CommonModule,
            MatFormFieldModule,
            MatInputModule,
            AgGridAngular,
            AgGridModule,
          ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {
  rowData:Employee[] = []
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, minWidth: 30 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'DOJ', field: 'joining_date', sortable: true, filter: true },
    { headerName: 'Department', field: 'department', sortable: true, filter: true },
    { headerName: 'Address', field: 'address', sortable: true, filter: true },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: (params: any) => {
        const eDiv = document.createElement('div');
        eDiv.innerHTML = `
          <button class="action-btn delete-btn" title="Delete">
            <mat-icon>delete</mat-icon>
          </button>
          <button class="action-btn update-btn" title="Update">
            <mat-icon>edit</mat-icon>
          </button>
          <button class="action-btn view-btn" title="View">
            <mat-icon>visibility</mat-icon>
          </button>
        `;
        // eDiv.querySelector('.delete-btn')?.addEventListener('click', () => this.deleteEmployee(params.data.id));
        eDiv.querySelector('.update-btn')?.addEventListener('click', () => this.addEmployee(params.data));
        // eDiv.querySelector('.view-btn')?.addEventListener('click', () => this.viewEmployee(params.data.id));
        return eDiv;
      },
      sortable: false,
      filter: false,
    },
  ];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];


  constructor(private dialog:MatDialog,private service:EmployeeService) { }

  ngOnInit(): void {
    this.getEmloyees()
  }


  addEmployee(gridData?:Employee[]) {

    const dialogRef = this.dialog.open(AddEmployeeComponent,{
      data: {
        title: gridData ? 'Update Employee' : 'Add Employee',
        gridData: gridData || {}
      },
      width: '50%',
      enterAnimationDuration:700,
      exitAnimationDuration: 700
    })
    console.log(dialogRef,'dialog data');

    dialogRef.afterClosed().subscribe(()=>{
      this.service.refreshEmployeeList()
      this.getEmloyees()
    })
    // .afterClosed().subscribe(()=>{
    //     this.getEmloyees()
    // })
  }


  getEmloyees(){
    this.service.refreshEmployeeList();
    this.service.getAllEmployee().subscribe((data:Employee[])=>{
      this.rowData = data
    })
  }
}
